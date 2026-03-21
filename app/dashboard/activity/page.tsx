import DashboardHeader from "@/components/dashboard/header";
import { Activity, Sparkles, Users, Zap, FileText, Settings, FolderOpen, Filter } from "lucide-react";

const activityLog = [
  { user: "Jane S.", avatar: "JS", action: "ran OpenClaw analysis on", target: "Q1 Campaign Brief", type: "ai", time: "2 min ago", date: "Today" },
  { user: "OpenClaw", avatar: "OC", action: "generated insights for", target: "Product Strategy 2025", type: "ai", time: "18 min ago", date: "Today" },
  { user: "Sarah C.", avatar: "SC", action: "joined the workspace", target: "", type: "team", time: "1 hour ago", date: "Today" },
  { user: "Mark T.", avatar: "MT", action: "triggered automation", target: "Lead Scoring Workflow", type: "automation", time: "2 hours ago", date: "Today" },
  { user: "Jane S.", avatar: "JS", action: "created project", target: "Product Redesign 2025", type: "project", time: "4 hours ago", date: "Today" },
  { user: "Alex R.", avatar: "AR", action: "updated document", target: "API Documentation v3", type: "document", time: "6 hours ago", date: "Today" },
  { user: "Jane S.", avatar: "JS", action: "invited", target: "casey@company.com", type: "team", time: "1 day ago", date: "Yesterday" },
  { user: "Jordan L.", avatar: "JL", action: "published template", target: "Social Media Calendar", type: "document", time: "1 day ago", date: "Yesterday" },
  { user: "Mark T.", avatar: "MT", action: "updated settings for", target: "Lead Scoring Automation", type: "automation", time: "1 day ago", date: "Yesterday" },
  { user: "OpenClaw", avatar: "OC", action: "completed weekly report for", target: "Analytics Dashboard", type: "ai", time: "2 days ago", date: "Mar 19" },
  { user: "Sarah C.", avatar: "SC", action: "completed project", target: "Customer Onboarding Flow", type: "project", time: "3 days ago", date: "Mar 18" },
  { user: "Taylor B.", avatar: "TB", action: "changed role in", target: "workspace", type: "team", time: "4 days ago", date: "Mar 17" },
];

const typeConfig: Record<string, { icon: React.ComponentType<{ className?: string }>, color: string }> = {
  ai: { icon: Sparkles, color: "text-violet-400 bg-violet-500/10" },
  team: { icon: Users, color: "text-cyan-400 bg-cyan-500/10" },
  automation: { icon: Zap, color: "text-amber-400 bg-amber-500/10" },
  document: { icon: FileText, color: "text-emerald-400 bg-emerald-500/10" },
  project: { icon: FolderOpen, color: "text-blue-400 bg-blue-500/10" },
  settings: { icon: Settings, color: "text-gray-400 bg-gray-500/10" },
};

const avatarColors = ["from-violet-500 to-cyan-500", "from-cyan-500 to-blue-500", "from-emerald-500 to-teal-500", "from-amber-500 to-orange-500"];

export default function ActivityPage() {
  const grouped = activityLog.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {} as Record<string, typeof activityLog>);

  return (
    <div>
      <DashboardHeader title="Activity" description="Full audit log of workspace activity" />
      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <button className="flex items-center gap-2 glass glass-hover rounded-xl px-4 py-2.5 text-sm text-gray-400 hover:text-white">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          {["All", "AI", "Team", "Automation", "Documents", "Projects"].map((f) => (
            <button
              key={f}
              className={`text-sm px-3 py-1.5 rounded-xl transition-colors ${f === "All" ? "bg-violet-600/20 text-violet-300 border border-violet-500/30" : "text-gray-400 hover:text-white glass glass-hover"}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Activity Feed */}
        <div className="space-y-8">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5" />
                {date}
              </h3>
              <div className="glass rounded-2xl divide-y divide-white/5 overflow-hidden">
                {items.map((item, i) => {
                  const conf = typeConfig[item.type] || typeConfig.settings;
                  const colorIdx = item.user.charCodeAt(0) % avatarColors.length;
                  return (
                    <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarColors[colorIdx]} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                        {item.avatar}
                      </div>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${conf.color}`}>
                        <conf.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-300">
                          <span className="font-medium text-white">{item.user}</span>
                          {" "}{item.action}{" "}
                          {item.target && <span className="text-violet-300 font-medium">{item.target}</span>}
                        </p>
                      </div>
                      <span className="text-xs text-gray-600 shrink-0">{item.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
