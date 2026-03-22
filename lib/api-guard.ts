/**
 * api-guard.ts — Shared security utilities for all API routes.
 *
 * Level 1: Input validation (lengths, numeric bounds)
 * Level 2: Auth callback redirect safety
 * Level 3: File upload validation (size + MIME type)
 * Level 4: Per-user rate limiting (in-memory, per serverless instance)
 */

// ─── Level 1: Input validation ────────────────────────────────────────────────

export const LIMITS = {
  PROMPT:     2000,   // AI generation prompts
  TEXT:       4000,   // translation / TTS text
  TITLE:       200,   // short title fields
  NAME:        100,   // character names etc.
  CONTENT:   10000,   // long-form content (bible entries, scripts)
  DESCRIPTION: 2000,  // medium text fields
  SCENE:       500,   // per-scene storyboard descriptions
  MESSAGES:     50,   // max messages in a chat turn
};

/** Clamp a number to [min, max], defaulting to `def` if NaN. */
export function clampInt(v: unknown, min: number, max: number, def: number): number {
  const n = Math.round(Number(v));
  return Math.min(Math.max(isFinite(n) ? n : def, min), max);
}

export function clampFloat(v: unknown, min: number, max: number, def: number): number {
  const n = Number(v);
  return Math.min(Math.max(isFinite(n) ? n : def, min), max);
}

/** Silently truncate a string to maxLen characters. */
export function trunc(s: unknown, maxLen: number): string {
  if (typeof s !== "string") return "";
  return s.slice(0, maxLen);
}

/** Clamp image dimension to [256, 1536]. */
export function clampDim(v: unknown, def: number): number {
  return clampInt(v, 256, 1536, def);
}

// ─── Level 2: Safe redirect ───────────────────────────────────────────────────

/**
 * Validate an OAuth / auth-callback `next` redirect parameter.
 * Allows only same-origin relative paths (must start with / and not contain //).
 */
export function safeRedirectPath(next: string | null): string {
  if (!next) return "/dashboard";
  // Must start with exactly one slash, no protocol-relative URLs, no absolute URLs
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("://")) {
    return "/dashboard";
  }
  return next;
}

// ─── Level 3: File upload validation ─────────────────────────────────────────

const IMAGE_TYPES = new Set([
  "image/jpeg", "image/png", "image/webp", "image/gif",
]);
const AUDIO_TYPES = new Set([
  "audio/wav", "audio/mpeg", "audio/mp4", "audio/ogg",
  "audio/flac", "audio/webm", "audio/x-wav",
]);

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;  // 10 MB
const MAX_AUDIO_BYTES = 25 * 1024 * 1024;  // 25 MB

export function validateImageFile(file: File): string | null {
  if (!IMAGE_TYPES.has(file.type)) {
    return `Unsupported image type "${file.type}". Allowed: JPEG, PNG, WebP, GIF.`;
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return `Image too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max 10 MB.`;
  }
  return null;
}

export function validateAudioFile(file: File): string | null {
  if (!AUDIO_TYPES.has(file.type)) {
    return `Unsupported audio type "${file.type}". Allowed: WAV, MP3, MP4, OGG, FLAC, WebM.`;
  }
  if (file.size > MAX_AUDIO_BYTES) {
    return `Audio too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max 25 MB.`;
  }
  return null;
}

// ─── Level 4: Rate limiting ───────────────────────────────────────────────────

/**
 * Simple sliding-window rate limiter.
 * NOTE: In-memory — resets per serverless cold start. Provides per-instance
 * burst protection; pair with Upstash/Redis for cross-instance enforcement.
 */
const RATE_WINDOW_MS = 60_000;   // 1 minute window
const RATE_LIMIT     = 10;       // requests per window per user

const _hits = new Map<string, number[]>();

export function checkRateLimit(userId: string): boolean {
  const now    = Date.now();
  const cutoff = now - RATE_WINDOW_MS;
  const prev   = (_hits.get(userId) ?? []).filter(t => t > cutoff);
  if (prev.length >= RATE_LIMIT) return false;
  prev.push(now);
  _hits.set(userId, prev);
  return true;
}
