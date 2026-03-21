import DashboardHeader from "@/components/dashboard/header";
import { FolderOpen, Plus, Search, Sparkles, MoreHorizontal, Users, Clock } from "lucide-react";

const projects = [
  { name: "Q1 Marketing Campaign", description: "Multi-channel campaign with AI-generated content", status: "active", members: 4, updated: "2h ago", progress: 68, color: "bg-violet-500" },
  { name: "Product Redesign 2025", description: "Full UX overhaul powered by OpenClaw insights", status: "active", members: 6, updated: "5h ago", progress: 42, color: "bg-cyan-500" },
  { name: "Customer Onboarding Flow", description: "Automated onboarding with AI personalization", status: "active", members: 3, updated: "1d ago", progress: 89, color: "bg-emerald-500" },
  { name: "Lead Scoring Model", description: "OpenClaw ML pipeline for sales qualification", status: "review", members: 2, updated: "2d ago", progress: 95, color: "bg-amber-500" },
  { name: "API Integration Suite", description: "Connect third-party services to SYNTHOS", status: "active", members: 5, updated: "3d ago", progress: 31, color: "bg-rose-500" },
  { name: "Annual Report Generation", description: "Automated report builder with AI narratives", status: "completed", members: 3, updated: "1w ago", progress: 100, color: "bg-blue-500" },
];

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-400",
  review: "bg-amber-500/20 text-amber-400",
  completed: "bg-gray-500/20 text-gray-400",
};

export default function ProjectsPage() {
  return (
    <div>
      <DashboardHeader title="Projects" description="Manage and track all your projects" />
      <div className="p-6 space-y-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 glass rounded-xl px-4 py-2.5 text-sm text-gray-400 w-64">
              <Search className="w-4 h-4" />
              <input
                type="text"
                placeholder="Search projects..."
                className="bg-transparent outline-none text-white placeholder-gray-500 flex-1"
              />
            </div>
            {["All", "Active", "Review", "Completed"].map((filter) => (
              <button
                key={filter}
                className={`text-sm px-3 py-2 rounded-xl transition-colors ${
                  filter === "All" ? "bg-violet-600/20 text-violet-300 border border-violet-500/30" : "text-gray-400 hover:text-white glass glass-hover"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all">
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>

        {/* OpenClaw Suggestion */}
        <div className="glass rounded-xl p-4 flex items-center gap-3 border border-violet-500/20">
          <Sparkles className="w-5 h-5 text-violet-400 shrink-0" />
          <p className="text-sm text-gray-300">
            <span className="text-violet-300 font-medium">OpenClaw suggests:</span>{" "}
            &ldquo;Lead Scoring Model is 95% complete — consider moving it to production this week.&rdquo;
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((project) => (
            <div key={project.name} className="glass glass-hover rounded-2xl p-5 group cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 ${project.color} rounded-xl flex items-center justify-center`}>
                  <FolderOpen className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[project.status]}`}>
                    {project.status}
                  </span>
                  <button className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-white mb-1">{project.name}</h3>
              <p className="text-sm text-gray-400 mb-4 leading-relaxed">{project.description}</p>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${project.color} rounded-full transition-all`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  {project.members} members
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {project.updated}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
