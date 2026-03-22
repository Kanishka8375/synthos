import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const POLLINATIONS_KEY = process.env.POLLINATIONS_API_KEY;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const {
    prompt,
    model = "wan",
    duration = 4,
    aspectRatio = "16:9",
    project_id,
  } = body as {
    prompt: string;
    model?: string;
    duration?: number;
    aspectRatio?: string;
    project_id?: string;
  };

  if (!prompt) return NextResponse.json({ error: "prompt is required" }, { status: 400 });

  const encoded = encodeURIComponent(`anime style, high quality, fluid animation: ${prompt}`);
  const videoUrl =
    `https://gen.pollinations.ai/video/${encoded}` +
    `?model=${model}&duration=${duration}&aspectRatio=${encodeURIComponent(aspectRatio)}&nologo=true`;

  const headers: Record<string, string> = {};
  if (POLLINATIONS_KEY) headers["Authorization"] = `Bearer ${POLLINATIONS_KEY}`;

  try {
    const pollinationsRes = await fetch(videoUrl, { headers });

    if (!pollinationsRes.ok) {
      const text = await pollinationsRes.text().catch(() => "");
      return NextResponse.json(
        { error: `Video generation failed (${pollinationsRes.status}): ${text}` },
        { status: 502 }
      );
    }

    const contentType = pollinationsRes.headers.get("content-type") ?? "video/mp4";

    // Log the generation in Supabase (fire-and-forget)
    supabase.from("generated_images").insert({
      user_id: user.id,
      project_id: project_id ?? null,
      prompt,
      url: videoUrl,
    }).then(() => {});

    // Stream the binary MP4 directly back to the client
    return new Response(pollinationsRes.body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Video generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
