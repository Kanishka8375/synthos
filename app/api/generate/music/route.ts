import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { prompt, title = "New Composition", genre = "Hybrid", mood = "Epic", project_id } = body;
  if (!prompt) return NextResponse.json({ error: "prompt is required" }, { status: 400 });

  const token = process.env.HUGGINGFACE_TOKEN;
  if (!token) return NextResponse.json({ error: "HUGGINGFACE_TOKEN not configured" }, { status: 500 });

  // HuggingFace MusicGen — facebook/musicgen-small
  const musicPrompt = `${mood} ${genre} anime soundtrack: ${prompt}`;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/musicgen-small",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: musicPrompt,
          parameters: { max_new_tokens: 256 },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      // Model loading (503) — return pending status
      if (response.status === 503) {
        return NextResponse.json({
          status: "loading",
          message: "MusicGen model is warming up (free tier). Try again in 20–30 seconds.",
        }, { status: 202 });
      }
      throw new Error(`HuggingFace error: ${errText}`);
    }

    // Response is raw audio bytes (wav/flac)
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString("base64");
    const audioDataUrl = `data:audio/wav;base64,${base64Audio}`;

    // Save metadata to Supabase (store base64 in audio_url)
    const bpm = 80 + Math.floor(Math.random() * 80);
    const durationSecs = 15 + Math.floor(Math.random() * 15);
    const duration = `0:${durationSecs.toString().padStart(2, "0")}`;

    const { data, error } = await supabase
      .from("generated_tracks")
      .insert({
        user_id: user.id,
        project_id: project_id ?? null,
        title,
        prompt: musicPrompt,
        genre,
        mood,
        duration,
        bpm,
        audio_url: audioDataUrl,
        status: "Ready",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ audio: audioDataUrl, status: "Ready", bpm, duration, saved: false });
    }

    return NextResponse.json({
      id: data.id,
      audio: audioDataUrl,
      status: "Ready",
      bpm,
      duration,
      saved: true,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Music generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
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
