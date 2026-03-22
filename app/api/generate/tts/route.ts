import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

export const maxDuration = 30;

const TTS_MODELS: Record<string, string> = {
  "mms-tts":   "facebook/mms-tts-eng",
  "speecht5":  "microsoft/speecht5_tts",
  "mms-fr":    "facebook/mms-tts-fra",
  "mms-es":    "facebook/mms-tts-spa",
  "mms-de":    "facebook/mms-tts-deu",
  "mms-ja":    "facebook/mms-tts-jpn",
  "mms-ko":    "facebook/mms-tts-kor",
  "mms-zh":    "facebook/mms-tts-cmn",
  "mms-hi":    "facebook/mms-tts-hin",
  "mms-ar":    "facebook/mms-tts-arb",
};

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { text, model = "mms-tts" } = body;
  if (!text || typeof text !== "string") return NextResponse.json({ error: "text is required" }, { status: 400 });
  if (text.length > 2000) return NextResponse.json({ error: "text must be under 2000 characters" }, { status: 400 });

  const modelId = TTS_MODELS[model] ?? TTS_MODELS["mms-tts"];

  try {
    const audioBlob = await hf.textToSpeech({
      model: modelId,
      inputs: text,
    });

    return new Response(audioBlob, {
      headers: {
        "Content-Type":  audioBlob.type || "audio/wav",
        "Cache-Control": "no-store",
        "X-Model":       modelId,
        "X-Text-Length": String(text.length),
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "TTS failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
