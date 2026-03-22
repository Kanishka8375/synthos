/**
 * Run this script to create all Supabase tables.
 * Usage: DB_PASSWORD=yourpassword node scripts/migrate.mjs
 *
 * Your DB password is in Supabase → Settings → Database → Database password
 */

import pg from "pg";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const password  = process.env.DB_PASSWORD;

if (!password) {
  console.error("❌  Missing DB_PASSWORD env var.");
  console.error("   Usage: DB_PASSWORD=yourpassword node scripts/migrate.mjs");
  console.error("   Find your password: Supabase dashboard → Settings → Database");
  process.exit(1);
}

const client = new pg.Client({
  connectionString: `postgresql://postgres:${password}@db.ryrbmfsvuvpdfdlwaelq.supabase.co:5432/postgres`,
  ssl: { rejectUnauthorized: false },
});

const schema = readFileSync(join(__dirname, "../supabase/schema.sql"), "utf8");

try {
  console.log("🔌 Connecting to Supabase…");
  await client.connect();
  console.log("✅ Connected");

  console.log("🚀 Running schema migrations…");
  await client.query(schema);
  console.log("✅ Schema applied — all tables created");
} catch (err) {
  console.error("❌ Migration failed:", err.message);
  process.exit(1);
} finally {
  await client.end();
}
