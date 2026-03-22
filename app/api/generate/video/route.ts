import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const POLLINATIONS_KEY = process.env.POLLINATIONS_API_KEY;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { prompt, model = "wan", duration = 4, aspectRatio = "16:9", project_id } = body as {
    prompt: string;
    model?: string;
    duration?: number;
    aspectRatio?: string;
    project_id?: string;
  };

  if (!prompt) return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  if (!POLLINATIONS_KEY) return NextResponse.json({ error: "POLLINATIONS_API_KEY not configured" }, { status: 503 });

  const encoded = encodeURIComponent(`cinematic, high quality, fluid animation, 8K: ${prompt}`);
  const videoUrl =
    `https://gen.pollinations.ai/video/${encoded}` +
    `?model=${model}&duration=${duration}&aspectRatio=${encodeURIComponent(aspectRatio)}&nologo=true`;

  try {
    const pollinationsRes = await fetch(videoUrl, {
      headers: { "Authorization": `Bearer ${POLLINATIONS_KEY}` },
    });

    if (!pollinationsRes.ok) {
      const text = await pollinationsRes.text().catch(() => "");
      let parsed: Record<string, unknown> = {};
      try { parsed = JSON.parse(text); } catch { /* raw text */ }

      // Surface a user-friendly message for payment errors
      if (pollinationsRes.status === 402) {
        return NextResponse.json({
          error: "Video generation requires Pollinations pollen balance. Top up at pollinations.ai or use a different video service.",
          code: "INSUFFICIENT_BALANCE",
        }, { status: 402 });
      }

      return NextResponse.json(
        { error: `Video generation failed (${pollinationsRes.status}): ${(parsed as { error?: { message?: string } }).error?.message ?? text}` },
        { status: 502 }
      );
    }

    supabase.from("generated_images").insert({
      user_id: user.id,
      project_id: project_id ?? null,
      prompt,
      url: videoUrl,
    }).then(() => {});

    return new Response(pollinationsRes.body, {
      headers: {
        "Content-Type": pollinationsRes.headers.get("content-type") ?? "video/mp4",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Video generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
