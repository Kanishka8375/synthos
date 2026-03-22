"use client";

import { useState } from "react";
import { DashHeader } from "@/components/dashboard/header";
import { OpenClawBadge } from "@/components/ui/openclaw-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { MOCK_LANGUAGES } from "@/lib/mock-data";
import { MOCK_EPISODES } from "@/lib/mock-data";
import type { Language } from "@/lib/types";
import {
  Languages, Loader2, CheckCircle2, AlertCircle, Play,
  ChevronDown, ChevronUp, Copy, Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SAMPLE_SCRIPT = `INT. NEON ALLEY - NIGHT

Rain hammers against the neon-lit pavement as KAITO (22, black trench coat, katana at hip) steps out of the shadows.

KAITO
(quietly)
They said the city never sleeps. They were wrong. It just dreams in violence.

A figure emerges from the fog — YUKI (20, silver hair, holographic eyes glowing violet).

YUKI
You're late, Ronin. The Syndicate already moved the package.

KAITO
Then we move faster.`;

export default function MultilingualEnginePage() {
  const toast = useToast();
  const sourceEpisode = MOCK_EPISODES[0];
  const [languages, setLanguages]         = useState<Language[]>(MOCK_LANGUAGES);
  const [expanded,  setExpanded]          = useState<string | null>(null);
  const [agents, setAgents] = useState([
    { label: "Translation Engine", desc: "Multilingual dubbing with cultural adaptation", accuracy: 93, uptime: 97.4, active: false },
    { label: "Lip Sync Engine",    desc: "Frame-accurate lip sync for translated audio",  accuracy: 91, uptime: 97.2, active: false },
  ]);

  const pendingCount    = languages.filter(l => l.status === "Pending").length;
  const processingCount = languages.filter(l => l.status === "Processing").length;

  /* Translate a single language via the real API */
  const translateLanguage = async (lang: Language) => {
    setLanguages(prev => prev.map(l =>
      l.code === lang.code ? { ...l, status: "Processing" as const, progress: 0, translated: undefined } : l
    ));

    try {
      // Animate progress while waiting
      let p = 0;
      const tick = setInterval(() => {
        p = Math.min(p + 12, 88);
        setLanguages(prev => prev.map(l =>
          l.code === lang.code && l.status === "Processing" ? { ...l, progress: p } : l
        ));
      }, 400);

      const res  = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: SAMPLE_SCRIPT, targetLanguage: lang.name, targetCode: lang.code }),
      });
      clearInterval(tick);

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Translation failed");

      setLanguages(prev => prev.map(l =>
        l.code === lang.code
          ? { ...l, status: "Complete" as const, progress: 100, translated: data.translated }
          : l
      ));
      toast.success(`Translated to ${lang.name}`);
      setExpanded(lang.code); // auto-open to show result
    } catch (err) {
      setLanguages(prev => prev.map(l =>
        l.code === lang.code ? { ...l, status: "Error" as const, progress: 0 } : l
      ));
      toast.error(`Failed to translate ${lang.name}`);
    }
  };

  /* Translate all pending */
  const startAllPending = async () => {
    const pending = languages.filter(l => l.status === "Pending");
    if (!pending.length) return;
    setAgents(prev => prev.map(a => ({ ...a, active: true })));
    toast.info(`Starting translation for ${pending.length} languages…`);

    // Process sequentially to avoid rate limits
    for (const lang of pending) {
      await translateLanguage(lang);
    }
    setAgents(prev => prev.map(a => ({ ...a, active: false })));
    toast.success("All translations complete!");
  };

  return (
    <div>
      <DashHeader
        title="Multilingual Engine"
        description={`AI dubbing and lip sync · Llama 3.3-70B · ${languages.length}+ languages`}
      />
      <div className="p-5 space-y-5">

        {/* Source episode */}
        <div className="glass rounded-2xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Source Episode</p>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3 glass rounded-xl px-4 py-3">
              <div className="w-8 h-8 bg-indigo-500/15 rounded-lg flex items-center justify-center">
                <Play className="w-4 h-4 text-indigo-400 fill-current" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">EP {sourceEpisode.number}: {sourceEpisode.title}</p>
                <p className="text-xs text-gray-500">Neon Ronin · {sourceEpisode.duration} · English (source)</p>
              </div>
            </div>
            <div className="glass rounded-xl px-4 py-3 text-xs text-gray-500 leading-relaxed max-w-sm">
              <p className="text-gray-400 font-medium mb-1">Sample script loaded</p>
              <p className="line-clamp-2 text-gray-600">"{SAMPLE_SCRIPT.slice(0, 80)}…"</p>
            </div>
          </div>
        </div>

        {/* Agents */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {agents.map((agent) => (
            <div key={agent.label} className="glass rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <Languages className="w-5 h-5 text-indigo-400" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white">{agent.label}</p>
                    <OpenClawBadge label={agent.active ? "Running" : "Standby"} size="sm" active={agent.active} />
                  </div>
                  <p className="text-xs text-gray-500">{agent.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="glass rounded-lg px-2 py-1"><span className="text-gray-500">Accuracy</span> <span className="text-indigo-300 font-semibold">{agent.accuracy}%</span></span>
                <span className="glass rounded-lg px-2 py-1"><span className="text-gray-500">Uptime</span> <span className="text-emerald-400 font-semibold">{agent.uptime}%</span></span>
              </div>
            </div>
          ))}
        </div>

        {/* Language queue */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/8">
            <div>
              <h2 className="text-sm font-semibold text-white">Language Queue</h2>
              {processingCount > 0 && (
                <p className="text-xs text-indigo-400 mt-0.5">{processingCount} translating via Llama 3.3-70B…</p>
              )}
            </div>
            <button
              onClick={startAllPending}
              disabled={pendingCount === 0 || processingCount > 0}
              className="text-xs bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed
                         text-white px-3 py-1.5 rounded-lg font-medium transition-all"
            >
              {pendingCount > 0 ? `Translate ${pendingCount} pending` : "All translated"}
            </button>
          </div>

          <div className="divide-y divide-white/5">
            {languages.map((lang) => (
              <div key={lang.code}>
                <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors">
                  {/* Flag + name */}
                  <div className="flex items-center gap-3 w-36 shrink-0">
                    <span className="text-2xl">{lang.flag}</span>
                    <div>
                      <p className="text-xs font-medium text-white">{lang.name}</p>
                      <p className="text-[10px] text-gray-600">{lang.code}</p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="hidden sm:flex items-center gap-3 text-xs">
                      <span className="glass rounded-lg px-2 py-1"><span className="text-gray-600">Voice</span> <span className="text-indigo-300 font-semibold">{lang.voiceMatch}%</span></span>
                      <span className="glass rounded-lg px-2 py-1"><span className="text-gray-600">Lip Sync</span> <span className="text-pink-300 font-semibold">{lang.lipSync}%</span></span>
                    </div>

                    {lang.status === "Processing" && (
                      <div className="flex-1 max-w-xs">
                        <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                            style={{ width: `${lang.progress ?? 0}%` }}
                            transition={{ duration: 0.4 }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-600">{lang.progress ?? 0}% · translating…</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {lang.status === "Pending" && (
                      <button
                        onClick={() => translateLanguage(lang)}
                        className="text-[10px] px-2.5 py-1 bg-indigo-600/20 border border-indigo-500/30
                                   text-indigo-400 rounded-lg hover:bg-indigo-600/30 transition-colors"
                      >
                        Translate
                      </button>
                    )}
                    {lang.status === "Complete" && lang.translated && (
                      <button
                        onClick={() => setExpanded(expanded === lang.code ? null : lang.code)}
                        className="text-[10px] px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20
                                   text-emerald-400 rounded-lg hover:bg-emerald-500/15 transition-colors flex items-center gap-1"
                      >
                        {expanded === lang.code ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        View
                      </button>
                    )}
                    {lang.status === "Error" && (
                      <button
                        onClick={() => translateLanguage(lang)}
                        className="text-[10px] px-2.5 py-1 bg-rose-500/10 border border-rose-500/20
                                   text-rose-400 rounded-lg hover:bg-rose-500/15 transition-colors"
                      >
                        Retry
                      </button>
                    )}

                    {lang.status === "Complete"   && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {lang.status === "Processing" && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />}
                    {lang.status === "Error"      && <AlertCircle className="w-4 h-4 text-rose-400" />}
                    <StatusBadge status={lang.status} />
                  </div>
                </div>

                {/* Translated script preview */}
                <AnimatePresence>
                  {expanded === lang.code && lang.translated && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <TranslationPreview
                        original={SAMPLE_SCRIPT}
                        translated={lang.translated}
                        lang={lang.name}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Translation preview panel ──────────────────────────────────────────── */
function TranslationPreview({ original, translated, lang }: {
  original: string; translated: string; lang: string;
}) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(translated);
    setCopied(true);
    toast.success(`${lang} translation copied!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-5 mb-4 rounded-xl border border-white/[0.08] overflow-hidden bg-white/[0.02]">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.08]">
        <p className="text-xs font-medium text-indigo-300">Translated — {lang}</p>
        <button
          onClick={copy}
          className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-white transition-colors"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="grid grid-cols-2 divide-x divide-white/[0.08]">
        <div className="p-4">
          <p className="text-[10px] text-gray-600 mb-2 uppercase tracking-wider">Original (EN)</p>
          <pre className="text-xs text-gray-500 whitespace-pre-wrap font-mono leading-relaxed">{original}</pre>
        </div>
        <div className="p-4">
          <p className="text-[10px] text-indigo-400 mb-2 uppercase tracking-wider">{lang}</p>
          <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">{translated}</pre>
        </div>
      </div>
    </div>
  );
}
