import DashboardHeader from "@/components/dashboard/header";
import { Settings, Globe, Shield, Bell, Palette, Zap, ChevronRight, Sparkles } from "lucide-react";

const sections = [
  {
    title: "Workspace",
    icon: Settings,
    settings: [
      { label: "Workspace name", value: "Acme Inc.", type: "text" },
      { label: "Workspace URL", value: "acme.synthos.app", type: "text" },
      { label: "Default timezone", value: "UTC-8 (Pacific)", type: "select" },
      { label: "Date format", value: "MM/DD/YYYY", type: "select" },
    ],
  },
  {
    title: "OpenClaw AI",
    icon: Sparkles,
    settings: [
      { label: "AI assistance level", value: "Proactive", type: "select" },
      { label: "Auto-generate summaries", value: "Enabled", type: "toggle", active: true },
      { label: "Smart suggestions", value: "Enabled", type: "toggle", active: true },
      { label: "AI data training", value: "Opt-out", type: "select" },
    ],
  },
  {
    title: "Appearance",
    icon: Palette,
    settings: [
      { label: "Theme", value: "Dark", type: "select" },
      { label: "Accent color", value: "Violet", type: "select" },
      { label: "Compact mode", value: "Disabled", type: "toggle", active: false },
      { label: "Animations", value: "Enabled", type: "toggle", active: true },
    ],
  },
  {
    title: "Security",
    icon: Shield,
    settings: [
      { label: "Two-factor authentication", value: "Enabled", type: "toggle", active: true },
      { label: "Session timeout", value: "7 days", type: "select" },
      { label: "SSO provider", value: "Google Workspace", type: "text" },
      { label: "Audit log retention", value: "90 days", type: "select" },
    ],
  },
  {
    title: "Notifications",
    icon: Bell,
    settings: [
      { label: "Email notifications", value: "Enabled", type: "toggle", active: true },
      { label: "Slack notifications", value: "Enabled", type: "toggle", active: true },
      { label: "Weekly digest", value: "Monday 9:00 AM", type: "select" },
      { label: "Marketing emails", value: "Disabled", type: "toggle", active: false },
    ],
  },
  {
    title: "Localization",
    icon: Globe,
    settings: [
      { label: "Language", value: "English (US)", type: "select" },
      { label: "Currency", value: "USD ($)", type: "select" },
      { label: "Number format", value: "1,234.56", type: "select" },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div>
      <DashboardHeader title="Settings" description="Manage your workspace preferences" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar nav */}
          <div className="glass rounded-2xl p-3 h-fit lg:sticky lg:top-24">
            {sections.map((section) => (
              <button
                key={section.title}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-white/5 text-gray-400 hover:text-white transition-all group"
              >
                <section.icon className="w-4 h-4 shrink-0" />
                <span className="text-sm font-medium flex-1">{section.title}</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>

          {/* Settings panels */}
          <div className="lg:col-span-2 space-y-6">
            {sections.map((section) => (
              <div key={section.title} className="glass rounded-2xl overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
                  <section.icon className="w-5 h-5 text-violet-400" />
                  <h2 className="font-semibold text-white">{section.title}</h2>
                </div>
                <div className="divide-y divide-white/5">
                  {section.settings.map((setting) => (
                    <div key={setting.label} className="flex items-center justify-between px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-300">{setting.label}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {setting.type === "toggle" ? (
                          <button
                            className={`relative w-11 h-6 rounded-full transition-colors ${setting.active ? "bg-violet-600" : "bg-white/10"}`}
                          >
                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${setting.active ? "left-6" : "left-1"}`} />
                          </button>
                        ) : (
                          <button className="glass glass-hover px-3 py-1.5 rounded-lg text-sm text-gray-300 hover:text-white flex items-center gap-2">
                            {setting.value}
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Danger Zone */}
            <div className="glass rounded-2xl overflow-hidden border border-rose-500/20">
              <div className="px-6 py-4 border-b border-rose-500/20">
                <h2 className="font-semibold text-rose-400">Danger Zone</h2>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300">Export workspace data</p>
                    <p className="text-xs text-gray-500">Download all your data in JSON format</p>
                  </div>
                  <button className="glass glass-hover text-gray-300 hover:text-white px-4 py-2 rounded-xl text-sm">
                    Export
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-rose-400">Delete workspace</p>
                    <p className="text-xs text-gray-500">Permanently delete this workspace and all its data</p>
                  </div>
                  <button className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-4 py-2 rounded-xl text-sm transition-all">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
