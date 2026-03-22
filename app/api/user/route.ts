import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, studio_name, plan")
    .eq("id", user.id)
    .single();

  const { count: projectCount } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: imageCount } = await supabase
    .from("generated_images")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: scriptCount } = await supabase
    .from("generated_scripts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: trackCount } = await supabase
    .from("generated_tracks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  return NextResponse.json({
    user: {
      id:    user.id,
      email: user.email,
      ...profile,
    },
    stats: {
      projects: projectCount ?? 0,
      images:   imageCount ?? 0,
      scripts:  scriptCount ?? 0,
      tracks:   trackCount ?? 0,
    },
  });
}
