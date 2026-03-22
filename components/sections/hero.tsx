"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Cpu, X, ImageIcon, VideoIcon, Music2, Sparkles, Zap } from "lucide-react";
import { GradientText } from "@/components/ui/gradient-text";

/* ─── Floating preview images (fixed seeds → consistent results) ─────────── */
const PREVIEW_IMAGES = [
  { prompt: "anime cyberpunk neon alley samurai rain night",      seed: 101, w: 340, h: 200, x: "-left-8",        y: "top-32",   rotate: "-3deg",  delay: 0    },
  { prompt: "anime dragon mountain golden hour epic landscape",    seed: 202, w: 300, h: 180, x: "right-[-20px]",  y: "top-20",   rotate: "4deg",   delay: 0.15 },
  { prompt: "anime underwater ancient city bioluminescent",        seed: 303, w: 280, h: 170, x: "left-[8%]",      y: "bottom-20",rotate: "2deg",   delay: 0.3  },
  { prompt: "anime futuristic space station interior astronaut",   seed: 404, w: 320, h: 190, x: "right-[5%]",     y: "bottom-24",rotate: "-5deg",  delay: 0.45 },
];

const floatUrl = (prompt: string, seed: number, w: number, h: number) =>
  `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${w}&height=${h}&seed=${seed}&nologo=true`;

