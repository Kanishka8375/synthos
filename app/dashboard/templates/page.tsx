import DashboardHeader from "@/components/dashboard/header";
import { Layout, Plus, Search, Sparkles, Star, Download, Eye } from "lucide-react";

const categories = ["All", "Marketing", "Sales", "Operations", "Engineering", "HR"];

const templates = [
  { name: "AI Content Brief", category: "Marketing", uses: 1482, rating: 4.9, description: "OpenClaw-powered brief generator for campaigns and content strategy.", featured: true },
  { name: "Lead Qualification Flow", category: "Sales", uses: 934, rating: 4.8, description: "Automated lead scoring and qualification pipeline with AI routing.", featured: true },
  { name: "Sprint Planning Board", category: "Engineering", uses: 721, rating: 4.7, description: "Two-week sprint template with velocity tracking and AI estimates.", featured: false },
  { name: "Onboarding Checklist", category: "HR", uses: 610, rating: 4.8, description: "Complete new hire onboarding flow with automated task assignments.", featured: true },
  { name: "Quarterly Report", category: "Operations", uses: 589, rating: 4.6, description: "Auto-populated quarterly business review with OpenClaw insights.", featured: false },
  { name: "Cold Outreach Sequence", category: "Sales", uses: 472, rating: 4.5, description: "5-step personalized outreach sequence powered by AI copywriting.", featured: false },
  { name: "Social Media Calendar", category: "Marketing", uses: 398, rating: 4.6, description: "30-day content calendar with AI caption and hashtag generation.", featured: false },
  { name: "Bug Triage Workflow", category: "Engineering", uses: 311, rating: 4.7, description: "Automated bug prioritization and assignment with severity scoring.", featured: false },
  { name: "Employee Review Template", category: "HR", uses: 287, rating: 4.5, description: "360-degree performance review with AI summarization.", featured: false },
];

export default function TemplatesPage() {
  return (
    <div>
      <DashboardHeader title="Templates" description="Pre-built workflows and document templates" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 glass rounded-xl px-4 py-2.5 text-sm text-gray-400 w-64">
            <Search className="w-4 h-4" />
            <input type="text" placeholder="Search templates..." className="bg-transparent outline-none text-white placeholder-gray-500 flex-1" />
          </div>
          <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all">
            <Plus className="w-4 h-4" />
            Create Template
          </button>
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`text-sm px-3 py-1.5 rounded-xl transition-colors ${
                cat === "All" ? "bg-violet-600/20 text-violet-300 border border-violet-500/30" : "text-gray-400 hover:text-white glass glass-hover"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured */}
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            Featured by OpenClaw
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {templates.filter(t => t.featured).map((t) => (
              <div key={t.name} className="relative glass rounded-2xl p-5 border border-violet-500/20 group cursor-pointer">
                <div className="absolute top-3 right-3">
                  <span className="text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full">Featured</span>
                </div>
                <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Layout className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="font-semibold text-white mb-1">{t.name}</h3>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">{t.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    {t.rating}
                  </div>
                  <span>{t.uses.toLocaleString()} uses</span>
                </div>
                <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="flex-1 flex items-center justify-center gap-1.5 glass glass-hover rounded-lg py-2 text-xs text-gray-300 hover:text-white">
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 bg-violet-600 hover:bg-violet-500 rounded-lg py-2 text-xs text-white">
                    <Download className="w-3.5 h-3.5" /> Use
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Templates */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="font-semibold text-white">All Templates</h2>
          </div>
          <div className="divide-y divide-white/5">
            {templates.map((t) => (
              <div key={t.name} className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center">
                    <Layout className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-300">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.category} · {t.uses.toLocaleString()} uses</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    {t.rating}
                  </div>
                  <button className="flex items-center gap-1.5 bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all opacity-0 group-hover:opacity-100">
                    <Download className="w-3.5 h-3.5" /> Use
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
