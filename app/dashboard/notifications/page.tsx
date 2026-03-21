import DashboardHeader from "@/components/dashboard/header";
import { Bell, Sparkles, Users, Zap, AlertCircle, Check, Settings } from "lucide-react";

const notifications = [
  { id: 1, type: "ai", icon: Sparkles, title: "OpenClaw completed analysis", body: "Your Q1 Campaign Brief has been analyzed. 3 key insights found.", time: "2 min ago", read: false, color: "text-violet-400 bg-violet-500/10" },
  { id: 2, type: "team", icon: Users, title: "Sarah Chen joined your workspace", body: "Sarah accepted the invitation and has been added to 2 projects.", time: "15 min ago", read: false, color: "text-cyan-400 bg-cyan-500/10" },
  { id: 3, type: "automation", icon: Zap, title: "Lead Scoring automation triggered", body: "42 new leads have been scored and routed to your sales team.", time: "1 hour ago", read: false, color: "text-amber-400 bg-amber-500/10" },
  { id: 4, type: "alert", icon: AlertCircle, title: "OpenClaw usage at 97%", body: "You've used 48,291 of 50,000 monthly AI requests. Consider upgrading.", time: "3 hours ago", read: false, color: "text-rose-400 bg-rose-500/10" },
  { id: 5, type: "ai", icon: Sparkles, title: "Weekly report generated", body: "Your automated weekly analytics report is ready to view.", time: "1 day ago", read: true, color: "text-violet-400 bg-violet-500/10" },
  { id: 6, type: "team", icon: Users, title: "Mark Thompson updated permissions", body: "Mark changed Taylor Brooks' role from Viewer to Member.", time: "2 days ago", read: true, color: "text-cyan-400 bg-cyan-500/10" },
  { id: 7, type: "automation", icon: Zap, title: "Social Media Calendar published", body: "30-day content calendar has been published and scheduled.", time: "3 days ago", read: true, color: "text-amber-400 bg-amber-500/10" },
  { id: 8, type: "ai", icon: Sparkles, title: "Document summary ready", body: "OpenClaw summarized 'Product Strategy 2025' — 4 key decisions highlighted.", time: "4 days ago", read: true, color: "text-violet-400 bg-violet-500/10" },
];

const preferences = [
  { label: "OpenClaw AI updates", desc: "When AI completes tasks or has suggestions", enabled: true },
  { label: "Team activity", desc: "When members join, leave, or change roles", enabled: true },
  { label: "Automation runs", desc: "When workflows trigger or complete", enabled: true },
  { label: "Usage alerts", desc: "When nearing plan limits", enabled: true },
  { label: "Product updates", desc: "New features and announcements", enabled: false },
  { label: "Weekly digest", desc: "Summary email every Monday morning", enabled: true },
];

export default function NotificationsPage() {
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div>
      <DashboardHeader title="Notifications" description={`${unread} unread notifications`} />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notifications Feed */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-white">All Notifications</h2>
              <button className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors">
                <Check className="w-3.5 h-3.5" />
                Mark all as read
              </button>
            </div>

            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`glass rounded-2xl p-4 flex items-start gap-4 transition-all ${!notif.read ? "border border-violet-500/20 bg-violet-500/5" : ""}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${notif.color}`}>
                  <notif.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${notif.read ? "text-gray-300" : "text-white"}`}>{notif.title}</p>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-gray-500">{notif.time}</span>
                      {!notif.read && <span className="w-2 h-2 rounded-full bg-violet-500 shrink-0" />}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{notif.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Preferences */}
          <div className="glass rounded-2xl p-6 h-fit">
            <div className="flex items-center gap-2 mb-5">
              <Settings className="w-5 h-5 text-gray-400" />
              <h2 className="font-semibold text-white">Preferences</h2>
            </div>
            <div className="space-y-4">
              {preferences.map((pref) => (
                <div key={pref.label} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-gray-300">{pref.label}</p>
                    <p className="text-xs text-gray-500">{pref.desc}</p>
                  </div>
                  <button
                    className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${pref.enabled ? "bg-violet-600" : "bg-white/10"}`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${pref.enabled ? "left-6" : "left-1"}`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-white/10">
              <p className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">Channels</p>
              <div className="space-y-2">
                {[
                  { channel: "In-app", active: true },
                  { channel: "Email", active: true },
                  { channel: "Slack", active: true },
                ].map((c) => (
                  <div key={c.channel} className="flex items-center justify-between">
                    <span className="text-sm text-gray-300 flex items-center gap-2">
                      <Bell className="w-3.5 h-3.5 text-gray-500" />
                      {c.channel}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${c.active ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-500"}`}>
                      {c.active ? "On" : "Off"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
