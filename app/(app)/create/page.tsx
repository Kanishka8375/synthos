"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, ImageIcon, VideoIcon, Music2, Download, RefreshCw,
  ChevronDown, Zap, Clock, Maximize2, Copy, Check, X, Play, Pause,
  Volume2, VolumeX, RotateCcw, Loader2,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────────────── */
type Mode = "image" | "video" | "music";
type Result =
  | { type: "image"; url: string; prompt: string }
  | { type: "video"; objectUrl: string; prompt: string }
  | { type: "music"; url: string; prompt: string };

/* ─── Option lists ───────────────────────────────────────────────────────── */
const IMAGE_STYLES  = ["Anime", "Cinematic", "Photorealistic", "Manga", "Oil Painting", "3D Render", "Pixel Art", "Watercolor"];
const VIDEO_MODELS  = ["wan", "veo", "seedance", "ltx-2", "p-video"];
const ASPECT_RATIOS = ["16:9", "9:16", "1:1"];
const DURATIONS     = [4, 6, 8];
const MUSIC_MOODS   = ["Epic", "Calm", "Tense", "Upbeat", "Melancholic", "Futuristic", "Dark", "Romantic"];
const MUSIC_GENRES  = ["Orchestral", "Electronic", "Lo-fi", "Ambient", "Rock", "Jazz", "Cinematic", "Pop"];

