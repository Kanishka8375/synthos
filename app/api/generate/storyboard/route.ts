import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { LIMITS, trunc, checkRateLimit } from "@/lib/api-guard";

const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;
const MODEL    = "black-forest-labs/FLUX.1-schnell";

export const maxDuration = 90;

/**
 * Generates a storyboard: N scene images via HuggingFace in parallel.
 * POST body: { scenes: string[], style?: string, project_id?: string }
 * Returns: { frames: Array<{ scene: string; url: string }> }
 * Each url is a base64 data URI (data:image/jpeg;base64,...)
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
  const safeScenes = scenes
    .map((s: unknown) => trunc(String(s ?? ""), LIMITS.SCENE))
    .filter(Boolean);

  // Generate all scene images in parallel via HuggingFace
  const frames = await Promise.all(
    safeScenes.map(async (scene, i) => {
      const fullPrompt = `${style} style, storyboard panel ${i + 1}, high quality, cinematic composition: ${scene}`;

      try {
        const res = await fetch(`https://router.huggingface.co/models/${MODEL}`, {
          method: "POST",
          headers: {
            Authorization:  `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: fullPrompt,
            parameters: { width: 512, height: 288, num_inference_steps: 4 },
          }),
          signal: AbortSignal.timeout(80_000),
        });

        if (!res.ok) {
          // Return a placeholder on per-scene failure so the rest still render
          return { scene, url: "", error: `Scene ${i + 1} failed (${res.status})` };
        }

        const buffer  = Buffer.from(await res.arrayBuffer());
        const mime    = res.headers.get("content-type") || "image/jpeg";
        const dataUri = `data:${mime};base64,${buffer.toString("base64")}`;

        // Fire-and-forget DB record
        supabase.from("generated_images").insert({
          user_id:    user.id,
          project_id: project_id ?? null,
          prompt:     scene,
          url:        `hf:${MODEL}`,
        }).then(() => {});

        return { scene, url: dataUri };
      } catch {
        return { scene, url: "", error: `Scene ${i + 1} timed out` };
      }
    })
  );

  return NextResponse.json({ frames });
}
