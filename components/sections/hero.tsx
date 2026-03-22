"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Play, Cpu, X } from "lucide-react";
import { GradientText } from "@/components/ui/gradient-text";

export function Hero() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <>
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden pt-20">
      {/* Bg glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        {/* OpenClaw badge */}
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-indigo-300 mb-8">
          <Cpu className="w-4 h-4" />
          Powered by OpenClaw Engine · 9 AI Agents
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
          <span className="text-white">Synthesize stories.</span>
          <br />
          <span className="text-white">Ship scenes.</span>
          <br />
          <GradientText>Scale everything.</GradientText>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          SYNTHOS is the AI-native production studio that takes your idea from concept to
          fully-rendered, multi-language series — automated, consistent, and cinematic.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/signup"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-xl shadow-indigo-600/25"
          >
            Start your studio <ArrowRight className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setDemoOpen(true)}
            className="flex items-center gap-2 glass glass-hover text-gray-300 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg"
          >
            <Play className="w-5 h-5 fill-current" />
            Watch demo
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
          {[
            { value: "9",     label: "AI Agents" },
            { value: "1,200+", label: "Episodes rendered" },
            { value: "12+",   label: "Languages" },
            { value: "99.9%", label: "Uptime SLA" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold gradient-text">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
    {/* Demo modal */}
    {demoOpen && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={() => setDemoOpen(false)}
      >
        <div
          className="glass rounded-2xl p-8 max-w-lg w-full text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-16 h-16 bg-indigo-500/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-indigo-400 fill-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Demo coming soon</h3>
          <p className="text-gray-400 text-sm mb-6">
            The SYNTHOS walkthrough video is in production. Sign up to get notified when it&apos;s live — and access the interactive studio now.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/signup"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
              onClick={() => setDemoOpen(false)}
            >
              Try the studio
            </Link>
            <button
              onClick={() => setDemoOpen(false)}
              className="glass glass-hover text-gray-400 hover:text-white px-5 py-2.5 rounded-xl text-sm"
            >
              Close
            </button>
          </div>
          <button
            onClick={() => setDemoOpen(false)}
            className="absolute top-4 right-4 text-gray-600 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    )}
    </>
  );
}