const PLACEHOLDERS: Record<Mode, string[]> = {
  image: [
    "A samurai standing in a neon-lit rain alley, cyberpunk Tokyo…",
    "Dragon soaring over misty mountains at golden hour, epic wide shot…",
    "Underwater city with bioluminescent creatures and ancient ruins…",
  ],
  video: [
    "A phoenix rising from volcanic lava, feathers catching fire, slow motion…",
    "Time-lapse of a cherry blossom tree blooming, petals falling in the wind…",
    "Astronaut floating weightlessly inside a futuristic space station…",
  ],
  music: [
    "Epic orchestral battle theme with intense drums and soaring strings…",
    "Lo-fi chill beats with soft piano and rain ambience in the background…",
    "Dark electronic soundtrack with pulsing bass and eerie synth layers…",
  ],
};

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function CreatePage() {
  const [mode,        setMode]        = useState<Mode>("image");
  const [prompt,      setPrompt]      = useState("");
  const [style,       setStyle]       = useState("Anime");
  const [videoModel,  setVideoModel]  = useState("wan");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [duration,    setDuration]    = useState(4);
  const [mood,        setMood]        = useState("Epic");
  const [genre,       setGenre]       = useState("Orchestral");
  const [loading,     setLoading]     = useState(false);
  const [progress,    setProgress]    = useState(0);
  const [result,      setResult]      = useState<Result | null>(null);
  const [error,       setError]       = useState<string | null>(null);
  const [copied,      setCopied]      = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  const blobUrlRef    = useRef<string | null>(null);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Rotate placeholder text */
  useEffect(() => {
    const t = setInterval(() => setPlaceholderIdx(i => (i + 1) % 3), 4000);
    return () => clearInterval(t);
  }, []);

  /* Clean up blob URL on unmount */
  useEffect(() => () => { if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current); }, []);

  const stopProgress = () => {
    if (progressTimer.current) { clearInterval(progressTimer.current); progressTimer.current = null; }
  };

  const startProgress = (speed: number) => {
    stopProgress();
    progressTimer.current = setInterval(() => {
      setProgress(p => Math.min(p + speed, 92));
    }, 400);
  };

  const generate = useCallback(async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setProgress(0);

    try {
      if (mode === "image") {
        startProgress(3);
        const res  = await fetch("/api/generate/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: `${style} style, high quality, detailed: ${prompt}`,
            width: 896,
            height: 504,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Image generation failed");
        setResult({ type: "image", url: data.url, prompt });

      } else if (mode === "video") {
        startProgress(0.6);
        const res = await fetch("/api/generate/video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, model: videoModel, duration, aspectRatio }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error((data as { error?: string }).error ?? "Video generation failed");
        }
        if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        blobUrlRef.current = objectUrl;
        setResult({ type: "video", objectUrl, prompt });

      } else {
        startProgress(2);
        const res  = await fetch("/api/generate/music", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, mood, genre, duration: 30 }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Music generation failed");
        const url = data.audio ?? data.url ?? "";
        setResult({ type: "music", url, prompt });
      }

      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed. Please try again.");
    } finally {
      stopProgress();
      setLoading(false);
    }
  }, [prompt, mode, style, videoModel, aspectRatio, duration, mood, genre, loading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) generate();
  };

  const handleDownload = () => {
    if (!result) return;
    const url = result.type === "video" ? result.objectUrl : result.url;
    const ext  = result.type === "video" ? "mp4" : result.type === "music" ? "wav" : "png";
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `synthos-${result.type}-${Date.now()}.${ext}`;
    a.click();
  };

  const handleCopyUrl = async () => {
    if (!result || result.type === "video") return;
    await navigator.clipboard.writeText(result.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#07070f] flex flex-col items-center py-10 px-4 pb-20">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center mb-8"
      >
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
              Create
            </span>
          </h1>
        </div>
        <p className="text-gray-500 text-sm">Generate images, videos, and music with AI</p>
      </motion.div>

      {/* ── Mode selector ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-1 mb-6"
      >
        {([
          { key: "image" as Mode, Icon: ImageIcon, label: "Image" },
          { key: "video" as Mode, Icon: VideoIcon, label: "Video" },
          { key: "music" as Mode, Icon: Music2,    label: "Music" },
        ] as const).map(({ key, Icon, label }) => (
          <button
            key={key}
            onClick={() => switchMode(key)}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${mode === key
                ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 scale-[1.02]"
                : "text-gray-500 hover:text-gray-200 hover:bg-white/5"
              }
            `}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </motion.div>

      {/* ── Prompt card ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="w-full max-w-3xl"
      >
        <div className="relative bg-white/[0.04] border border-white/[0.10] rounded-2xl overflow-hidden
                        focus-within:border-indigo-500/50 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.08)]
                        transition-all duration-200">

          {/* Textarea */}
          <AnimatePresence mode="wait">
            <motion.textarea
              key={mode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={PLACEHOLDERS[mode][placeholderIdx]}
              rows={4}
              className="w-full bg-transparent text-white text-[15px] leading-relaxed placeholder-gray-600
                         px-5 pt-5 pb-3 resize-none focus:outline-none"
            />
          </AnimatePresence>

          {/* Options row */}
          <div className="flex items-center gap-2 px-4 pb-4 pt-1 flex-wrap">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode + "-opts"}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2 flex-wrap"
              >
                {mode === "image" && (
                  <OptionSelect value={style} onChange={setStyle} options={IMAGE_STYLES} label="Style" />
                )}
                {mode === "video" && (
                  <>
                    <OptionSelect value={videoModel}  onChange={setVideoModel}  options={VIDEO_MODELS}  label="Model"  />
                    <OptionSelect value={aspectRatio} onChange={setAspectRatio} options={ASPECT_RATIOS} label="Ratio"
                      icon={<Maximize2 className="w-3 h-3" />} />
                    <OptionSelect
                      value={String(duration) + "s"}
                      onChange={v => setDuration(parseInt(v))}
                      options={DURATIONS.map(d => d + "s")}
                      label="Duration"
                      icon={<Clock className="w-3 h-3" />}
                    />
                  </>
                )}
                {mode === "music" && (
                  <>
                    <OptionSelect value={mood}  onChange={setMood}  options={MUSIC_MOODS}   label="Mood"  />
                    <OptionSelect value={genre} onChange={setGenre} options={MUSIC_GENRES}  label="Genre" />
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex-1" />
            <span className="text-gray-700 text-[11px] hidden sm:block select-none">⌘↵ generate</span>

            {prompt.trim() && (
              <button
                onClick={() => { setPrompt(""); setResult(null); setError(null); }}
                className="text-gray-600 hover:text-gray-400 transition-colors"
                title="Clear"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={generate}
              disabled={loading || !prompt.trim()}
              className="
                flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white
                bg-gradient-to-r from-indigo-600 to-violet-600
                hover:from-indigo-500 hover:to-violet-500
                active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed
                shadow-lg shadow-indigo-500/20 transition-all duration-150
              "
            >
              {loading
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…</>
                : <><Zap className="w-3.5 h-3.5" /> Generate</>
              }
            </button>
          </div>

          {/* Progress bar */}
          {loading && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          )}
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 flex items-start gap-2 px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-sm text-rose-400"
            >
              <X className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Result / Loading skeleton ───────────────────────────────────── */}
      <div className="w-full max-w-3xl mt-6">
        <AnimatePresence mode="wait">
          {loading && !result && (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              <GeneratingSkeleton mode={mode} />
            </motion.div>
          )}

          {result && !loading && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <ResultCard
                result={result}
                onDownload={handleDownload}
                onCopyUrl={handleCopyUrl}
                onRegenerate={generate}
                copied={copied}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Tips row ───────────────────────────────────────────────────── */}
      {!loading && !result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex flex-wrap justify-center gap-3 max-w-2xl"
        >
          {PROMPT_TIPS[mode].map(tip => (
            <button
              key={tip}
              onClick={() => setPrompt(tip)}
              className="px-3.5 py-2 bg-white/[0.04] border border-white/[0.08] rounded-xl text-xs text-gray-500
                         hover:text-gray-200 hover:border-white/20 hover:bg-white/[0.07] transition-all"
            >
              {tip}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

/* ─── Generating skeleton ────────────────────────────────────────────────── */
function GeneratingSkeleton({ mode }: { mode: Mode }) {
  const heights = { image: "h-[440px]", video: "h-[420px]", music: "h-[160px]" };
  const messages = {
    image: ["Painting pixels…", "Diffusing latents…", "Sharpening details…"],
    video: ["Rendering frames…", "This takes 30–90 seconds…", "Almost there…"],
    music: ["Composing melody…", "Layering instruments…", "Mixing audio…"],
  };
  const [msgIdx, setMsgIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setMsgIdx(i => (i + 1) % messages[mode].length), 2500);
    return () => clearInterval(t);
  }, [mode]);

  return (
    <div className={`${heights[mode]} bg-white/[0.03] border border-white/[0.08] rounded-2xl flex flex-col items-center justify-center gap-4 overflow-hidden relative`}>
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 animate-pulse" />

      {/* Waveform bars */}
      <div className="flex items-end gap-1 h-12 z-10">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-1.5 rounded-full bg-gradient-to-t from-indigo-500/60 to-violet-500/60"
            animate={{ height: ["40%", "100%", "40%"] }}
            transition={{ duration: 0.8 + i * 0.05, repeat: Infinity, ease: "easeInOut", delay: i * 0.06 }}
            style={{ minHeight: 4 }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={msgIdx}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3 }}
          className="text-gray-500 text-sm z-10"
        >
          {messages[mode][msgIdx]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

/* ─── Result card ────────────────────────────────────────────────────────── */
function ResultCard({
  result, onDownload, onCopyUrl, onRegenerate, copied,
}: {
  result: Result;
  onDownload: () => void;
  onCopyUrl: () => void;
  onRegenerate: () => void;
  copied: boolean;
}) {
  const [muted,   setMuted]   = useState(false);
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) { videoRef.current.play(); setPlaying(true); }
    else { videoRef.current.pause(); setPlaying(false); }
  };

  return (
    <div className="group relative rounded-2xl overflow-hidden border border-white/[0.10] bg-black shadow-2xl shadow-black/60">
      {/* Media */}
      {result.type === "image" && (
        <img
          src={result.url}
          alt={result.prompt}
          className="w-full object-cover"
          style={{ maxHeight: 520 }}
        />
      )}

      {result.type === "video" && (
        <div className="relative">
          <video
            ref={videoRef}
            src={result.objectUrl}
            autoPlay
            loop
            muted={muted}
            playsInline
            className="w-full"
            style={{ maxHeight: 520, background: "#000" }}
          />
          {/* Video controls overlay */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={togglePlay}
              className="flex items-center justify-center w-9 h-9 bg-black/70 backdrop-blur-sm border border-white/20 rounded-full hover:bg-black/90 transition-all"
            >
              {playing ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
            </button>
            <button
              onClick={() => setMuted(m => !m)}
              className="flex items-center justify-center w-9 h-9 bg-black/70 backdrop-blur-sm border border-white/20 rounded-full hover:bg-black/90 transition-all"
            >
              {muted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
            </button>
            <button
              onClick={() => { if (videoRef.current) { videoRef.current.currentTime = 0; videoRef.current.play(); setPlaying(true); } }}
              className="flex items-center justify-center w-9 h-9 bg-black/70 backdrop-blur-sm border border-white/20 rounded-full hover:bg-black/90 transition-all"
            >
              <RotateCcw className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {result.type === "music" && (
        <div className="p-8 bg-gradient-to-br from-indigo-900/20 to-violet-900/20">
          <WaveformViz />
          <audio src={result.url} controls className="w-full mt-4" style={{ colorScheme: "dark" }} />
        </div>
      )}

      {/* Top-right action toolbar */}
      <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
        {result.type !== "video" && (
          <ActionButton onClick={onCopyUrl} title={copied ? "Copied!" : "Copy URL"}>
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="text-xs">{copied ? "Copied" : "Copy"}</span>
          </ActionButton>
        )}
        <ActionButton onClick={onDownload} title="Download">
          <Download className="w-3.5 h-3.5" />
          <span className="text-xs">Save</span>
        </ActionButton>
        <ActionButton onClick={onRegenerate} title="Regenerate">
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="text-xs">Redo</span>
        </ActionButton>
      </div>

      {/* Prompt caption */}
      <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/80 to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-white/60 text-xs line-clamp-1">"{result.prompt}"</p>
      </div>
    </div>
  );
}

function ActionButton({ onClick, title, children }: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-black/75 backdrop-blur-md border border-white/15
                 rounded-lg text-white/80 hover:text-white hover:bg-black/95 hover:border-white/30
                 transition-all duration-150"
    >
      {children}
    </button>
  );
}

/* ─── Waveform viz ───────────────────────────────────────────────────────── */
function WaveformViz() {
  const bars = Array.from({ length: 64 }, (_, i) =>
    20 + Math.sin(i * 0.5) * 12 + Math.sin(i * 0.15) * 20 + Math.random() * 15
  );
  return (
    <div className="flex items-end gap-0.5 h-20 w-full">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 bg-gradient-to-t from-indigo-500/90 to-violet-400/70 rounded-[1px]"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

/* ─── Option select ──────────────────────────────────────────────────────── */
function OptionSelect({ value, onChange, options, label, icon }: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="relative flex items-center">
      {icon && <span className="absolute left-2 text-gray-500 pointer-events-none">{icon}</span>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        title={label}
        className={`
          appearance-none pr-6 py-1.5 bg-white/[0.06] border border-white/[0.10] rounded-lg
          text-xs text-gray-300 focus:outline-none focus:border-indigo-500/50
          cursor-pointer hover:bg-white/[0.10] hover:text-white transition-colors
          ${icon ? "pl-6" : "pl-3"}
        `}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-600 pointer-events-none" />
    </div>
  );
}

/* ─── Prompt tips ────────────────────────────────────────────────────────── */
const PROMPT_TIPS: Record<Mode, string[]> = {
  image: [
    "Samurai in neon rain",
    "Dragon at golden hour",
    "Underwater ancient city",
    "Futuristic Tokyo skyline",
    "Cherry blossom spirit",
  ],
  video: [
    "Phoenix rising from lava",
    "Cherry blossom time-lapse",
    "Astronaut floating in space",
    "Cyberpunk city chase",
    "Ocean waves at sunrise",
  ],
  music: [
    "Epic battle theme",
    "Lo-fi study beats",
    "Dark electronic pulse",
    "Romantic piano melody",
    "Futuristic ambient",
  ],
};
