import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

  if (!scenes?.length) return NextResponse.json({ error: "scenes array is required" }, { status: 400 });
  if (scenes.length > 8)  return NextResponse.json({ error: "Max 8 scenes per storyboard" }, { status: 400 });

  const fetchHeaders: Record<string, string> = {};
  if (POLLINATIONS_KEY) fetchHeaders["Authorization"] = `Bearer ${POLLINATIONS_KEY}`;

  // Generate all scene images in parallel
  const frames = await Promise.all(
    scenes.map(async (scene, i) => {
      const seed = Math.floor(Math.random() * 999999);
      const prompt = encodeURIComponent(
        `${style} style, storyboard panel ${i + 1}, high quality, cinematic: ${scene}`
      );
      const url = `https://image.pollinations.ai/prompt/${prompt}?width=512&height=288&seed=${seed}&nologo=true&model=flux`;

      try {
        const check = await fetch(url, { method: "HEAD", headers: fetchHeaders });
        if (!check.ok) throw new Error("Pollinations unavailable");
      } catch {
        return { scene, url: null, error: "Image generation failed" };
      }

      // Save to DB
      await supabase.from("generated_images").insert({
        user_id:    user.id,
        project_id: project_id ?? null,
        prompt:     scene,
        url,
      });

      return { scene, url };
    })
  );

  return NextResponse.json({ frames });
}
