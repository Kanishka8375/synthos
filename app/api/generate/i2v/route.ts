import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { trunc, LIMITS, validateImageFile, checkRateLimit } from "@/lib/api-guard";

const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;

export const maxDuration = 120;

const I2V_MODELS: Record<string, string> = {
  "svd-xt": "stabilityai/stable-video-diffusion-img2vid-xt",
  "svd":    "stabilityai/stable-video-diffusion-img2vid",
  "i2vgen": "ali-vilab/i2vgen-xl",
};

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!HF_TOKEN) return NextResponse.json({ error: "HUGGINGFACE_TOKEN not configured" }, { status: 503 });

  // Level 4: rate limit
  if (!checkRateLimit(user.id)) {
    return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
  }

  const formData  = await request.formData();
  const imageFile = formData.get("image") as File | null;
  const model     = (formData.get("model") as string) || "svd-xt";
  // Level 1: truncate prompt
  const prompt    = trunc((formData.get("prompt") as string) || "", LIMITS.PROMPT);

  if (!imageFile) return NextResponse.json({ error: "image file is required" }, { status: 400 });

  // Level 3: file upload validation
  const imgErr = validateImageFile(imageFile);
  if (imgErr) return NextResponse.json({ error: imgErr }, { status: 400 });

  const modelId       = I2V_MODELS[model] ?? I2V_MODELS["svd-xt"];
  const imageBuffer   = await imageFile.arrayBuffer();
  const imageType     = imageFile.type || "image/jpeg";

  try {
    // SVD models take raw image bytes; i2vgen-xl may need JSON with base64
    const isI2VGen = modelId.includes("i2vgen");

    let body: BodyInit;
    let contentType: string;

    if (isI2VGen) {
      // i2vgen-xl expects JSON with base64 image + optional text prompt
      const base64 = Buffer.from(imageBuffer).toString("base64");
      body = JSON.stringify({
        inputs: { image: `data:${imageType};base64,${base64}`, prompt },
      });
      contentType = "application/json";
    } else {
      // SVD takes raw image bytes directly
      body = imageBuffer;
      contentType = imageType;
    }

    const hfRes = await fetch(`https://api-inference.huggingface.co/models/${modelId}`, {
      method: "POST",
      headers: {
        "Authorization":    `Bearer ${HF_TOKEN}`,
        "Content-Type":     contentType,
        "x-wait-for-model": "true",
      },
      body,
      signal: AbortSignal.timeout(110_000),
    });

    if (!hfRes.ok) {
      const errText = await hfRes.text().catch(() => "");
      let parsed: Record<string, unknown> = {};
      try { parsed = JSON.parse(errText); } catch { /* raw */ }
      return NextResponse.json(
        { error: `Image-to-video failed (${hfRes.status}): ${(parsed as { error?: string }).error ?? errText}` },
        { status: 502 }
      );
    }

    supabase.from("generated_images").insert({
      user_id: user.id, prompt: prompt || "image-to-video", url: `hf:${modelId}`,
    }).then(() => {});

    return new Response(hfRes.body, {
      headers: {
        "Content-Type":  hfRes.headers.get("content-type") ?? "video/mp4",
        "Cache-Control": "no-store",
        "X-Model":       modelId,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Image-to-video failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
