import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { prompt, project_id } = body;
  if (!prompt) return NextResponse.json({ error: "prompt is required" }, { status: 400 });

  const token = process.env.HUGGINGFACE_TOKEN;
  if (!token) return NextResponse.json({ error: "HUGGINGFACE_TOKEN not configured" }, { status: 500 });

  // HuggingFace text-to-video — damo-vilab/text-to-video-ms-1.7b
  const videoPrompt = `anime style, high quality, fluid animation: ${prompt}`;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/damo-vilab/text-to-video-ms-1.7b",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: videoPrompt,
          parameters: { num_inference_steps: 25 },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 503) {
        return NextResponse.json({
          status: "loading",
          message: "Video model is warming up (free tier cold start). Try again in 30–60 seconds.",
        }, { status: 202 });
      }
      const errText = await response.text();
      throw new Error(`HuggingFace error: ${errText}`);
    }

    const videoBuffer = await response.arrayBuffer();
    const base64Video = Buffer.from(videoBuffer).toString("base64");
    const videoDataUrl = `data:video/mp4;base64,${base64Video}`;

    // Log to Supabase generated_images table reusing for video
    await supabase.from("generated_images").insert({
      user_id: user.id,
      project_id: project_id ?? null,
      prompt: videoPrompt,
      url: videoDataUrl,
    });

    return NextResponse.json({ video: videoDataUrl, status: "Ready" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Video generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
