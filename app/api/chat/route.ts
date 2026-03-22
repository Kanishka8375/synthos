import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = "meta-llama/llama-3.3-70b-instruct";

const SYSTEM_PROMPT = `You are OpenClaw — the AI brain powering the SYNTHOS anime production studio platform.
You help creators with: scriptwriting, episode plotting, character development, world-building, dialogue polish, pacing, emotional arcs, production decisions, and getting the most out of SYNTHOS features.
Be creative, insightful, and direct. Use concise language. When generating scripts or dialogue, use proper screenplay format.
SYNTHOS features include: Episode Pipeline (script writing), Storyboard (scene visualization), Character DNA Vault (character management), Emotion Choreography (emotional arc editor), Soundtrack Forge (AI music), Workflow Canvas (production pipeline), Trend Radar (viral content insights), World Atlas, and the Create page (image/video/music generation).`;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!OPENROUTER_KEY) return NextResponse.json({ error: "OpenRouter not configured" }, { status: 500 });

  const { messages } = await request.json() as { messages: { role: string; content: string }[] };

  const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://synthos.app",
      "X-Title": "SYNTHOS",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      stream: true,
      max_tokens: 1024,
      temperature: 0.8,
    }),
  });

  if (!upstream.ok) {
    const err = await upstream.text().catch(() => "");
    return NextResponse.json({ error: `OpenRouter error: ${err}` }, { status: 502 });
  }

  // Pass the SSE stream straight through to the client
  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
