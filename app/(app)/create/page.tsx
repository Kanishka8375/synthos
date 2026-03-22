"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, User, FileText, Sparkles, Download, RefreshCw,
  ChevronRight, ChevronLeft, CheckCircle2, Loader2, X,
  Camera, Zap, Lock, Film, AlertCircle,
} from "lucide-react";
import { strToU8, zipSync } from "fflate";

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface CharacterLock {
  id:              string | null;
  name:            string;
  face_image_url:  string | null;
  face_descriptor: string;
  preview_url:     string | null; // local blob URL for preview
}

interface Scene {
  scene_number:      number;
  description:       string;
  camera_angle:      string;
  lighting_mood:     string;
  character_emotion: string;
}

type SceneStatus = "pending" | "generating" | "done" | "error";

interface SceneWithStatus extends Scene {
  status:    SceneStatus;
  image_url: string | null;
  error:     string | null;
}

const STYLES = ["Anime", "Cinematic", "Manga", "Photorealistic", "Dark Fantasy", "Watercolor"];

const EXAMPLE_SCRIPT = `INT. NEON ALLEY - NIGHT

Rain hammers against the pavement as KAITO steps out of the shadows, hand on his katana.

He surveys the neon-lit street — holographic ads flicker overhead, reflecting off puddles.

A figure emerges from the fog ahead. They face each other across the empty alley.

KAITO charges forward. Steel clashes. They fight across rooftops, lightning illuminating every strike.

The enemy falls. Kaito stands alone at the edge, staring at the city below, rain pouring down.`;

