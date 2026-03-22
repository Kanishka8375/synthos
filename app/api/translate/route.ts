import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = "meta-llama/llama-3.3-70b-instruct";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!OPENROUTER_KEY) return NextResponse.json({ error: "AI service not configured" }, { status: 500 });

  const { text, targetLanguage, targetCode } = await request.json() as {
    text: string;
    targetLanguage: string;
    targetCode: string;
  };

  if (!text || !targetLanguage) return NextResponse.json({ error: "text and targetLanguage required" }, { status: 400 });

  const systemPrompt = `You are a professional translator specializing in anime scripts and media localization.
Translate the provided text into ${targetLanguage} (${targetCode}).
Preserve the tone, character voice, and cultural nuances. Maintain any screenplay formatting.
Return ONLY the translated text — no explanations, no notes.`;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://synthos.app",
        "X-Title": "SYNTHOS",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user",   content: text },
        ],
        max_tokens: 2048,
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => "");
      return NextResponse.json({ error: `AI service error: ${err}` }, { status: 502 });
    }

    const data = await res.json();
    const translated = data?.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ translated, language: targetLanguage });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Translation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
