import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { prompt, project_id, genre = "Action", style = "Anime" } = body;
  if (!prompt) return NextResponse.json({ error: "prompt is required" }, { status: 400 });

  const systemPrompt = `You are a professional anime scriptwriter. Write compelling, vivid episode scripts in proper screenplay format.
Style: ${style}, Genre: ${genre}.
Format your script with scene headings (INT./EXT.), action lines, and character dialogue.
Keep it focused and cinematic. Write 3-4 scenes maximum.`;

  const userMessage = `Write an anime episode script for: ${prompt}`;

  try {
    let content = "";

    const stream = hf.chatCompletionStream({
      model: "mistralai/Mistral-7B-Instruct-v0.3",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: 1200,
      temperature: 0.8,
    });

    for await (const chunk of stream) {
      content += chunk.choices[0]?.delta?.content ?? "";
    }

    // Save to Supabase
    const { data, error } = await supabase
      .from("generated_scripts")
      .insert({ user_id: user.id, project_id: project_id ?? null, prompt, content })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ content, saved: false });
    }

    return NextResponse.json({ content, id: data.id, saved: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Script generation failed";
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
    .from("generated_scripts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  if (project_id) query.eq("project_id", project_id);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ scripts: data });
}
