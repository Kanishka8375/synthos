import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { prompt, project_id } = body as { prompt: string; project_id?: string };

  if (!prompt) return NextResponse.json({ error: "prompt is required" }, { status: 400 });

  if (!HF_TOKEN) {
    return NextResponse.json({ error: "Video generation not configured (missing HUGGINGFACE_TOKEN)" }, { status: 503 });
  }

  const enhancedPrompt = `anime style, high quality, fluid animation: ${prompt}`;

  try {
    const hfRes = await fetch(
      "https://api-inference.huggingface.co/models/damo-vilab/text-to-video-ms-1.7b",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: enhancedPrompt }),
      }
    );

    if (!hfRes.ok) {
      const text = await hfRes.text().catch(() => "");
      // Model may be loading — surface a friendly message
      if (hfRes.status === 503) {
        return NextResponse.json(
          { error: "Video model is warming up, please try again in ~30 seconds." },
          { status: 503 }
        );
      }
      return NextResponse.json(
        { error: `Video generation failed (${hfRes.status}): ${text}` },
        { status: 502 }
      );
    }

    const videoBuffer = await hfRes.arrayBuffer();

    // Save a record in Supabase (fire-and-forget)
    supabase.from("generated_images").insert({
      user_id: user.id,
      project_id: project_id ?? null,
      prompt,
      url: `hf-video://${user.id}/${Date.now()}`,
    }).then(() => {});

    return new Response(videoBuffer, {
      headers: {
        "Content-Type": "video/mp4",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Video generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
