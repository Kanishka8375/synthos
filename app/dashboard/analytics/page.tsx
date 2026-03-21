import DashboardHeader from "@/components/dashboard/header";
import { TrendingUp, TrendingDown, Users, Zap, Sparkles, BarChart3 } from "lucide-react";

const metrics = [
  { label: "Total Revenue", value: "$48,291", change: "+18.2%", up: true, icon: TrendingUp },
  { label: "Active Users", value: "3,847", change: "+7.4%", up: true, icon: Users },
  { label: "Churn Rate", value: "2.1%", change: "-0.3%", up: false, icon: TrendingDown },
  { label: "AI Operations", value: "94,210", change: "+31.7%", up: true, icon: Zap },
];

const weekData = [
  { day: "Mon", value: 65 },
  { day: "Tue", value: 78 },
  { day: "Wed", value: 90 },
  { day: "Thu", value: 81 },
  { day: "Fri", value: 95 },
  { day: "Sat", value: 70 },
  { day: "Sun", value: 58 },
];

const topPages = [
  { page: "/dashboard", visits: 12481, change: "+12%" },
  { page: "/dashboard/projects", visits: 8293, change: "+8%" },
  { page: "/dashboard/analytics", visits: 6102, change: "+22%" },
  { page: "/dashboard/documents", visits: 4871, change: "+5%" },
  { page: "/dashboard/settings", visits: 3210, change: "-2%" },
];

export default function AnalyticsPage() {
  const maxVal = Math.max(...weekData.map((d) => d.value));

  return (
    <div>
      <DashboardHeader title="Analytics" description="Insights powered by OpenClaw AI" />
      <div className="p-6 space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <m.icon className={`w-5 h-5 ${m.up ? "text-emerald-400" : "text-rose-400"}`} />
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m.up ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
                  {m.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-white">{m.value}</div>
              <div className="text-xs text-gray-500 mt-1">{m.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar chart */}
          <div className="lg:col-span-2 glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-semibold text-white">Weekly Activity</h2>
                <p className="text-xs text-gray-500 mt-0.5">AI operations & user activity</p>
              </div>
              <BarChart3 className="w-5 h-5 text-gray-500" />
            </div>
            <div className="flex items-end gap-3 h-40">
              {weekData.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                  <div
                    className="w-full bg-violet-600 rounded-t-lg hover:bg-violet-500 transition-colors cursor-pointer"
                    style={{ height: `${(d.value / maxVal) * 100}%` }}
                  />
                  <span className="text-xs text-gray-500">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-5 h-5 text-violet-400" />
              <h2 className="font-semibold text-white">OpenClaw Insights</h2>
            </div>
            <div className="space-y-4">
              {[
                { insight: "Friday has your highest engagement — consider scheduling campaigns for end of week.", type: "trend" },
                { insight: "Churn rate decreased 0.3% after launching onboarding automation last month.", type: "win" },
                { insight: "AI operations grew 31.7% — you may benefit from upgrading your OpenClaw plan.", type: "suggest" },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                  <p className="text-xs text-gray-300 leading-relaxed">{item.insight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Pages Table */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-5">Top Pages</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs border-b border-white/10">
                  <th className="text-left pb-3 font-medium">Page</th>
                  <th className="text-right pb-3 font-medium">Visits</th>
                  <th className="text-right pb-3 font-medium">Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {topPages.map((row) => (
                  <tr key={row.page} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 text-gray-300 font-mono text-xs">{row.page}</td>
                    <td className="py-3 text-right text-white">{row.visits.toLocaleString()}</td>
                    <td className={`py-3 text-right text-xs font-medium ${row.change.startsWith("+") ? "text-emerald-400" : "text-rose-400"}`}>
                      {row.change}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
