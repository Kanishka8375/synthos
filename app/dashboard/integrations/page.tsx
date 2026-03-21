import DashboardHeader from "@/components/dashboard/header";
import { Puzzle, Check, ExternalLink, Sparkles, Search } from "lucide-react";

const integrations = [
  { name: "OpenClaw AI", category: "AI", description: "Core AI engine powering all SYNTHOS intelligence features.", connected: true, official: true, icon: "🤖" },
  { name: "Slack", category: "Communication", description: "Send notifications and receive SYNTHOS alerts in Slack channels.", connected: true, official: true, icon: "💬" },
  { name: "GitHub", category: "Developer", description: "Sync repositories, track commits, and automate code reviews.", connected: true, official: true, icon: "🐙" },
  { name: "Google Workspace", category: "Productivity", description: "Connect Docs, Sheets, Drive and Calendar to your workspace.", connected: false, official: true, icon: "📊" },
  { name: "Stripe", category: "Payments", description: "Sync subscription data and billing events to SYNTHOS analytics.", connected: false, official: true, icon: "💳" },
  { name: "Salesforce", category: "CRM", description: "Bi-directional sync of contacts, deals, and pipeline data.", connected: false, official: true, icon: "☁️" },
  { name: "HubSpot", category: "CRM", description: "Import leads, contacts and marketing data into SYNTHOS.", connected: false, official: false, icon: "🔶" },
  { name: "Zapier", category: "Automation", description: "Connect SYNTHOS to 5,000+ apps via Zapier triggers and actions.", connected: false, official: false, icon: "⚡" },
  { name: "Notion", category: "Productivity", description: "Sync pages, databases and tasks between Notion and SYNTHOS.", connected: false, official: false, icon: "📝" },
  { name: "Jira", category: "Developer", description: "Link SYNTHOS projects to Jira issues and track progress.", connected: false, official: false, icon: "🔷" },
  { name: "Linear", category: "Developer", description: "Sync Linear issues and cycles with SYNTHOS project boards.", connected: false, official: false, icon: "🔵" },
  { name: "Intercom", category: "Support", description: "Surface SYNTHOS insights in Intercom customer conversations.", connected: false, official: false, icon: "💡" },
];

const categories = ["All", "AI", "Communication", "Developer", "Productivity", "CRM", "Automation", "Payments", "Support"];

export default function IntegrationsPage() {
  const connected = integrations.filter(i => i.connected);

  return (
    <div>
      <DashboardHeader title="Integrations" description="Connect your tools to SYNTHOS" />
      <div className="p-6 space-y-6">
        {/* Connected */}
        {connected.length > 0 && (
          <div className="glass rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              Connected ({connected.length})
            </h2>
            <div className="flex flex-wrap gap-3">
              {connected.map((i) => (
                <div key={i.name} className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5">
                  <span className="text-lg">{i.icon}</span>
                  <span className="text-sm font-medium text-white">{i.name}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search & filter */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 glass rounded-xl px-4 py-2.5 text-sm text-gray-400 w-64">
            <Search className="w-4 h-4" />
            <input type="text" placeholder="Search integrations..." className="bg-transparent outline-none text-white placeholder-gray-500 flex-1" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {categories.slice(0, 6).map((cat) => (
              <button key={cat} className={`text-sm px-3 py-1.5 rounded-xl transition-colors ${cat === "All" ? "bg-violet-600/20 text-violet-300 border border-violet-500/30" : "text-gray-400 hover:text-white glass glass-hover"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* All Integrations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((integration) => (
            <div key={integration.name} className="glass glass-hover rounded-2xl p-5 group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl">
                    {integration.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white text-sm">{integration.name}</h3>
                      {integration.official && (
                        <span className="text-xs bg-violet-500/20 text-violet-400 px-1.5 py-0.5 rounded font-medium">Official</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{integration.category}</span>
                  </div>
                </div>
                {integration.connected && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1" />
                )}
              </div>

              <p className="text-xs text-gray-400 leading-relaxed mb-4">{integration.description}</p>

              <div className="flex items-center gap-2">
                {integration.connected ? (
                  <>
                    <button className="flex-1 text-center py-2 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Connected
                    </button>
                    <button className="glass glass-hover p-2 rounded-lg text-gray-400 hover:text-white">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <button className="flex-1 text-center py-2 rounded-lg text-xs font-medium glass glass-hover text-gray-300 hover:text-white transition-all">
                    Connect
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Custom Integration CTA */}
        <div className="glass rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center">
              <Puzzle className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <p className="font-semibold text-white">Build a custom integration</p>
              <p className="text-sm text-gray-400">Use the SYNTHOS API to connect any tool or service.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 glass glass-hover text-gray-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium">
              <Sparkles className="w-4 h-4 text-violet-400" />
              API Docs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
