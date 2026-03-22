import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const POLLINATIONS_KEY = process.env.POLLINATIONS_API_KEY;

const STYLE_PROMPTS: Record<string, string> = {
  "anime":         "anime style, manga art, vibrant cel shading, 2D illustration",
  "cinematic":     "cinematic photography, dramatic lighting, film grain, anamorphic lens, movie still, 8K HDR",
  "photorealistic":"photorealistic, hyperrealistic, DSLR photography, 85mm lens, natural light, sharp focus, 8K, no anime, no cartoon",
  "manga":         "manga style, black and white ink illustration, screentone shading, comic panel art",
  "oil painting":  "oil painting, impressionist, thick brushstrokes, canvas texture, classical fine art",
  "3d render":     "3D CGI render, octane render, ray tracing, studio lighting, physically based rendering",
  "pixel art":     "pixel art, 16-bit retro game sprites, pixelated, retro gaming aesthetic",
  "watercolor":    "watercolor painting, soft color washes, paper texture, loose artistic brushwork",
};

function buildImageUrl(prompt: string, style: string | undefined, width: number, height: number, seed: number): string {
  let fullPrompt: string;
  if (style) {
    const styleKey = style.toLowerCase();
    const styleKeywords = STYLE_PROMPTS[styleKey] ?? `${style} style`;
    fullPrompt = `${styleKeywords}, high quality, detailed: ${prompt}`;
  } else {
    fullPrompt = `high quality, detailed: ${prompt}`;
  }
  const encoded = encodeURIComponent(fullPrompt);
  return `https://gen.pollinations.ai/image/${encoded}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux`;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { prompt, style, project_id, width = 768, height = 512 } = body;
  if (!prompt) return NextResponse.json({ error: "prompt is required" }, { status: 400 });

  const seed = Math.floor(Math.random() * 999999);
  const url = buildImageUrl(prompt, style, width, height, seed);

  // Verify image generates before saving (gen.pollinations.ai returns real image bytes)
  try {
    const headers: Record<string, string> = {};
    if (POLLINATIONS_KEY) headers["Authorization"] = `Bearer ${POLLINATIONS_KEY}`;
    const check = await fetch(url, { headers });
    if (!check.ok) {
      return NextResponse.json({ error: "Image generation failed — Pollinations returned " + check.status }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ error: "Image generation service unreachable" }, { status: 502 });
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