/* ─── Stagger helpers ────────────────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial:   { opacity: 0, y: 24 },
  animate:   { opacity: 1, y: 0  },
  transition: { duration: 0.55, delay },
});

export function Hero() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden pt-24 pb-16">

        {/* ── Background glows ────────────────────────────────────── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-indigo-600/12 rounded-full blur-[140px]" />
          <div className="absolute top-1/2 right-1/5 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-pink-600/8 rounded-full blur-[100px]" />
          {/* Subtle grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:64px_64px]" />
          {/* Vignette */}
          <div className="absolute inset-0 bg-radial-gradient" style={{ background: "radial-gradient(ellipse at center, transparent 40%, #07070f 90%)" }} />
        </div>

        {/* ── Floating image cards ─────────────────────────────────── */}
        {PREVIEW_IMAGES.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.22, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 + img.delay, ease: "easeOut" }}
            className={`absolute hidden lg:block pointer-events-none select-none`}
            style={{
              [img.x.startsWith("left") ? "left" : "right"]: img.x.replace(/^(left|right)-?\[?/, "").replace(/\]$/, ""),
              [img.y.startsWith("top") ? "top" : "bottom"]:  img.y.replace(/^(top|bottom)-/, ""),
              transform: `rotate(${img.rotate})`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={floatUrl(img.prompt, img.seed, img.w, img.h)}
              alt=""
              width={img.w}
              height={img.h}
              className="rounded-2xl border border-white/10 shadow-2xl shadow-black/60"
              style={{ filter: "blur(0.5px)" }}
              loading="lazy"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/40 to-transparent" />
          </motion.div>
        ))}

        {/* ── Main content ─────────────────────────────────────────── */}
        <div className="relative max-w-5xl mx-auto text-center z-10">

          {/* Badge */}
          <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2.5 glass rounded-full px-4 py-2 text-sm text-indigo-300 mb-8 border border-indigo-500/20">
            <Cpu className="w-4 h-4" />
            Powered by OpenClaw Engine · 9 AI Agents
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            {...fadeUp(0.08)}
            className="text-5xl sm:text-6xl lg:text-[4.5rem] font-bold leading-[1.08] tracking-tight mb-6"
          >
            <span className="text-white">Synthesize stories.</span>
            <br />
            <span className="text-white">Ship scenes.</span>
            <br />
            <GradientText>Scale everything.</GradientText>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            {...fadeUp(0.16)}
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            SYNTHOS is the AI-native production studio that takes your idea from concept to
            fully-rendered, multi-language series — automated, consistent, and cinematic.
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...fadeUp(0.22)}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
          >
            <Link
              href="/signup"
              className="group flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600
                         hover:from-indigo-500 hover:to-violet-500 text-white px-8 py-4 rounded-xl
                         font-semibold text-base transition-all hover:scale-[1.03] shadow-xl shadow-indigo-600/30
                         active:scale-95"
            >
              Start your studio
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <button
              onClick={() => setDemoOpen(true)}
              className="flex items-center gap-2.5 glass glass-hover text-gray-300 hover:text-white px-8 py-4 rounded-xl font-semibold text-base"
            >
              <Play className="w-4 h-4 fill-current" />
              See how it works
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            {...fadeUp(0.3)}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-xl mx-auto"
          >
            {[
              { value: "9",      label: "AI Agents"         },
              { value: "1,200+", label: "Episodes rendered" },
              { value: "40+",    label: "Languages"         },
              { value: "99.9%",  label: "Uptime SLA"        },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold gradient-text tabular-nums">{s.value}</div>
                <div className="text-xs text-gray-600 mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Product preview mockup ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          className="relative z-10 w-full max-w-4xl mx-auto mt-20 px-4"
        >
          {/* Browser chrome */}
          <div className="rounded-2xl border border-white/[0.12] bg-[#0a0a17] shadow-[0_32px_80px_rgba(0,0,0,0.7)] overflow-hidden">
            {/* Chrome bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.08] bg-[#0d0d1f]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/60" />
                <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="glass rounded-lg px-3 py-1 text-[11px] text-gray-600 flex items-center gap-1.5 w-48">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  synthos.app/create
                </div>
              </div>
            </div>

            {/* App chrome */}
            <div className="flex h-[360px] overflow-hidden">
              {/* Mini sidebar */}
              <div className="w-12 bg-[#07070f] border-r border-white/[0.06] flex flex-col items-center py-3 gap-3 shrink-0">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <Cpu className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="h-px w-6 bg-white/10 mt-1" />
                {[Sparkles, ImageIcon, VideoIcon, Music2].map((Icon, i) => (
                  <div key={i} className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors
                    ${i === 0 ? "bg-indigo-600/30 text-indigo-300" : "text-gray-700 hover:text-gray-500"}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                ))}
              </div>

              {/* Create page content */}
              <div className="flex-1 bg-[#07070f] flex flex-col items-center pt-6 px-6 overflow-hidden">
                {/* Mode tabs */}
                <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] rounded-xl p-0.5 mb-4">
                  {[
                    { Icon: ImageIcon, label: "Image",  active: true  },
                    { Icon: VideoIcon, label: "Video",  active: false },
                    { Icon: Music2,    label: "Music",  active: false },
                  ].map(({ Icon, label, active }) => (
                    <div key={label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium
                      ${active ? "bg-indigo-600 text-white shadow" : "text-gray-600"}`}>
                      <Icon className="w-3 h-3" />
                      {label}
                    </div>
                  ))}
                </div>

                {/* Prompt box */}
                <div className="w-full max-w-lg bg-white/[0.04] border border-white/[0.10] rounded-xl p-3 mb-4">
                  <div className="text-xs text-gray-400 mb-2">A samurai standing in neon rain, cyberpunk Tokyo, cinematic...</div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <div className="text-[10px] px-2 py-0.5 bg-white/[0.06] border border-white/[0.08] rounded-md text-gray-500">Anime</div>
                      <div className="text-[10px] px-2 py-0.5 bg-white/[0.06] border border-white/[0.08] rounded-md text-gray-500">896×504</div>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 rounded-lg text-[10px] text-white font-medium">
                      <Zap className="w-2.5 h-2.5" /> Generate
                    </div>
                  </div>
                </div>

                {/* Generated image preview */}
                <div className="w-full max-w-lg rounded-xl overflow-hidden border border-white/[0.08] relative flex-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={floatUrl("anime samurai cyberpunk neon rain cinematic dramatic", 777, 600, 340)}
                    alt="Generated anime scene preview"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    {["Save", "Redo"].map(label => (
                      <div key={label} className="px-2 py-1 bg-black/60 backdrop-blur-sm border border-white/15 rounded-md text-[9px] text-white/80">
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Glow under mockup */}
          <div className="absolute -bottom-6 left-1/4 right-1/4 h-16 bg-indigo-600/20 blur-2xl rounded-full" />
        </motion.div>
      </section>

      {/* ── How it works modal (replaces "demo coming soon") ─────── */}
      <AnimatePresence>
        {demoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
            onClick={() => setDemoOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1,    opacity: 1, y: 0  }}
              exit={{    scale: 0.95, opacity: 0         }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="glass rounded-2xl w-full max-w-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                    <Play className="w-4 h-4 text-indigo-400 fill-indigo-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">How SYNTHOS Works</p>
                    <p className="text-xs text-gray-500">6-step AI production pipeline</p>
                  </div>
                </div>
                <button onClick={() => setDemoOpen(false)} className="text-gray-600 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Steps */}
              <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {PIPELINE_STEPS.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="glass rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-indigo-400 bg-indigo-500/15 w-5 h-5 rounded-md flex items-center justify-center">
                        {i + 1}
                      </span>
                      <step.icon className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <p className="text-xs font-semibold text-white mb-1">{step.title}</p>
                    <p className="text-[11px] text-gray-500 leading-relaxed">{step.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <div className="px-6 pb-6 flex gap-3">
                <Link
                  href="/signup"
                  onClick={() => setDemoOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600
                             hover:from-indigo-500 hover:to-violet-500 text-white py-3 rounded-xl font-semibold text-sm transition-all"
                >
                  Start building free <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setDemoOpen(false)}
                  className="glass glass-hover text-gray-400 hover:text-white px-5 py-3 rounded-xl text-sm"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const PIPELINE_STEPS = [
  { icon: Sparkles,  title: "Define project",      desc: "Set genre, style, and series parameters. OpenClaw reads your intent." },
  { icon: ImageIcon, title: "Build characters",    desc: "DNA-locked character profiles ensure visual consistency across episodes." },
  { icon: Cpu,       title: "Script with AI",      desc: "Llama 3.3-70B writes full screenplays with your characters and world." },
  { icon: VideoIcon, title: "Storyboard & render", desc: "AnimeDiffusion renders each scene with locked style consistency." },
  { icon: Music2,    title: "Add audio",            desc: "MusicGen composes original soundtracks. Voice AI syncs dialogue." },
  { icon: ArrowRight,title: "Publish globally",    desc: "40+ language dubbing with lip-sync for worldwide distribution." },
];
