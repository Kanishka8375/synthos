import { DashHeader } from "@/components/dashboard/header";
import { OpenClawBadge } from "@/components/ui/openclaw-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_PROJECTS } from "@/lib/mock-data";
import { Film, Plus, Search, Grid3X3, List, MoreHorizontal } from "lucide-react";

const filters = ["All", "Draft", "In Progress", "Rendering", "Completed"];

export default function ProjectsPage() {
  return (
    <div>
      <DashHeader title="Projects" description="Manage your production projects"
        actions={
          <button className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all">
            <Plus className="w-3.5 h-3.5" /> New Project
          </button>
        }
      />
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 glass rounded-xl px-3 py-2 text-xs text-gray-400 w-52">
              <Search className="w-3.5 h-3.5" />
              <input type="text" placeholder="Search projects..." className="bg-transparent outline-none text-white placeholder-gray-600 flex-1 text-xs" />
            </div>
            {filters.map((f) => (
              <button key={f} className={`text-xs px-3 py-1.5 rounded-xl transition-colors ${f === "All" ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30" : "text-gray-500 hover:text-white glass glass-hover"}`}>{f}</button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <button className="glass glass-hover p-2 rounded-lg text-indigo-400"><Grid3X3 className="w-4 h-4" /></button>
            <button className="glass glass-hover p-2 rounded-lg text-gray-500"><List className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {MOCK_PROJECTS.map((p) => (
            <div key={p.id} className="glass glass-hover rounded-2xl overflow-hidden group cursor-pointer">
              {/* Thumbnail */}
              <div className="h-36 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-pink-900/20 relative flex items-center justify-center">
                <Film className="w-10 h-10 text-indigo-500/40" />
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  {p.openclawEnabled && <OpenClawBadge size="sm" label="AI" />}
                  <button className="glass p-1 rounded-lg text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </button>
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
            </div>
          ))}

          {/* Add new */}
          <button className="glass rounded-2xl border-2 border-dashed border-white/10 hover:border-indigo-500/40 hover:bg-indigo-500/5 flex flex-col items-center justify-center gap-3 min-h-[200px] transition-all group">
            <div className="w-10 h-10 glass rounded-xl flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
              <Plus className="w-5 h-5 text-gray-600 group-hover:text-indigo-400 transition-colors" />
            </div>
            <p className="text-xs text-gray-600 group-hover:text-indigo-400 transition-colors font-medium">New Project</p>
          </button>
        </div>
      </div>
    </div>
  );
}
