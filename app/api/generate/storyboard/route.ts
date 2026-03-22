import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { LIMITS, trunc, checkRateLimit } from "@/lib/api-guard";

const POLLINATIONS_KEY = process.env.POLLINATIONS_API_KEY;

/**
 * Generates a storyboard: N scene images via Pollinations.ai in parallel.
 * POST body: { scenes: string[], style?: string, project_id?: string }
 * Returns: { frames: Array<{ scene: string; url: string }> }
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { scenes, style = "anime", project_id } = body as {
    scenes: string[];
    style?: string;
    project_id?: string;
  };

  // Level 4: rate limit
  if (!checkRateLimit(user.id)) {
    return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
  }

  // Level 1: validate scenes
  if (!scenes?.length) return NextResponse.json({ error: "scenes array is required" }, { status: 400 });
  if (scenes.length > 8) return NextResponse.json({ error: "Max 8 scenes per storyboard" }, { status: 400 });
  // Truncate each scene description
  const safescenes: string[] = scenes.map((s: unknown) => trunc(String(s ?? ""), LIMITS.SCENE)).filter(Boolean);

  // Generate all scene image URLs in parallel (Pollinations generates lazily on load)
  const frames = await Promise.all(
    safescenes.map(async (scene, i) => {
      const seed = Math.floor(Math.random() * 999999);
      const prompt = encodeURIComponent(
        `${style} style, storyboard panel ${i + 1}, high quality, cinematic: ${scene}`
      );
      const url = `https://gen.pollinations.ai/image/${prompt}?width=512&height=288&seed=${seed}&nologo=true&model=flux`;

      // Save to DB (fire-and-forget)
      supabase.from("generated_images").insert({
        user_id:    user.id,
        project_id: project_id ?? null,
        prompt:     scene,
        url,
      }).then(() => {});

      return { scene, url };
    })
  );

  return NextResponse.json({ frames });
}
