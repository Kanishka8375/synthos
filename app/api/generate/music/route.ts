import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { prompt, title = "New Composition", genre = "Hybrid", mood = "Epic", project_id } = body;
  if (!prompt) return NextResponse.json({ error: "prompt is required" }, { status: 400 });

  if (!OPENROUTER_KEY) return NextResponse.json({ error: "OPENROUTER_API_KEY not configured" }, { status: 500 });

  const musicPrompt = `${mood} ${genre} anime soundtrack: ${prompt}`;

  try {
    // Use OpenRouter to generate a detailed music composition description + MIDI-style notation
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct",
        messages: [{
          role: "user",
          content: `You are a music composer. Create a detailed composition description for: "${musicPrompt}"

Return JSON with these exact fields:
{
  "title": "track title",
  "bpm": 120,
  "key": "A minor",
  "time_signature": "4/4",
  "duration": "2:30",
  "instruments": ["strings", "piano", "drums"],
  "structure": "Intro (0:00) → Build (0:30) → Drop (1:00) → Outro (2:00)",
  "mood_arc": "starts tense, builds to epic climax, resolves peacefully",
  "description": "2-3 sentence description of the track"
}

Return ONLY the JSON, no other text.`,
        }],
        max_tokens: 400,
      }),
    });

    if (!res.ok) throw new Error(`OpenRouter error: ${res.status}`);

    const json = await res.json();
    const raw = json.choices?.[0]?.message?.content ?? "{}";

    let composition: Record<string, unknown> = {};
    try {
      const match = raw.match(/\{[\s\S]*\}/);
      composition = JSON.parse(match?.[0] ?? "{}");
    } catch { /* use empty */ }

    const bpm = (composition.bpm as number) || (80 + Math.floor(Math.random() * 80));
    const duration = (composition.duration as string) || "2:30";
    const trackTitle = (composition.title as string) || title;

    const { data, error } = await supabase
      .from("generated_tracks")
      .insert({
        user_id: user.id,
        project_id: project_id ?? null,
        title: trackTitle,
        prompt: musicPrompt,
        genre,
        mood,
        duration,
        bpm,
        audio_url: null,
        status: "Composed",
        composition_data: JSON.stringify(composition),
      })
      .select()
      .single();

    const responseData = {
      id: data?.id,
      title: trackTitle,
      bpm,
      duration,
      status: "Composed",
      composition: composition,
      saved: !error,
      note: "Music composition generated. Full audio generation requires a paid music API (e.g. Suno, Udio, or Replicate MusicGen endpoint).",
    };

    return NextResponse.json(responseData);
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
