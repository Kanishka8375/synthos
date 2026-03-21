import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-violet-300 mb-8">
          <Sparkles className="w-4 h-4" />
          Powered by OpenClaw AI Engine
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
          <span className="text-white">Build smarter with</span>
          <br />
          <span className="gradient-text">SYNTHOS</span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          The AI-powered SaaS platform that transforms how teams work. Automate workflows,
          generate insights, and scale your business — all in one intelligent workspace.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-violet-600/25"
          >
            Start for free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="#features"
            className="flex items-center gap-2 glass glass-hover text-gray-300 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg"
          >
            See how it works
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto text-center">
          {[
            { value: "50K+", label: "Active teams" },
            { value: "99.9%", label: "Uptime SLA" },
            { value: "10x", label: "Faster workflows" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
