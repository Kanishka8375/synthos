import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { HfInference } from "@huggingface/inference";
import { validateAudioFile, checkRateLimit } from "@/lib/api-guard";

const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

export const maxDuration = 60;

const STT_MODELS: Record<string, string> = {
  "whisper-large-v3": "openai/whisper-large-v3",
  "whisper-large-v2": "openai/whisper-large-v2",
  "whisper-medium":   "openai/whisper-medium",
  "whisper-small":    "openai/whisper-small",
  "distil-whisper":   "distil-whisper/distil-large-v3",
};

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData  = await request.formData();
  const audioFile = formData.get("audio") as File | null;
  const model     = (formData.get("model") as string) || "whisper-large-v3";
  const language  = (formData.get("language") as string) || undefined;

  // Level 4: rate limit
  if (!checkRateLimit(user.id)) {
    return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
  }

  if (!audioFile) return NextResponse.json({ error: "audio file is required" }, { status: 400 });

  // Level 3: file upload validation
  const audErr = validateAudioFile(audioFile);
  if (audErr) return NextResponse.json({ error: audErr }, { status: 400 });

  const modelId   = STT_MODELS[model] ?? STT_MODELS["whisper-large-v3"];
  const audioBlob = new Blob([await audioFile.arrayBuffer()], { type: audioFile.type || "audio/wav" });

  try {
    const result = await hf.automaticSpeechRecognition({
      model: modelId,
      data: audioBlob,
      ...(language ? { parameters: { language } } : {}),
    });

    return NextResponse.json({
      text:     result.text,
      chunks:   (result as { chunks?: unknown[] }).chunks ?? [],
      model:    modelId,
      language: language ?? "auto-detected",
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Transcription failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
