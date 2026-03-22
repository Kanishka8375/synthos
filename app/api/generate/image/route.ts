import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { HfInference } from "@huggingface/inference";
import { LIMITS, trunc, clampDim, checkRateLimit } from "@/lib/api-guard";

const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

export const maxDuration = 60;

const STYLE_PROMPTS: Record<string, string> = {
  "anime":          "anime style, manga art, vibrant cel shading, 2D illustration",
  "cinematic":      "cinematic photography, dramatic lighting, film grain, anamorphic lens, movie still, 8K HDR",
  "photorealistic": "photorealistic, hyperrealistic, DSLR photography, 85mm lens, natural light, sharp focus, 8K, no anime, no cartoon",
  "manga":          "manga style, black and white ink illustration, screentone shading, comic panel art",
  "oil painting":   "oil painting, impressionist, thick brushstrokes, canvas texture, classical fine art",
  "3d render":      "3D CGI render, octane render, ray tracing, studio lighting, physically based rendering",
  "pixel art":      "pixel art, 16-bit retro game sprites, pixelated, retro gaming aesthetic",
  "watercolor":     "watercolor painting, soft color washes, paper texture, loose artistic brushwork",
};

// FLUX.1-schnell is free and fast (4-step); fall back to SDXL for larger images
const MODEL = "black-forest-labs/FLUX.1-schnell";

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
  const style      = body.style as string | undefined;
  const project_id = body.project_id as string | undefined;
  const width      = clampDim(body.width,  768);
  const height     = clampDim(body.height, 512);

  if (!prompt) return NextResponse.json({ error: "prompt is required" }, { status: 400 });

  const styleKey     = (style ?? "").toLowerCase();
  const styleKeywords = STYLE_PROMPTS[styleKey] ?? (style ? `${style} style` : "");
  const fullPrompt   = styleKeywords
    ? `${styleKeywords}, high quality, detailed: ${prompt}`
    : `high quality, detailed: ${prompt}`;

  try {
    const imageBlob = await hf.textToImage({
      model: MODEL,
      inputs: fullPrompt,
      parameters: { width, height, num_inference_steps: 4 },
    }) as unknown as Blob;

    // Convert to base64 data URI for the client
    const buffer = Buffer.from(await imageBlob.arrayBuffer());
    const dataUri = `data:${imageBlob.type || "image/jpeg"};base64,${buffer.toString("base64")}`;

    const { data, error } = await supabase
      .from("generated_images")
      .insert({
        user_id:    user.id,
        project_id: project_id ?? null,
        prompt,
        url:        `hf:${MODEL}`,   // store model ref, not the data URI
      })
      .select()
      .single();

    if (error) return NextResponse.json({ url: dataUri, saved: false });
    return NextResponse.json({ url: dataUri, id: data.id, saved: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Image generation failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const project_id = searchParams.get("project_id");

  const query = supabase
    .from("generated_images")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (project_id) query.eq("project_id", project_id);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Internal error" }, { status: 500 });

  return NextResponse.json({ images: data });
}
