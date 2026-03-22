import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { HfInference } from "@huggingface/inference";
import { trunc, checkRateLimit } from "@/lib/api-guard";

const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

export const maxDuration = 60;

const MODEL = "black-forest-labs/FLUX.1-schnell";

// Emotion → visual modifier
const EMOTION_VISUALS: Record<string, string> = {
  neutral:     "neutral expression, calm face",
  intense:     "intense focused expression, determined eyes",
  fearful:     "frightened expression, wide eyes",
  joyful:      "joyful smiling expression, bright eyes",
  sorrowful:   "sorrowful tearful expression, downcast eyes",
  angry:       "angry fierce expression, furrowed brow",
  determined:  "determined resolute expression, strong jaw",
  shocked:     "shocked surprised expression, eyes wide open",
  calm:        "serene calm expression, peaceful face",
  confused:    "confused uncertain expression, slight frown",
};

// Camera → composition cue
const CAMERA_VISUALS: Record<string, string> = {
  "wide shot":            "wide establishing shot, full environment visible",
  "medium shot":          "medium shot, character from waist up",
  "close-up":             "close-up shot, character face and shoulders",
  "extreme close-up":     "extreme close-up, just the eyes and face",
  "bird's eye":           "bird's eye view, looking down from above",
  "low angle":            "low angle shot, looking up at character, dramatic",
  "over the shoulder":    "over the shoulder shot, two characters framed",
};

// Lighting → lighting cue
const LIGHTING_VISUALS: Record<string, string> = {
  "bright daylight":      "bright natural daylight, soft shadows",
  "golden hour":          "warm golden hour sunset light, long shadows",
  "neon night":           "neon-lit night scene, colorful artificial lights, dark background",
  "dark shadows":         "dramatic dark shadows, high contrast noir lighting",
  "overcast":             "flat overcast grey sky, diffused soft light",
  "candelight":           "warm flickering candlelight, intimate darkness",
  "blue twilight":        "cool blue twilight, dusk atmosphere, transitional light",
  "harsh fluorescent":    "harsh fluorescent overhead lighting, clinical environment",
};

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!checkRateLimit(user.id)) {
    return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
  }

  const body = await request.json();

  const face_descriptor    = trunc(body.face_descriptor ?? "", 300);
  const scene_description  = trunc(body.scene_description ?? "", 500);
  const camera_angle       = trunc(body.camera_angle ?? "medium shot", 50);
  const lighting_mood      = trunc(body.lighting_mood ?? "bright daylight", 50);
  const character_emotion  = trunc(body.character_emotion ?? "neutral", 50);
  const style              = trunc(body.style ?? "anime", 30);

  if (!scene_description) {
    return NextResponse.json({ error: "scene_description is required" }, { status: 400 });
  }

  // ─── Build the locked prompt ───────────────────────────────────────────────
  const emotionCue  = EMOTION_VISUALS[character_emotion]  ?? `${character_emotion} expression`;
  const cameraCue   = CAMERA_VISUALS[camera_angle]         ?? camera_angle;
  const lightingCue = LIGHTING_VISUALS[lighting_mood]      ?? lighting_mood;
  const styleCue    = style.toLowerCase() === "anime"
    ? "anime style, manga art, vibrant cel shading, 2D illustration"
    : `${style} style`;

  // Face descriptor comes first to anchor character identity
  const parts = [
    face_descriptor ? `character: ${face_descriptor}` : null,
    scene_description,
    emotionCue,
    cameraCue,
    lightingCue,
    styleCue,
    "high quality, detailed, cinematic composition",
  ].filter(Boolean);

  const fullPrompt = parts.join(", ");

  try {
    const imageBlob = await hf.textToImage({
      model: MODEL,
      inputs: fullPrompt,
      parameters: { width: 896, height: 512, num_inference_steps: 4 },
    }) as unknown as Blob;

    const buffer  = Buffer.from(await imageBlob.arrayBuffer());
    const dataUri = `data:${imageBlob.type || "image/jpeg"};base64,${buffer.toString("base64")}`;

    // Optionally save to DB if pack_id + scene_number are provided
    const pack_id      = body.pack_id as string | undefined;
    const scene_number = typeof body.scene_number === "number" ? body.scene_number : null;

    if (pack_id && scene_number !== null) {
      await supabase
        .from("scenes")
        .update({ image_url: dataUri, status: "complete" })
        .eq("pack_id", pack_id)
        .eq("scene_number", scene_number);
    }

    return NextResponse.json({ url: dataUri });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Scene generation failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
