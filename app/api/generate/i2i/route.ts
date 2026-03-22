import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

export const maxDuration = 60;

const MODELS: Record<string, string> = {
  "pix2pix":      "timbrooks/instruct-pix2pix",
  "sdxl-refiner": "stabilityai/stable-diffusion-xl-refiner-1.0",
};

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const imageFile = formData.get("image") as File | null;
  const prompt    = formData.get("prompt") as string | null;
  const model     = (formData.get("model") as string) || "pix2pix";
  const negative_prompt = (formData.get("negative_prompt") as string) || undefined;
  const strength  = parseFloat((formData.get("strength") as string) || "0.75");
  const steps     = parseInt((formData.get("steps") as string) || "20", 10);

  if (!imageFile) return NextResponse.json({ error: "image file is required" }, { status: 400 });
  if (!prompt)    return NextResponse.json({ error: "prompt is required" }, { status: 400 });

  const modelId  = MODELS[model] ?? MODELS["pix2pix"];
  const imageBlob = new Blob([await imageFile.arrayBuffer()], { type: imageFile.type || "image/jpeg" });

  try {
    const resultBlob = await hf.imageToImage({
      model: modelId,
      inputs: imageBlob,
      parameters: {
        prompt,
        ...(negative_prompt ? { negative_prompt } : {}),
        num_inference_steps: steps,
        image_guidance_scale: 1.5,
        strength,
      },
    });

    return new Response(resultBlob, {
      headers: {
        "Content-Type": resultBlob.type || "image/jpeg",
        "Cache-Control": "no-store",
        "X-Model": modelId,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Image editing failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
