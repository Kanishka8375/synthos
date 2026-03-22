import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { LIMITS, trunc, clampInt, checkRateLimit } from "@/lib/api-guard";

const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;

export const maxDuration = 120;

const T2V_MODELS: Record<string, string> = {
  "zeroscope":   "cerspense/zeroscope_v2_576w",
  "modelscope":  "damo-vilab/text-to-video-ms-1.7b",
  "animatediff": "guoyww/animatediff-motion-adapter-v1-5-2",
};

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Level 4: rate limit
  if (!checkRateLimit(user.id)) {
    return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
  }

  const body = await request.json();
  // Level 1: validate + clamp inputs
  const prompt     = trunc(body.prompt, LIMITS.PROMPT);
  const model      = body.model ?? "zeroscope";
  const num_frames = clampInt(body.num_frames, 8, 64, 24);
  const fps        = clampInt(body.fps, 4, 24, 8);
  const project_id: string | undefined = body.project_id;

  if (!prompt) return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  if (!HF_TOKEN) return NextResponse.json({ error: "HUGGINGFACE_TOKEN not configured" }, { status: 503 });

  const modelId = T2V_MODELS[model] ?? T2V_MODELS["zeroscope"];
  const fullPrompt = `cinematic, high quality, smooth motion, 4K: ${prompt}`;

  try {
    const hfRes = await fetch(`https://api-inference.huggingface.co/models/${modelId}`, {
      method: "POST",
      headers: {
        "Authorization":    `Bearer ${HF_TOKEN}`,
        "Content-Type":     "application/json",
        "x-wait-for-model": "true",
      },
      body: JSON.stringify({
        inputs: fullPrompt,
        parameters: { num_frames, fps },
      }),
      signal: AbortSignal.timeout(110_000),
    });

    if (!hfRes.ok) {
      const errText = await hfRes.text().catch(() => "");
      let parsed: Record<string, unknown> = {};
      try { parsed = JSON.parse(errText); } catch { /* raw text */ }
      return NextResponse.json(
        { error: `Video generation failed (${hfRes.status}): ${(parsed as { error?: string }).error ?? errText}` },
        { status: 502 }
      );
    }

    // Fire-and-forget DB record
    supabase.from("generated_images").insert({
      user_id: user.id,
      project_id: project_id ?? null,
      prompt,
      url: `hf:${modelId}`,
    }).then(() => {});

    return new Response(hfRes.body, {
      headers: {
        "Content-Type":  hfRes.headers.get("content-type") ?? "video/mp4",
        "Cache-Control": "no-store",
        "X-Model":       modelId,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Video generation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
