/**
 * One-time DB setup endpoint.
 * Set SUPABASE_DB_URL in .env.local, then POST /api/setup with x-setup-key header.
 *
 * Example:
 *   curl -X POST http://localhost:3000/api/setup \
 *     -H "x-setup-key: YOUR_SERVICE_ROLE_KEY"
 */
import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function POST(request: NextRequest) {
  const setupKey = request.headers.get("x-setup-key");
  const validKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!validKey || setupKey !== validKey) {
    return NextResponse.json({ error: "Unauthorized — provide x-setup-key: SERVICE_ROLE_KEY header" }, { status: 401 });
  }

  const dbUrl = process.env.SUPABASE_DB_URL;
  if (!dbUrl) {
    return NextResponse.json({
      error: "SUPABASE_DB_URL not set in .env.local",
      hint: "Add: SUPABASE_DB_URL=postgresql://postgres:PASSWORD@db.ryrbmfsvuvpdfdlwaelq.supabase.co:5432/postgres",
    }, { status: 500 });
  }

  try {
    // Dynamic import to avoid issues at build time
    const { default: pg } = await import("pg");
    const client = new pg.Client({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();

    const schemaPath = join(process.cwd(), "supabase", "schema.sql");
    const schema = readFileSync(schemaPath, "utf8");

    await client.query(schema);
    await client.end();

    return NextResponse.json({ success: true, message: "✅ All tables created successfully" });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    info: "POST to /api/setup with x-setup-key: YOUR_SERVICE_ROLE_KEY to create database tables",
    required_env: [
      "SUPABASE_DB_URL=postgresql://postgres:PASSWORD@db.ryrbmfsvuvpdfdlwaelq.supabase.co:5432/postgres",
      "SUPABASE_SERVICE_ROLE_KEY=sb_secret_...",
    ],
  });
}
