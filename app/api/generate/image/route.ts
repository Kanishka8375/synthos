import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const POLLINATIONS_KEY = process.env.POLLINATIONS_API_KEY;

function buildImageUrl(prompt: string, width: number, height: number, seed: number): string {
  const encoded = encodeURIComponent(`anime style, high quality, detailed: ${prompt}`);
  return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux`;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { prompt, project_id, width = 768, height = 512 } = body;
  if (!prompt) return NextResponse.json({ error: "prompt is required" }, { status: 400 });

  const seed = Math.floor(Math.random() * 999999);
  const url = buildImageUrl(prompt, width, height, seed);

  const headers: Record<string, string> = {};
  if (POLLINATIONS_KEY) headers["Authorization"] = `Bearer ${POLLINATIONS_KEY}`;

  try {
    const check = await fetch(url, { method: "HEAD", headers });
    if (!check.ok) throw new Error("Image generation failed");
  } catch {
    return NextResponse.json({ error: "Image generation service unavailable" }, { status: 502 });
  }

  const { data, error } = await supabase
    .from("generated_images")
    .insert({ user_id: user.id, project_id: project_id ?? null, prompt, url })
    .select()
    .single();

  if (error) return NextResponse.json({ url, saved: false });
  return NextResponse.json({ url, id: data.id, saved: true });
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const project_id = searchParams.get("project_id");

  const query = supabase
    .from("generated_images")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (project_id) query.eq("project_id", project_id);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ images: data });
}
