"use client";

import { useEffect, useState } from "react";
import { DashHeader } from "@/components/dashboard/header";
import { SynthosBadge } from "@/components/ui/openclaw-badge";
import { SynthosMetricsBar } from "@/components/ui/openclaw-metrics-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_RENDER_JOBS } from "@/lib/mock-data";
import { SYNTHOS_SUMMARY } from "@/lib/openclaw";
import {
  FolderOpen, Film, Cpu, Users, ArrowRight, Zap, Clock,
  Image as ImageIcon, FileText, Music2, Sparkles, Plus,
  Download, ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface UserStats { projects: number; images: number; scripts: number; tracks: number; }
interface UserInfo  { email?: string; full_name?: string; studio_name?: string; }
interface GenImage  { id: string; url: string; prompt: string; created_at: string; }

export default function DashboardPage() {
  const renderHoursUsed = 87;
  const storageUsed     = 42;

  const [userStats,    setUserStats]    = useState<UserStats | null>(null);
  const [userInfo,     setUserInfo]     = useState<UserInfo | null>(null);
  const [recentImages, setRecentImages] = useState<GenImage[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/user")
      .then(r => r.json())
      .then(d => { setUserStats(d.stats); setUserInfo(d.user); })
      .catch(() => {});

    fetch("/api/generate/image")
      .then(r => r.json())
      .then(d => { setRecentImages((d.images ?? []).slice(0, 9)); })
      .catch(() => {})
      .finally(() => setImagesLoaded(true));
  }, []);

  const realStats = userStats ? [
    { label: "Projects",    value: userStats.projects, icon: FolderOpen, sub: "Total projects",        color: "text-indigo-400 bg-indigo-500/10" },
    { label: "Images",      value: userStats.images,   icon: ImageIcon,  sub: "Via SynthRender",       color: "text-pink-400   bg-pink-500/10"   },
    { label: "Scripts",     value: userStats.scripts,  icon: FileText,   sub: "Via Synthos LLM",       color: "text-violet-400 bg-violet-500/10" },
    { label: "Music Tracks",value: userStats.tracks,   icon: Music2,     sub: "Via SynthSound",        color: "text-cyan-400   bg-cyan-500/10"   },
  ] : [
    { label: "Projects",    value: 0, icon: FolderOpen, sub: "—", color: "text-indigo-400 bg-indigo-500/10" },
    { label: "Images",      value: 0, icon: ImageIcon,  sub: "—", color: "text-pink-400   bg-pink-500/10"   },
    { label: "Scripts",     value: 0, icon: FileText,   sub: "—", color: "text-violet-400 bg-violet-500/10" },
    { label: "Music Tracks",value: 0, icon: Music2,     sub: "—", color: "text-cyan-400   bg-cyan-500/10"   },
  ];

  const studioName = userInfo?.studio_name ?? userInfo?.full_name ?? "Your Studio";

  return (
    <div>
      <DashHeader
        title="Dashboard"
        description={`${studioName} — production overview`}
        actions={
          <Link
            href="/create"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600
                       hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold rounded-lg
                       transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" /> Create
          </Link>
        }
      />

      <div className="p-5 space-y-5">

        {/* ── Synthos AI Engine ──────────────────────────────────────── */}
        <div className="glass rounded-2xl p-4 border border-indigo-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-transparent pointer-events-none" />
          <div className="relative flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                <Cpu className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-white text-sm">Synthos AI Engine</p>
                  <SynthosBadge label="Active" />
                </div>
                <SynthosMetricsBar metrics={[
                  { label: "Active agents", value: SYNTHOS_SUMMARY.activeAgents },
                  { label: "Tasks running", value: SYNTHOS_SUMMARY.totalTasksRunning },
                  { label: "Accuracy",      value: SYNTHOS_SUMMARY.avgAccuracy,   unit: "%" },
                  { label: "Uptime",        value: SYNTHOS_SUMMARY.avgUptime,     unit: "%", color: "text-emerald-400" },
                ]} />
              </div>
            </div>
            <Link href="/episode-pipeline" className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
              View pipeline <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ── Stats ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {realStats.map((s) => (
            <div key={s.label} className="glass rounded-2xl p-4 hover:border-white/15 transition-colors border border-white/[0.06]">
              <div className={`w-9 h-9 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
                <s.icon className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold text-white tabular-nums">
                {userStats ? s.value : <span className="w-8 h-6 bg-white/10 rounded animate-pulse inline-block" />}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              <div className="text-xs text-indigo-400 mt-1">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Recent Creations Gallery ──────────────────────────────── */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/8">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-pink-400" />
              <h2 className="text-sm font-semibold text-white">Recent Creations</h2>
              {recentImages.length > 0 && (
                <span className="text-xs text-gray-600">{recentImages.length} images</span>
              )}
            </div>
            <Link
              href="/create"
              className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <Plus className="w-3 h-3" /> New <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {!imagesLoaded ? (
            /* Skeleton */
            <div className="grid grid-cols-3 gap-px p-px">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-video bg-white/[0.04] animate-pulse" />
              ))}
            </div>
          ) : recentImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 gap-3">
              <div className="w-14 h-14 bg-white/[0.04] rounded-2xl flex items-center justify-center">
                <ImageIcon className="w-7 h-7 text-gray-700" />
              </div>
              <p className="text-sm text-gray-600">No creations yet</p>
              <Link
                href="/create"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600/20 border border-indigo-500/30 rounded-xl
                           text-xs text-indigo-400 hover:bg-indigo-600/30 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" /> Generate your first image
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-px bg-white/[0.04]">
              {recentImages.map((img) => (
                <CreationTile key={img.id} img={img} />
              ))}
            </div>
          )}
        </div>

        {/* ── Usage + Tools grid ───────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Render Hours", used: renderHoursUsed, limit: 500,  unit: "hrs", color: "bg-indigo-500" },
            { label: "Storage",      used: storageUsed,    limit: 1000, unit: "GB",  color: "bg-pink-500"   },
          ].map((m) => (
            <div key={m.label} className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-gray-400">{m.label}</span>
                <span className="text-gray-300">{m.used} / {m.limit} {m.unit}</span>
              </div>
              <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                <div className={`h-full ${m.color} rounded-full`} style={{ width: `${Math.round((m.used / m.limit) * 100)}%` }} />
              </div>
              <p className="text-xs text-gray-600 mt-1">{Math.round((m.used / m.limit) * 100)}% used · resets in 8 days</p>
            </div>
          ))}
        </div>

        {/* ── Quick tools + Active renders ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 glass rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/8">
              <h2 className="text-sm font-semibold text-white">Quick Access</h2>
            </div>
            <div className="divide-y divide-white/5">
              {[
                { title: "Create",            sub: "Image · Video · Music generation",          href: "/create",           icon: Sparkles, gradient: "from-indigo-500/30 to-violet-500/30",  badge: "New",    badgeClass: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" },
                { title: "Soundtrack Forge",  sub: "Generate music with SynthSound",            href: "/soundtrack-forge", icon: Music2,   gradient: "from-cyan-500/20 to-teal-500/20",      badge: "AI",     badgeClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" },
                { title: "Episode Pipeline",  sub: "Write scripts with Synthos LLM",            href: "/episode-pipeline", icon: Film,     gradient: "from-violet-500/20 to-purple-500/20",  badge: "AI",     badgeClass: "bg-violet-500/20 text-violet-300 border-violet-500/30" },
                { title: "Character DNA Vault",sub: "Build consistent AI characters",           href: "/character-dna-vault", icon: Users,  gradient: "from-pink-500/20 to-rose-500/20",     badge: "AI",     badgeClass: "bg-pink-500/20 text-pink-300 border-pink-500/30" },
              ].map((p) => (
                <Link
                  key={p.title}
                  href={p.href}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.03] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 bg-gradient-to-br ${p.gradient} rounded-xl flex items-center justify-center`}>
                      <p.icon className="w-4 h-4 text-white/70" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white group-hover:text-indigo-200 transition-colors">{p.title}</p>
                      <p className="text-xs text-gray-600">{p.sub}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${p.badgeClass}`}>{p.badge}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-indigo-400 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {/* Active renders */}
            <div className="glass rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
                <h2 className="text-sm font-semibold text-white">Active Renders</h2>
                <Link href="/render-queue" className="text-xs text-indigo-400 hover:text-indigo-300">View all</Link>
              </div>
              <div className="divide-y divide-white/5">
                {MOCK_RENDER_JOBS.filter(r => r.status === "Rendering").map((r) => (
                  <div key={r.id} className="px-4 py-3">
                    <p className="text-xs font-medium text-white mb-1 truncate">{r.episode}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                      <span>{r.resolution} · {r.gpu}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.eta}</span>
                    </div>
                    <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full animate-pulse" style={{ width: `${r.progress}%` }} />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{r.progress}% complete</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="glass rounded-2xl p-4">
              <h2 className="text-sm font-semibold text-white mb-3">Quick Actions</h2>
              <div className="space-y-1.5">
                {[
                  { label: "New Project",      href: "/projects",        icon: FolderOpen },
                  { label: "Open Pipeline",    href: "/episode-pipeline", icon: Zap        },
                  { label: "Render Queue",     href: "/render-queue",     icon: Cpu        },
                ].map((a) => (
                  <Link
                    key={a.label}
                    href={a.href}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/5 transition-colors text-xs text-gray-400 hover:text-white group"
                  >
                    <a.icon className="w-4 h-4 group-hover:text-indigo-400 transition-colors" />
                    {a.label}
                    <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─── Creation tile ──────────────────────────────────────────────────────── */
function CreationTile({ img }: { img: GenImage }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative aspect-video bg-[#0c0c1a] overflow-hidden cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img.url}
        alt={img.prompt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      {/* Hover overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent
                       transition-opacity duration-200 ${hovered ? "opacity-100" : "opacity-0"}`}>
        <div className="absolute bottom-0 left-0 right-0 p-2.5">
          <p className="text-white text-[10px] line-clamp-2 leading-snug mb-2">{img.prompt}</p>
          <div className="flex gap-1.5">
            <a
              href={img.url}
              download={`synthos-${img.id}.png`}
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1 px-2 py-1 bg-black/60 rounded-md text-[10px] text-white hover:bg-black/80"
            >
              <Download className="w-2.5 h-2.5" /> Save
            </a>
            <a
              href={img.url}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1 px-2 py-1 bg-black/60 rounded-md text-[10px] text-white hover:bg-black/80"
            >
              <ExternalLink className="w-2.5 h-2.5" /> Open
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
