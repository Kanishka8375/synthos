-- Phase 2: Consistency Engine schema
-- Run this in the Supabase SQL Editor

-- ─── Add face columns to characters table ─────────────────────────────────────
ALTER TABLE characters
  ADD COLUMN IF NOT EXISTS face_image_url  text,
  ADD COLUMN IF NOT EXISTS face_descriptor text;

-- ─── Scene packs (one per generation run) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS scene_packs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES auth.users NOT NULL,
  character_id  uuid,
  character_name text,
  script        text NOT NULL,
  style         text NOT NULL DEFAULT 'anime',
  status        text NOT NULL DEFAULT 'pending',
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE scene_packs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own scene packs"
  ON scene_packs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── Scenes (individual frames in a pack) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS scenes (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id           uuid REFERENCES scene_packs(id) ON DELETE CASCADE NOT NULL,
  scene_number      int NOT NULL,
  description       text NOT NULL,
  camera_angle      text,
  lighting_mood     text,
  character_emotion text,
  image_url         text,
  status            text NOT NULL DEFAULT 'pending',
  created_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage scenes in their packs"
  ON scenes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM scene_packs sp
      WHERE sp.id = scenes.pack_id AND sp.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM scene_packs sp
      WHERE sp.id = scenes.pack_id AND sp.user_id = auth.uid()
    )
  );

-- ─── Storage bucket for character face images ─────────────────────────────────
-- Run this separately in the Supabase Storage section OR via the Storage API:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('character-faces', 'character-faces', false);

-- Storage policy (run after creating the bucket):
-- CREATE POLICY "Users can upload their own face images"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'character-faces' AND auth.uid()::text = (storage.foldername(name))[1]);
--
-- CREATE POLICY "Users can read their own face images"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'character-faces' AND auth.uid()::text = (storage.foldername(name))[1]);
