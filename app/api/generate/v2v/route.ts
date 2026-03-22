/**
 * Video-to-Video (V2V) route
 *
 * Pipeline:
 *   1. Accept a video frame (extracted client-side) + style/transform prompt
 *   2. Apply Image-to-Image transformation (instruct-pix2pix) to the frame
 *   3. Apply Image-to-Video animation (Stable Video Diffusion) on the styled frame
 *   4. Return the resulting video
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { HfInference } from "@huggingface/inference";

const hf     = new HfInference(process.env.HUGGINGFACE_TOKEN);
const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!HF_TOKEN) return NextResponse.json({ error: "HUGGINGFACE_TOKEN not configured" }, { status: 503 });

  const formData  = await request.formData();
  const frameFile = formData.get("frame") as File | null;   // first frame extracted client-side
  const prompt    = formData.get("prompt") as string | null; // style/transform description
  const strength  = parseFloat((formData.get("strength") as string) || "0.6");
  const i2vModel  = (formData.get("i2v_model") as string) || "svd-xt";

  if (!frameFile) return NextResponse.json({ error: "frame image is required" }, { status: 400 });
  if (!prompt)    return NextResponse.json({ error: "transform prompt is required" }, { status: 400 });

  const I2V_MODELS: Record<string, string> = {
    "svd-xt": "stabilityai/stable-video-diffusion-img2vid-xt",
    "svd":    "stabilityai/stable-video-diffusion-img2vid",
  };

  try {
    // ── Step 1: Style-transfer the frame with instruct-pix2pix ──────────────
    const frameBlob = new Blob([await frameFile.arrayBuffer()], { type: frameFile.type || "image/jpeg" });

    const styledBlob = await hf.imageToImage({
      model: "timbrooks/instruct-pix2pix",
      inputs: frameBlob,
      parameters: {
        prompt,
        num_inference_steps: 20,
        image_guidance_scale: 1.5,
        strength,
      },
    });

    // ── Step 2: Animate the styled frame with SVD ────────────────────────────
    const i2vModelId  = I2V_MODELS[i2vModel] ?? I2V_MODELS["svd-xt"];
    const styledBuffer = await styledBlob.arrayBuffer();

    const hfRes = await fetch(`https://api-inference.huggingface.co/models/${i2vModelId}`, {
      method: "POST",
      headers: {
        "Authorization":    `Bearer ${HF_TOKEN}`,
        "Content-Type":     styledBlob.type || "image/jpeg",
        "x-wait-for-model": "true",
      },
      body: styledBuffer,
      signal: AbortSignal.timeout(90_000),
    });

    if (!hfRes.ok) {
      const errText = await hfRes.text().catch(() => "");
      let parsed: Record<string, unknown> = {};
      try { parsed = JSON.parse(errText); } catch { /* raw */ }
      return NextResponse.json(
        { error: `Video animation failed (${hfRes.status}): ${(parsed as { error?: string }).error ?? errText}` },
        { status: 502 }
      );
    }

    supabase.from("generated_images").insert({
      user_id: user.id, prompt, url: "hf:v2v",
    }).then(() => {});

    return new Response(hfRes.body, {
      headers: {
        "Content-Type":  hfRes.headers.get("content-type") ?? "video/mp4",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Video-to-video failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
