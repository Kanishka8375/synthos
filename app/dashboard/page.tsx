import DashboardHeader from "@/components/dashboard/header";
import {
  Sparkles,
  TrendingUp,
  FolderOpen,
  Users,
  Zap,
  ArrowUpRight,
  ArrowRight,
  Activity,
} from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Active Projects", value: "12", change: "+3 this week", icon: FolderOpen, color: "text-violet-400", bg: "bg-violet-500/10" },
  { label: "Team Members", value: "8", change: "+1 this month", icon: Users, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { label: "AI Requests", value: "4,821", change: "+12% vs last week", icon: Sparkles, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "Automations Run", value: "1,247", change: "+28% vs last week", icon: Zap, color: "text-amber-400", bg: "bg-amber-500/10" },
];

const recentActivity = [
  { action: "OpenClaw analyzed project brief", project: "Q1 Campaign", time: "2m ago", type: "ai" },
  { action: "New team member invited", project: "Acme Inc. workspace", time: "15m ago", type: "team" },
  { action: "Automation workflow triggered", project: "Lead Scoring", time: "1h ago", type: "automation" },
  { action: "Report generated", project: "Monthly Analytics", time: "3h ago", type: "report" },
  { action: "Template published", project: "Email Campaign v2", time: "5h ago", type: "template" },
];

const quickActions = [
  { label: "New Project", href: "/dashboard/projects", icon: FolderOpen },
  { label: "Run Analytics", href: "/dashboard/analytics", icon: TrendingUp },
  { label: "Invite Team", href: "/dashboard/team", icon: Users },
  { label: "View Reports", href: "/dashboard/reports", icon: Activity },
];

export default function DashboardPage() {
  return (
    <div>
      <DashboardHeader title="Overview" description="Welcome back, Jane" />

      <div className="p-6 space-y-8">
        {/* OpenClaw AI Banner */}
        <div className="relative glass rounded-2xl p-5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-violet-500/10 to-transparent pointer-events-none" />
          <div className="relative flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">OpenClaw AI is ready</p>
                <p className="text-xs text-gray-400">Ask anything about your workspace, projects, or data</p>
              </div>
            </div>
            <button className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Ask OpenClaw
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
              <div className="text-xs text-emerald-400 mt-1">{stat.change}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-white">Recent Activity</h2>
              <Link href="/dashboard/activity" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-4">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-violet-500 mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300">{item.action}</p>
                    <p className="text-xs text-gray-500">{item.project}</p>
                  </div>
                  <span className="text-xs text-gray-600 shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-5">Quick Actions</h2>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <action.icon className="w-5 h-5 text-gray-400 group-hover:text-violet-400 transition-colors" />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{action.label}</span>
                  <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-violet-400 ml-auto transition-all group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
