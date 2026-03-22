"use client";
import { useState, useEffect, useCallback } from "react";
import { DashHeader } from "@/components/dashboard/header";
import { OpenClawBadge } from "@/components/ui/openclaw-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ProjectStatus } from "@/lib/types";
import { Film, Plus, Search, Grid3X3, List, MoreHorizontal, Loader2, Image as ImageIcon, X } from "lucide-react";

interface Project {
  id: string;
  title: string;
  genre: string;
  style: string;
  episode_count: number;
  status: ProjectStatus;
  openclaw_enabled: boolean;
  thumbnail_url?: string;
  updated_at: string;
}

const filters: Array<ProjectStatus | "All"> = ["All", "Draft", "In Progress", "Rendering", "Completed"];

const GENRES = ["Action", "Romance", "Isekai", "Thriller", "Sci-Fi", "Fantasy", "Horror", "Slice of Life"];
const STYLES = ["Anime", "Manga", "Cinematic", "Chibi", "Dark Fantasy", "Mecha"];

export default function ProjectsPage() {
  const [projects, setProjects]         = useState<Project[]>([]);
  const [loading, setLoading]           = useState(true);
  const [activeFilter, setActiveFilter] = useState<ProjectStatus | "All">("All");
  const [query, setQuery]               = useState("");
  const [view, setView]                 = useState<"grid" | "list">("grid");
  const [menuOpenId, setMenuOpenId]     = useState<string | null>(null);

  // New project modal
  const [showModal, setShowModal]       = useState(false);
  const [creating, setCreating]         = useState(false);
  const [newTitle, setNewTitle]         = useState("");
  const [newGenre, setNewGenre]         = useState("Action");
  const [newStyle, setNewStyle]         = useState("Anime");

  // Image generation
  const [generatingImageFor, setGeneratingImageFor] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProjects(data.projects ?? []);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const createProject = async () => {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim(), genre: newGenre, style: newStyle }),
      });
      if (!res.ok) throw new Error("Failed to create");
      const data = await res.json();
      setProjects(prev => [data.project, ...prev]);
      setShowModal(false);
      setNewTitle("");
    } catch {
      alert("Failed to create project. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const deleteProject = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setMenuOpenId(null);
    try {
      await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch {
      alert("Failed to delete project.");
    }
  };

  const generateThumbnail = async (project: Project) => {
    setGeneratingImageFor(project.id);
    try {
      const res = await fetch("/api/generate/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${project.title} - ${project.genre} ${project.style} scene, dramatic cinematic composition`,
          project_id: project.id,
          width: 768,
          height: 432,
        }),
      });
      const data = await res.json();
      if (data.url) {
        // Update in DB
        await fetch("/api/projects", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: project.id, thumbnail_url: data.url }),
        });
        setProjects(prev => prev.map(p => p.id === project.id ? { ...p, thumbnail_url: data.url } : p));
      }
    } catch {
      alert("Image generation failed. Please try again.");
    } finally {
      setGeneratingImageFor(null);
    }
  };

  const filtered = projects.filter((p) => {
    const matchFilter = activeFilter === "All" || p.status === activeFilter;
    const matchQuery  = p.title.toLowerCase().includes(query.toLowerCase()) ||
                        p.genre.toLowerCase().includes(query.toLowerCase());
    return matchFilter && matchQuery;
  });

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch { return "—"; }
  };

  return (
    <div>
      <DashHeader
        title="Projects"
        description="Manage your production projects"
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> New Project
          </button>
        }
      />

      {/* New Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-white">New Project</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Project title</label>
                <input
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Neon Ronin Season 2"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Genre</label>
                  <select value={newGenre} onChange={e => setNewGenre(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors">
                    {GENRES.map(g => <option key={g} value={g} className="bg-[#0a0a17]">{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Style</label>
                  <select value={newStyle} onChange={e => setNewStyle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors">
                    {STYLES.map(s => <option key={s} value={s} className="bg-[#0a0a17]">{s}</option>)}
                  </select>
                </div>
              </div>
              <button
                onClick={createProject}
                disabled={creating || !newTitle.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition-all"
              >
                {creating ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Creating…</span> : "Create Project"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 glass rounded-xl px-3 py-2 text-xs text-gray-400 w-52">
              <Search className="w-3.5 h-3.5 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects…"
                className="bg-transparent outline-none text-white placeholder-gray-600 flex-1 text-xs"
              />
            </div>
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`text-xs px-3 py-1.5 rounded-xl transition-colors ${
                  activeFilter === f
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                    : "text-gray-500 hover:text-white glass glass-hover border border-transparent"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setView("grid")}
              className={`p-2 rounded-lg transition-colors ${view === "grid" ? "bg-indigo-600/20 text-indigo-400" : "glass glass-hover text-gray-500"}`}>
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button onClick={() => setView("list")}
              className={`p-2 rounded-lg transition-colors ${view === "list" ? "bg-indigo-600/20 text-indigo-400" : "glass glass-hover text-gray-500"}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <Film className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-2">
              {projects.length === 0 ? "No projects yet." : "No projects match your filters."}
            </p>
            {projects.length === 0 && (
              <button onClick={() => setShowModal(true)}
                className="text-indigo-400 hover:text-indigo-300 text-xs font-medium">
                Create your first project →
              </button>
            )}
          </div>
        )}

        {!loading && (
          <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-2"}>
            {filtered.map((p) => (
              <div key={p.id} className={`glass glass-hover rounded-2xl overflow-hidden group cursor-pointer ${view === "list" ? "flex items-center gap-4 p-4" : ""}`}>
                {view === "grid" ? (
                  <>
                    {/* Thumbnail */}
                    <div className="h-36 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-pink-900/20 relative flex items-center justify-center overflow-hidden">
                      {p.thumbnail_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.thumbnail_url} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <Film className="w-10 h-10 text-indigo-500/40" />
                      )}
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        {p.openclaw_enabled && <OpenClawBadge size="sm" label="AI" />}
                        <div className="relative">
                          <button
                            onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === p.id ? null : p.id); }}
                            className="glass p-1 rounded-lg text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>
                          {menuOpenId === p.id && (
                            <div className="absolute right-0 top-7 w-36 glass rounded-xl py-1 z-20 shadow-xl">
                              <button
                                onClick={() => { generateThumbnail(p); setMenuOpenId(null); }}
                                className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-white/5 transition-colors"
                              >
                                <ImageIcon className="w-3 h-3" /> Generate Art
                              </button>
                              <button
                                onClick={() => deleteProject(p.id, p.title)}
                                className="block w-full text-left px-3 py-1.5 text-xs text-rose-400 hover:bg-white/5 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      {generatingImageFor === p.id && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="text-center">
                            <Loader2 className="w-6 h-6 text-indigo-400 animate-spin mx-auto mb-1" />
                            <p className="text-xs text-gray-300">Generating art…</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3">
                        <StatusBadge status={p.status} />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white text-sm mb-1">{p.title}</h3>
                      <p className="text-xs text-gray-500 mb-3">{p.genre} · {p.style} · {p.episode_count} episodes</p>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Updated {formatDate(p.updated_at)}</span>
                        <span>{p.episode_count} eps</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/30 to-pink-500/30 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                      {p.thumbnail_url
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={p.thumbnail_url} alt={p.title} className="w-full h-full object-cover" />
                        : <Film className="w-5 h-5 text-indigo-400" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{p.title}</p>
                      <p className="text-xs text-gray-500">{p.genre} · {p.style} · {p.episode_count} eps · Updated {formatDate(p.updated_at)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {p.openclaw_enabled && <OpenClawBadge size="sm" label="AI" />}
                      <StatusBadge status={p.status} />
                      <button
                        onClick={() => generateThumbnail(p)}
                        disabled={generatingImageFor === p.id}
                        className="text-gray-500 hover:text-indigo-400 transition-colors"
                        title="Generate thumbnail"
                      >
                        {generatingImageFor === p.id
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <ImageIcon className="w-4 h-4" />
                        }
                      </button>
                      <button onClick={() => deleteProject(p.id, p.title)}
                        className="text-gray-600 hover:text-rose-400 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}

            {view === "grid" && (
              <button
                onClick={() => setShowModal(true)}
                className="glass rounded-2xl border-2 border-dashed border-white/10 hover:border-indigo-500/40 hover:bg-indigo-500/5 flex flex-col items-center justify-center gap-3 min-h-[200px] transition-all group"
              >
                <div className="w-10 h-10 glass rounded-xl flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                  <Plus className="w-5 h-5 text-gray-600 group-hover:text-indigo-400 transition-colors" />
                </div>
                <p className="text-xs text-gray-600 group-hover:text-indigo-400 transition-colors font-medium">New Project</p>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
