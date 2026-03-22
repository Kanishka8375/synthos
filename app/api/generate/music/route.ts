import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;

export const maxDuration = 90;

const MUSIC_MODELS: Record<string, { id: string; tokens: number }> = {
  "musicgen-small":  { id: "facebook/musicgen-small",        tokens: 512  },
  "musicgen-medium": { id: "facebook/musicgen-medium",       tokens: 768  },
  "musicgen-large":  { id: "facebook/musicgen-large",        tokens: 1024 },
  "musicgen-stereo": { id: "facebook/musicgen-stereo-small", tokens: 512  },
};

const MOOD_KEYWORDS: Record<string, string> = {
  epic:        "epic, powerful, dramatic, orchestral climax",
  calm:        "calm, peaceful, gentle, relaxing, soft",
  tense:       "tense, suspenseful, dark, ominous, building dread",
  upbeat:      "upbeat, energetic, happy, lively, driving beat",
  melancholic: "melancholic, sad, emotional, nostalgic, slow",
  futuristic:  "futuristic, electronic, synth-heavy, sci-fi, cyberpunk",
  dark:        "dark, brooding, mysterious, heavy bass, low frequencies",
  romantic:    "romantic, warm, tender, flowing, lush strings",
};

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const {
    prompt,
    mood = "epic",
    genre = "Orchestral",
    model = "musicgen-small",
    project_id,
  } = body;
  if (!prompt) return NextResponse.json({ error: "prompt is required" }, { status: 400 });

  const moodStr  = MOOD_KEYWORDS[(mood as string).toLowerCase()] ?? mood;
  const fullPrompt = `${genre} music, ${moodStr}, high quality audio, ${prompt}`;

  const { id: modelId, tokens } = MUSIC_MODELS[model] ?? MUSIC_MODELS["musicgen-small"];

  try {
    const hfRes = await fetch(
      `https://router.huggingface.co/models/${modelId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: fullPrompt, parameters: { max_new_tokens: tokens } }),
        signal: AbortSignal.timeout(85_000),
      }
    );
    if (!hfRes.ok) {
      const err = await hfRes.text().catch(() => "");
      return NextResponse.json({ error: `Music generation failed: ${err}` }, { status: 502 });
    }
    const audioBlob = await hfRes.blob();

    // Fire-and-forget DB save
    supabase.from("generated_tracks").insert({
      user_id:    user.id,
      project_id: project_id ?? null,
      title:      `${genre} – ${prompt.slice(0, 60)}`,
      prompt:     fullPrompt,
      genre,
      mood,
      duration:   "~10s",
      bpm:        0,
      audio_url:  null,
      status:     "Generated",
    }).then(() => {});

    return new Response(audioBlob, {
      headers: {
        "Content-Type":  audioBlob.type || "audio/wav",
        "Cache-Control": "no-store",
        "X-Model":       modelId,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Music generation failed";
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
    .from("generated_tracks")
    .select("id, title, genre, mood, duration, bpm, status, created_at, audio_url")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (project_id) query.eq("project_id", project_id);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tracks: data });
}
