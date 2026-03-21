import DashboardHeader from "@/components/dashboard/header";
import { PieChart, Plus, Download, Sparkles, Calendar, BarChart3, TrendingUp, Clock } from "lucide-react";

const reports = [
  { name: "Monthly Performance Report", description: "AI-generated summary of KPIs, usage, and team activity.", type: "Automated", schedule: "Monthly", lastRun: "Mar 1, 2025", status: "ready" },
  { name: "Q1 Campaign Analytics", description: "Deep dive into campaign performance across all channels.", type: "Manual", schedule: "—", lastRun: "Mar 10, 2025", status: "ready" },
  { name: "OpenClaw Usage Report", description: "AI request volume, top use cases, and efficiency metrics.", type: "Automated", schedule: "Weekly", lastRun: "Mar 17, 2025", status: "ready" },
  { name: "Team Productivity Summary", description: "Activity, project completion rates, and velocity trends.", type: "Automated", schedule: "Weekly", lastRun: "Mar 17, 2025", status: "ready" },
  { name: "Lead Conversion Analysis", description: "End-to-end lead funnel with AI scoring breakdown.", type: "Manual", schedule: "—", lastRun: "Mar 5, 2025", status: "ready" },
  { name: "Infrastructure Cost Report", description: "API and compute cost analysis with optimization tips.", type: "Automated", schedule: "Monthly", lastRun: "Mar 1, 2025", status: "generating" },
];

const highlights = [
  { label: "Revenue Growth", value: "+18.2%", sub: "vs last month", icon: TrendingUp, color: "text-emerald-400" },
  { label: "AI Efficiency", value: "94.7%", sub: "task completion rate", icon: Sparkles, color: "text-violet-400" },
  { label: "Team Velocity", value: "+23%", sub: "vs last quarter", icon: BarChart3, color: "text-cyan-400" },
  { label: "Churn Reduced", value: "-0.3%", sub: "month over month", icon: PieChart, color: "text-amber-400" },
];

export default function ReportsPage() {
  return (
    <div>
      <DashboardHeader title="Reports" description="Analytics reports powered by OpenClaw" />
      <div className="p-6 space-y-6">
        {/* Highlights */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.map((h) => (
            <div key={h.label} className="glass rounded-2xl p-5">
              <h.icon className={`w-5 h-5 mb-3 ${h.color}`} />
              <div className={`text-2xl font-bold ${h.color}`}>{h.value}</div>
              <div className="text-sm text-white mt-1">{h.label}</div>
              <div className="text-xs text-gray-500">{h.sub}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 glass glass-hover text-gray-300 hover:text-white px-4 py-2.5 rounded-xl text-sm">
              <Calendar className="w-4 h-4" />
              Date range
            </button>
            {["All", "Automated", "Manual"].map((f) => (
              <button key={f} className={`text-sm px-3 py-2 rounded-xl transition-colors ${f === "All" ? "bg-violet-600/20 text-violet-300 border border-violet-500/30" : "text-gray-400 hover:text-white glass glass-hover"}`}>
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 glass glass-hover text-gray-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium">
              <Sparkles className="w-4 h-4 text-violet-400" />
              Generate with AI
            </button>
            <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all">
              <Plus className="w-4 h-4" />
              New Report
            </button>
          </div>
        </div>

        {/* Reports List */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="font-semibold text-white">All Reports</h2>
          </div>
          <div className="divide-y divide-white/5">
            {reports.map((report) => (
              <div key={report.name} className="flex items-center justify-between px-6 py-5 hover:bg-white/5 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    report.status === "generating" ? "bg-amber-500/10" : "bg-violet-500/10"
                  }`}>
                    {report.status === "generating" ? (
                      <Clock className="w-5 h-5 text-amber-400 animate-spin" />
                    ) : (
                      <PieChart className="w-5 h-5 text-violet-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white text-sm">{report.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        report.type === "Automated" ? "bg-violet-500/20 text-violet-400" : "bg-gray-500/20 text-gray-400"
                      }`}>
                        {report.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{report.description}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {report.schedule !== "—" ? report.schedule : "On demand"}</span>
                      <span>Last run: {report.lastRun}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  {report.status === "ready" ? (
                    <>
                      <button className="glass glass-hover text-gray-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium">
                        View
                      </button>
                      <button className="glass glass-hover text-gray-300 hover:text-white p-1.5 rounded-lg">
                        <Download className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg">Generating...</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
