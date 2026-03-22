import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { HfInference } from "@huggingface/inference";
import { LIMITS, trunc, clampDim, checkRateLimit } from "@/lib/api-guard";

const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

export const maxDuration = 60;

const STYLE_MAP: Record<string, string> = {
  anime:           "anime style, manga art, vibrant cel shading, 2D illustration",
  cinematic:       "cinematic photography, dramatic lighting, film grain, anamorphic lens, 8K HDR",
  photorealistic:  "photorealistic, hyperrealistic, DSLR photography, 85mm lens, natural light, sharp focus, 8K, no anime",
  manga:           "manga style, black and white ink illustration, screentone shading, comic panel",
  "oil painting":  "oil painting, impressionist, thick brushstrokes, canvas texture, fine art",
  "3d render":     "3D CGI render, octane render, ray tracing, studio lighting, physically based",
  "pixel art":     "pixel art, 16-bit retro game sprites, pixelated, retro gaming",
  watercolor:      "watercolor painting, soft color washes, paper texture, loose brushwork",
};

const MODELS: Record<string, { id: string; steps: number }> = {
  "flux-schnell": { id: "black-forest-labs/FLUX.1-schnell",         steps: 4  },
  "sdxl":         { id: "stabilityai/stable-diffusion-xl-base-1.0", steps: 30 },
  "sd3.5":        { id: "stabilityai/stable-diffusion-3.5-large",   steps: 28 },
  "flux-dev":     { id: "black-forest-labs/FLUX.1-dev",             steps: 20 },
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
  const {
    prompt: rawPrompt,
    style,
    model = "flux-schnell",
    width:  rawWidth  = 896,
    height: rawHeight = 504,
    negative_prompt: rawNeg,
  } = body;

  // Level 1: validate + clamp inputs
  const prompt = trunc(rawPrompt, LIMITS.PROMPT);
  if (!prompt) return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  const width    = clampDim(rawWidth, 896);
  const height   = clampDim(rawHeight, 504);
  const negative_prompt = rawNeg ? trunc(rawNeg, LIMITS.PROMPT) : undefined;

  const styleKey = (style ?? "").toLowerCase();
  const stylePrefix = STYLE_MAP[styleKey] ?? (style ? `${style} style` : "");
  const fullPrompt = stylePrefix ? `${stylePrefix}, high quality, detailed, ${prompt}` : prompt;

  const { id: modelId, steps } = MODELS[model] ?? MODELS["flux-schnell"];

  try {
    const imageBlob = await hf.textToImage({
      model: modelId,
      inputs: fullPrompt,
      parameters: {
        width,
        height,
        num_inference_steps: steps,
        ...(negative_prompt ? { negative_prompt } : {}),
      },
    }) as unknown as Blob;

    return new Response(imageBlob, {
      headers: {
        "Content-Type": (imageBlob as Blob).type || "image/jpeg",
        "Cache-Control": "no-store",
        "X-Model": modelId,
        "X-Style": style ?? "none",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Image generation failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
