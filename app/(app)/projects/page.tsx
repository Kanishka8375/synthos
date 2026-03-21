"use client";
import { useState } from "react";
import { DashHeader } from "@/components/dashboard/header";
import { OpenClawBadge } from "@/components/ui/openclaw-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_PROJECTS } from "@/lib/mock-data";
import type { ProjectStatus } from "@/lib/types";
import { Film, Plus, Search, Grid3X3, List, MoreHorizontal } from "lucide-react";

const filters: Array<ProjectStatus | "All"> = ["All", "Draft", "In Progress", "Rendering", "Completed"];

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<ProjectStatus | "All">("All");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const filtered = MOCK_PROJECTS.filter((p) => {
    const matchFilter = activeFilter === "All" || p.status === activeFilter;
    const matchQuery  = p.title.toLowerCase().includes(query.toLowerCase()) || p.genre.toLowerCase().includes(query.toLowerCase());
    return matchFilter && matchQuery;
  });

  return (
    <div>
      <DashHeader
        title="Projects"
        description="Manage your production projects"
        actions={
          <button
            onClick={() => alert("New Project wizard — coming in v1.1")}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> New Project
          </button>
        }
      />
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
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
            {/* Status filters */}
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
          {/* View toggle */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-lg transition-colors ${view === "grid" ? "bg-indigo-600/20 text-indigo-400" : "glass glass-hover text-gray-500"}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-lg transition-colors ${view === "list" ? "bg-indigo-600/20 text-indigo-400" : "glass glass-hover text-gray-500"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {filtered.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-16">No projects match your filters.</p>
        )}

        <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-2"}>
          {filtered.map((p) => (
            <div key={p.id} className={`glass glass-hover rounded-2xl overflow-hidden group cursor-pointer ${view === "list" ? "flex items-center gap-4 p-4" : ""}`}>
              {view === "grid" ? (
                <>
                  {/* Thumbnail */}
                  <div className="h-36 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-pink-900/20 relative flex items-center justify-center">
                    <Film className="w-10 h-10 text-indigo-500/40" />
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      {p.openclawEnabled && <OpenClawBadge size="sm" label="AI" />}
                      <div className="relative">
                        <button
                          onClick={() => setMenuOpenId(menuOpenId === p.id ? null : p.id)}
                          className="glass p-1 rounded-lg text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                        {menuOpenId === p.id && (
                          <div className="absolute right-0 top-7 w-32 glass rounded-xl py-1 z-20 shadow-xl">
                            {["Open", "Duplicate", "Archive", "Delete"].map((action) => (
                              <button
                                key={action}
                                onClick={() => { alert(`${action}: ${p.title}`); setMenuOpenId(null); }}
                                className={`block w-full text-left px-3 py-1.5 text-xs hover:bg-white/5 transition-colors ${action === "Delete" ? "text-rose-400" : "text-gray-300"}`}
                              >
                                {action}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <StatusBadge status={p.status} />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white text-sm mb-1">{p.title}</h3>
                    <p className="text-xs text-gray-500 mb-3">{p.genre} · {p.style} · {p.episodeCount} episodes</p>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>Updated {p.updatedAt}</span>
                      <span>{p.episodeCount} eps</span>
                    </div>
                  </div>
                </>
              ) : (
                /* List view */
                <>
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/30 to-pink-500/30 rounded-xl flex items-center justify-center shrink-0">
                    <Film className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{p.title}</p>
                    <p className="text-xs text-gray-500">{p.genre} · {p.style} · {p.episodeCount} eps · Updated {p.updatedAt}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {p.openclawEnabled && <OpenClawBadge size="sm" label="AI" />}
                    <StatusBadge status={p.status} />
                  </div>
                </>
              )}
            </div>
          ))}

          {/* Add new card (grid only) */}
          {view === "grid" && (
            <button
              onClick={() => alert("New Project wizard — coming in v1.1")}
              className="glass rounded-2xl border-2 border-dashed border-white/10 hover:border-indigo-500/40 hover:bg-indigo-500/5 flex flex-col items-center justify-center gap-3 min-h-[200px] transition-all group"
            >
              <div className="w-10 h-10 glass rounded-xl flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                <Plus className="w-5 h-5 text-gray-600 group-hover:text-indigo-400 transition-colors" />
              </div>
              <p className="text-xs text-gray-600 group-hover:text-indigo-400 transition-colors font-medium">New Project</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
