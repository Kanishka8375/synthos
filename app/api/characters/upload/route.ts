import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { HfInference } from "@huggingface/inference";
import { validateImageFile, checkRateLimit } from "@/lib/api-guard";

const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!checkRateLimit(user.id)) {
    return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
  }

  const formData = await request.formData();
  const file = formData.get("face_image") as File | null;
  const name = (formData.get("name") as string | null)?.trim().slice(0, 100) ?? "Character";

  if (!file) return NextResponse.json({ error: "face_image is required" }, { status: 400 });

  const validationError = validateImageFile(file);
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

  // ─── Upload image to Supabase Storage ─────────────────────────────────────
  const ext = file.type === "image/png" ? "png" : "jpg";
  const storagePath = `${user.id}/${crypto.randomUUID()}.${ext}`;
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("character-faces")
    .upload(storagePath, fileBuffer, { contentType: file.type, upsert: false });

  let face_image_url: string | null = null;
  if (!uploadError) {
    const { data: publicUrl } = supabase.storage
      .from("character-faces")
      .getPublicUrl(storagePath);
    face_image_url = publicUrl.publicUrl;
  }

  // ─── Extract face descriptor via BLIP captioning ──────────────────────────
  let face_descriptor = `${name}, detailed face, sharp features`;
  try {
    const imageBlob = new Blob([fileBuffer], { type: file.type });
    const caption = await hf.imageToText({
      model: "Salesforce/blip-image-captioning-large",
      data: imageBlob,
    });
    if (caption.generated_text) {
      face_descriptor = caption.generated_text;
    }
  } catch {
    // BLIP failed — fall back to name-based descriptor
  }

  // ─── Save character to DB ──────────────────────────────────────────────────
  const { data: character, error: dbError } = await supabase
    .from("characters")
    .insert({
      user_id:         user.id,
      name,
      role:            "Protagonist",
      emotion_profile: "Neutral",
      voice_type:      "Clear Tenor",
      description:     face_descriptor,
      appearance:      face_descriptor,
      personality:     `${name} — locked character for consistent scene generation.`,
      memory_locked:   true,
      avatar_color:    "from-indigo-500 to-violet-500",
      face_image_url,
      face_descriptor,
    })
    .select()
    .single();

  if (dbError) {
    // Return descriptor even if DB save fails — client can still generate
    return NextResponse.json({
      id:              null,
      name,
      face_image_url,
      face_descriptor,
      saved:           false,
    });
  }

  return NextResponse.json({
    id:              character.id,
    name:            character.name,
    face_image_url:  character.face_image_url,
    face_descriptor: character.face_descriptor,
    saved:           true,
  });
}

// GET: list characters with face lock for the picker
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: characters } = await supabase
    .from("characters")
    .select("id, name, face_image_url, face_descriptor, avatar_color")
    .eq("user_id", user.id)
    .not("face_descriptor", "is", null)
    .order("created_at", { ascending: false })
    .limit(20);

  return NextResponse.json({ characters: characters ?? [] });
}