/* ─── Step indicator ─────────────────────────────────────────────────────── */
function StepBar({ step }: { step: number }) {
  const steps = [
    { n: 1, label: "Character" },
    { n: 2, label: "Script" },
    { n: 3, label: "Scenes" },
    { n: 4, label: "Generate" },
  ];
  return (
    <div className="flex items-center gap-0 mb-10">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
              step > s.n
                ? "bg-emerald-500 border-emerald-500 text-white"
                : step === s.n
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                  : "bg-transparent border-white/15 text-gray-600"
            }`}>
              {step > s.n ? <CheckCircle2 className="w-4 h-4" /> : s.n}
            </div>
            <span className={`text-[10px] font-medium ${step === s.n ? "text-indigo-300" : step > s.n ? "text-emerald-400" : "text-gray-600"}`}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-16 h-px mx-2 mb-5 transition-colors ${step > s.n ? "bg-emerald-500/50" : "bg-white/8"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function CreatePage() {
  const [step, setStep] = useState(1);

  // Step 1 state
  const [character,       setCharacter]       = useState<CharacterLock | null>(null);
  const [uploading,       setUploading]       = useState(false);
  const [uploadError,     setUploadError]     = useState<string | null>(null);
  const [charName,        setCharName]        = useState("");
  const [dragOver,        setDragOver]        = useState(false);
  const [savedChars,      setSavedChars]      = useState<CharacterLock[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2 state
  const [script,          setScript]          = useState("");
  const [style,           setStyle]           = useState("Anime");

  // Step 3 state
  const [scenes,          setScenes]          = useState<SceneWithStatus[]>([]);
  const [breaking,        setBreaking]        = useState(false);
  const [breakError,      setBreakError]      = useState<string | null>(null);

  // Step 4 state
  const [generating,      setGenerating]      = useState(false);
  const [genProgress,     setGenProgress]     = useState(0);

  /* Load saved characters with face lock */
  useEffect(() => {
    fetch("/api/characters/upload")
      .then(r => r.json())
      .then(d => {
        const chars: CharacterLock[] = (d.characters ?? []).map((c: {
          id: string; name: string; face_image_url?: string; face_descriptor?: string; avatar_color?: string;
        }) => ({
          id:              c.id,
          name:            c.name,
          face_image_url:  c.face_image_url ?? null,
          face_descriptor: c.face_descriptor ?? c.name,
          preview_url:     c.face_image_url ?? null,
        }));
        setSavedChars(chars);
      })
      .catch(() => {});
  }, []);

  /* ── Step 1: Face upload ─────────────────────────────────────────────── */
  const handleFileSelect = useCallback(async (file: File) => {
    setUploadError(null);
    setUploading(true);

    // Show local preview immediately
    const previewUrl = URL.createObjectURL(file);

    const fd = new FormData();
    fd.append("face_image", file);
    fd.append("name", charName || "Character");

    try {
      const res  = await fetch("/api/characters/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");

      const locked: CharacterLock = {
        id:              data.id,
        name:            data.name,
        face_image_url:  data.face_image_url,
        face_descriptor: data.face_descriptor,
        preview_url:     previewUrl,
      };
      setCharacter(locked);
      setSavedChars(prev => [locked, ...prev.filter(c => c.id !== data.id)]);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
      URL.revokeObjectURL(previewUrl);
    } finally {
      setUploading(false);
    }
  }, [charName]);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  /* ── Step 3: Scene breakdown ─────────────────────────────────────────── */
  const breakScript = async () => {
    if (!script.trim()) return;
    setBreaking(true);
    setBreakError(null);
    setScenes([]);

    try {
      const res  = await fetch("/api/scenes/breakdown", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          script,
          character_name: character?.name ?? "the protagonist",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Scene breakdown failed");

      const withStatus: SceneWithStatus[] = data.scenes.map((s: Scene) => ({
        ...s,
        status:    "pending" as SceneStatus,
        image_url: null,
        error:     null,
      }));
      setScenes(withStatus);
      setStep(3);
    } catch (err) {
      setBreakError(err instanceof Error ? err.message : "Scene breakdown failed");
    } finally {
      setBreaking(false);
    }
  };

  /* ── Step 4: Scene generation ────────────────────────────────────────── */
  const generateScene = useCallback(async (sceneIdx: number) => {
    const scene = scenes[sceneIdx];
    if (!scene || !character) return;

    setScenes(prev => prev.map((s, i) =>
      i === sceneIdx ? { ...s, status: "generating", error: null } : s
    ));

    try {
      const res  = await fetch("/api/scenes/generate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          face_descriptor:    character.face_descriptor,
          scene_description:  scene.description,
          camera_angle:       scene.camera_angle,
          lighting_mood:      scene.lighting_mood,
          character_emotion:  scene.character_emotion,
          style,
          scene_number:       scene.scene_number,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");

      setScenes(prev => prev.map((s, i) =>
        i === sceneIdx ? { ...s, status: "done", image_url: data.url } : s
      ));
    } catch (err) {
      setScenes(prev => prev.map((s, i) =>
        i === sceneIdx
          ? { ...s, status: "error", error: err instanceof Error ? err.message : "Failed" }
          : s
      ));
    }
  }, [scenes, character, style]);

  const generateAll = async () => {
    if (!character) return;
    setGenerating(true);
    setStep(4);
    setGenProgress(0);

    // Generate sequentially to respect rate limits
    for (let i = 0; i < scenes.length; i++) {
      if (scenes[i].status !== "done") {
        await generateScene(i);
      }
      setGenProgress(Math.round(((i + 1) / scenes.length) * 100));
    }
    setGenerating(false);
  };

  /* ── ZIP download ────────────────────────────────────────────────────── */
  const downloadZip = () => {
    const files: Record<string, Uint8Array> = {};
    scenes.forEach((s, i) => {
      if (!s.image_url) return;
      const base64 = s.image_url.split(",")[1];
      if (!base64) return;
      const binary = atob(base64);
      const bytes  = new Uint8Array(binary.length);
      for (let j = 0; j < binary.length; j++) bytes[j] = binary.charCodeAt(j);
      const filename = `scene_${String(i + 1).padStart(2, "0")}.png`;
      files[filename] = bytes;
    });

    // Add a simple README
    const readme = `SYNTHOS Scene Pack
Character: ${character?.name ?? "Unknown"}
Style: ${style}
Scenes: ${scenes.length}
Generated: ${new Date().toISOString()}

Files are numbered scene_01.png through scene_${String(scenes.length).padStart(2, "0")}.png
Drop into DaVinci Resolve or CapCut as image sequence.
`;
    files["README.txt"] = strToU8(readme);

    const zipped    = zipSync(files);
    const blob      = new Blob([zipped.buffer as ArrayBuffer], { type: "application/zip" });
    const url       = URL.createObjectURL(blob);
    const a         = document.createElement("a");
    a.href          = url;
    a.download      = `synthos_pack_${character?.name?.toLowerCase().replace(/\s+/g, "_") ?? "scenes"}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const doneCount = scenes.filter(s => s.status === "done").length;

  /* ─── Render ──────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#07070f] flex flex-col items-center py-10 px-4 pb-20">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center mb-8"
      >
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Film className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Consistency Engine
          </h1>
        </div>
        <p className="text-gray-500 text-sm">Same character. Same world. Every frame.</p>
      </motion.div>

      <StepBar step={step} />

      <div className="w-full max-w-3xl">
        <AnimatePresence mode="wait">

          {/* ── STEP 1: Character ─────────────────────────────────────── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="glass rounded-2xl p-6 mb-4">
                <div className="flex items-center gap-2 mb-5">
                  <Lock className="w-4 h-4 text-indigo-400" />
                  <h2 className="text-sm font-semibold text-white">Lock your character</h2>
                  <span className="text-xs text-gray-600">Upload a face photo to keep them consistent across every scene</span>
                </div>

                {/* Character name */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-400 mb-2">Character name</label>
                  <input
                    value={charName}
                    onChange={e => setCharName(e.target.value)}
                    placeholder="e.g. Kaito, Sarah, Protagonist…"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* Upload zone */}
                {!character ? (
                  <div
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-3 cursor-pointer transition-all ${
                      dragOver
                        ? "border-indigo-500/60 bg-indigo-500/10"
                        : "border-white/10 hover:border-indigo-500/40 hover:bg-indigo-500/5"
                    }`}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                        <p className="text-sm text-gray-400">Uploading + analyzing face…</p>
                        <p className="text-xs text-gray-600">BLIP is extracting the face descriptor</p>
                      </>
                    ) : (
                      <>
                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                          <Upload className="w-7 h-7 text-indigo-400" />
                        </div>
                        <p className="text-sm text-white font-medium">Drop face photo here</p>
                        <p className="text-xs text-gray-500">or click to browse · JPEG, PNG, WebP · max 10 MB</p>
                      </>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileInput} className="hidden" />
                  </div>
                ) : (
                  /* Locked character card */
                  <div className="rounded-2xl bg-indigo-500/10 border border-indigo-500/20 p-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-indigo-500/20 border border-indigo-500/30">
                      {character.preview_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={character.preview_url} alt={character.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-8 h-8 text-indigo-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Lock className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-sm font-bold text-white">{character.name}</span>
                        <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-medium">Locked</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">"{character.face_descriptor}"</p>
                    </div>
                    <button
                      onClick={() => { setCharacter(null); setUploadError(null); }}
                      className="text-gray-600 hover:text-white transition-colors shrink-0"
                      title="Remove character"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {uploadError && (
                  <div className="mt-3 flex items-start gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    {uploadError}
                  </div>
                )}
              </div>

              {/* Saved characters */}
              {savedChars.length > 0 && !character && (
                <div className="glass rounded-2xl p-4 mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Or pick a saved character</p>
                  <div className="flex flex-wrap gap-2">
                    {savedChars.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setCharacter(c)}
                        className="flex items-center gap-2 px-3 py-2 glass glass-hover rounded-xl text-xs text-gray-300 hover:text-white border border-white/10 hover:border-indigo-500/40 transition-all"
                      >
                        {c.preview_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={c.preview_url} alt={c.name} className="w-6 h-6 rounded-full object-cover" />
                        ) : (
                          <User className="w-4 h-4 text-indigo-400" />
                        )}
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!character}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-all"
                >
                  Next: Write script <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Script ────────────────────────────────────────── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="glass rounded-2xl p-6 mb-4">
                <div className="flex items-center gap-2 mb-5">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <h2 className="text-sm font-semibold text-white">Paste or write your script</h2>
                </div>

                <textarea
                  value={script}
                  onChange={e => setScript(e.target.value)}
                  placeholder="Paste your script, story outline, or scene descriptions…"
                  rows={12}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none font-mono leading-relaxed"
                />

                <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                  <button
                    onClick={() => setScript(EXAMPLE_SCRIPT)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Use example script →
                  </button>
                  <p className="text-xs text-gray-600">{script.trim().split(/\s+/).filter(Boolean).length} words · Llama-3.3-70B will extract 5–15 scenes</p>
                </div>

                {/* Style picker */}
                <div className="mt-4 pt-4 border-t border-white/8">
                  <label className="block text-xs font-medium text-gray-400 mb-2">Art style</label>
                  <div className="flex flex-wrap gap-2">
                    {STYLES.map(s => (
                      <button
                        key={s}
                        onClick={() => setStyle(s)}
                        className={`text-xs px-3 py-1.5 rounded-xl border transition-colors ${
                          style === s
                            ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/30"
                            : "text-gray-500 glass glass-hover border-white/10 hover:text-white"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {breakError && (
                <div className="flex items-start gap-2 p-3 mb-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  {breakError}
                </div>
              )}

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 px-4 py-2.5 glass glass-hover text-gray-400 hover:text-white rounded-xl text-sm transition-all"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={breakScript}
                  disabled={!script.trim() || breaking}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-all"
                >
                  {breaking ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing with Llama-3.3-70B…</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Break into scenes</>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: Review scenes ─────────────────────────────────── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="glass rounded-2xl p-5 mb-4">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-indigo-400" />
                    <h2 className="text-sm font-semibold text-white">{scenes.length} scenes detected</h2>
                    <span className="text-xs text-gray-600">Review and confirm before generating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-300">
                      <Lock className="w-3 h-3" />
                      {character?.name}
                    </div>
                    <span className="text-xs text-gray-600">· {style}</span>
                  </div>
                </div>

                <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                  {scenes.map((scene, i) => (
                    <div key={i} className="glass rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <span className="shrink-0 w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center text-xs font-bold">
                          {scene.scene_number}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-300 leading-relaxed mb-2">{scene.description}</p>
                          <div className="flex flex-wrap gap-1.5">
                            <SceneChip icon={<Camera className="w-2.5 h-2.5" />} label={scene.camera_angle} color="indigo" />
                            <SceneChip label={scene.lighting_mood} color="amber" />
                            <SceneChip label={scene.character_emotion} color="pink" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-4 py-2.5 glass glass-hover text-gray-400 hover:text-white rounded-xl text-sm transition-all"
                >
                  <ChevronLeft className="w-4 h-4" /> Edit script
                </button>
                <button
                  onClick={generateAll}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all"
                >
                  <Zap className="w-4 h-4" /> Generate {scenes.length} scenes
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 4: Scene grid ────────────────────────────────────── */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>

              {/* Progress bar */}
              {generating && (
                <div className="mb-4 glass rounded-2xl p-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                      Generating scenes with FLUX + face lock…
                    </span>
                    <span className="text-indigo-300 font-semibold">{doneCount} / {scenes.length}</span>
                  </div>
                  <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                      style={{ width: `${genProgress}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>
              )}

              {/* Scene grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {scenes.map((scene, i) => (
                  <SceneCard
                    key={i}
                    scene={scene}
                    index={i}
                    onRegenerate={() => generateScene(i)}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <button
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 px-4 py-2.5 glass glass-hover text-gray-400 hover:text-white rounded-xl text-sm transition-all"
                >
                  <ChevronLeft className="w-4 h-4" /> Review scenes
                </button>

                <div className="flex items-center gap-2">
                  {!generating && doneCount < scenes.length && (
                    <button
                      onClick={generateAll}
                      className="flex items-center gap-2 px-4 py-2.5 glass glass-hover text-indigo-300 hover:text-white rounded-xl text-sm border border-indigo-500/20 transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Retry failed
                    </button>
                  )}
                  {doneCount > 0 && (
                    <button
                      onClick={downloadZip}
                      disabled={generating}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-500/20 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Download {doneCount} scenes as ZIP
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Scene chip ─────────────────────────────────────────────────────────── */
function SceneChip({
  label, color, icon,
}: {
  label: string;
  color: "indigo" | "amber" | "pink";
  icon?: React.ReactNode;
}) {
  const colors = {
    indigo: "bg-indigo-500/10 text-indigo-400",
    amber:  "bg-amber-500/10 text-amber-400",
    pink:   "bg-pink-500/10 text-pink-400",
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${colors[color]}`}>
      {icon}
      {label}
    </span>
  );
}

/* ─── Scene card ─────────────────────────────────────────────────────────── */
function SceneCard({
  scene, index, onRegenerate,
}: {
  scene:        SceneWithStatus;
  index:        number;
  onRegenerate: () => void;
}) {
  return (
    <div className="glass rounded-xl overflow-hidden group">
      {/* Image area */}
      <div className="aspect-video relative bg-[#0a0a17]">
        {scene.status === "generating" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="flex items-end gap-0.5 h-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 rounded-full bg-indigo-500/60"
                  animate={{ height: ["30%", "100%", "30%"] }}
                  transition={{ duration: 0.6 + i * 0.05, repeat: Infinity, ease: "easeInOut", delay: i * 0.06 }}
                  style={{ minHeight: 3 }}
                />
              ))}
            </div>
            <p className="text-[10px] text-gray-600">Generating…</p>
          </div>
        )}

        {scene.status === "pending" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] text-gray-700">Scene {scene.scene_number}</span>
          </div>
        )}

        {scene.status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-2">
            <AlertCircle className="w-5 h-5 text-rose-500/60" />
            <p className="text-[9px] text-rose-500/60 text-center">{scene.error ?? "Failed"}</p>
          </div>
        )}

        {scene.status === "done" && scene.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={scene.image_url}
            alt={`Scene ${scene.scene_number}`}
            className="w-full h-full object-cover"
          />
        )}

        {/* Overlay: number + regen button */}
        <div className="absolute top-1.5 left-1.5">
          <span className="text-[10px] font-bold text-white/70 bg-black/40 rounded px-1.5 py-0.5">
            {String(scene.scene_number).padStart(2, "0")}
          </span>
        </div>

        {(scene.status === "done" || scene.status === "error") && (
          <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onRegenerate}
              className="flex items-center gap-1 text-[10px] px-2 py-1 bg-black/70 hover:bg-indigo-600/80 text-white rounded-lg border border-white/10 transition-all"
              title="Regenerate this scene"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              Redo
            </button>
          </div>
        )}
      </div>

      {/* Caption */}
      <div className="p-2">
        <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">{scene.description}</p>
      </div>
    </div>
  );
}
