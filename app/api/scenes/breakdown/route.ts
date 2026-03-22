import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { trunc, checkRateLimit } from "@/lib/api-guard";

export const maxDuration = 60;

const SYSTEM_PROMPT = `You are a professional storyboard artist and screenplay analyst.

Given a script or story description, break it into 5-15 individual scenes for visual storyboarding.

For each scene output a JSON object with EXACTLY these fields:
- scene_number: integer starting at 1
- description: string (1-2 sentences describing what is visually happening — what we SEE)
- camera_angle: one of "wide shot" | "medium shot" | "close-up" | "extreme close-up" | "bird's eye" | "low angle" | "over the shoulder"
- lighting_mood: one of "bright daylight" | "golden hour" | "neon night" | "dark shadows" | "overcast" | "candelight" | "blue twilight" | "harsh fluorescent"
- character_emotion: one of "neutral" | "intense" | "fearful" | "joyful" | "sorrowful" | "angry" | "determined" | "shocked" | "calm" | "confused"

Return ONLY a valid JSON array of scene objects. No markdown, no explanation, no code blocks.
Example: [{"scene_number":1,"description":"...","camera_angle":"wide shot","lighting_mood":"neon night","character_emotion":"determined"}]

Keep scene descriptions visual and cinematic. Focus on action and composition, not dialogue.`;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!checkRateLimit(user.id)) {
    return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
  }

  const body = await request.json();
  const script         = trunc(body.script, 8000);
  const character_name = trunc(body.character_name ?? "the protagonist", 100);

  if (!script) return NextResponse.json({ error: "script is required" }, { status: 400 });

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "OpenRouter API key not configured" }, { status: 500 });

  const userPrompt = `Character name: ${character_name}

Script/Story:
${script}

Break this into cinematic scenes.`;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type":  "application/json",
        "HTTP-Referer":  "https://synthos.app",
        "X-Title":       "SYNTHOS Consistency Engine",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct",
        messages: [
          { role: "system",  content: SYSTEM_PROMPT },
          { role: "user",    content: userPrompt },
        ],
        temperature: 0.4,
        max_tokens: 4000,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenRouter error: ${err.slice(0, 200)}`);
    }

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content ?? "";

    // Parse JSON — strip any accidental markdown fences
    const cleaned = raw.replace(/```json|```/g, "").trim();
    let scenes: unknown[];
    try {
      scenes = JSON.parse(cleaned);
    } catch {
      throw new Error("LLM returned invalid JSON. Try again.");
    }

    if (!Array.isArray(scenes) || scenes.length === 0) {
      throw new Error("No scenes returned. Try a more detailed script.");
    }

    // Clamp to 15 scenes, validate shape
    const validated = (scenes as Record<string, unknown>[]).slice(0, 15).map((s, i) => ({
      scene_number:      typeof s.scene_number === "number" ? s.scene_number : i + 1,
      description:       String(s.description ?? "").slice(0, 500),
      camera_angle:      String(s.camera_angle ?? "medium shot"),
      lighting_mood:     String(s.lighting_mood ?? "bright daylight"),
      character_emotion: String(s.character_emotion ?? "neutral"),
    }));

    return NextResponse.json({ scenes: validated });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Scene breakdown failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
