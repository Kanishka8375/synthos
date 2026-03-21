import DashboardHeader from "@/components/dashboard/header";
import { Key, Plus, Copy, Trash2, Eye, EyeOff, Shield, AlertTriangle } from "lucide-react";

const apiKeys = [
  { name: "Production API Key", key: "sk-synthos-prod-••••••••••••••••4f2a", created: "Jan 15, 2025", lastUsed: "2 min ago", requests: "48,291", status: "active", scopes: ["read", "write", "admin"] },
  { name: "Development Key", key: "sk-synthos-dev-••••••••••••••••9c1b", created: "Feb 3, 2025", lastUsed: "1 hour ago", requests: "12,043", status: "active", scopes: ["read", "write"] },
  { name: "Analytics Read-only", key: "sk-synthos-ro-••••••••••••••••2e8d", created: "Mar 10, 2025", lastUsed: "3 days ago", requests: "5,102", status: "active", scopes: ["read"] },
  { name: "Legacy Integration", key: "sk-synthos-leg-••••••••••••••••7a3f", created: "Oct 1, 2024", lastUsed: "30 days ago", requests: "891", status: "inactive", scopes: ["read"] },
];

const scopeColors: Record<string, string> = {
  read: "bg-cyan-500/20 text-cyan-400",
  write: "bg-violet-500/20 text-violet-400",
  admin: "bg-amber-500/20 text-amber-400",
};

export default function ApiKeysPage() {
  return (
    <div>
      <DashboardHeader title="API Keys" description="Manage authentication keys for the SYNTHOS API" />
      <div className="p-6 space-y-6">
        {/* Alert */}
        <div className="flex items-start gap-3 glass rounded-xl p-4 border border-amber-500/20 bg-amber-500/5">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-300">Keep your API keys secure</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Never share your secret API keys in public repositories or client-side code. Treat them like passwords.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total API Keys", value: "4" },
            { label: "Requests This Month", value: "66,327" },
            { label: "Rate Limit", value: "10K/min" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Keys Table */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <h2 className="font-semibold text-white">Your API Keys</h2>
            <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all">
              <Plus className="w-4 h-4" />
              New Key
            </button>
          </div>

          <div className="divide-y divide-white/5">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.name} className="px-6 py-5 hover:bg-white/5 transition-colors group">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      apiKey.status === "active" ? "bg-violet-500/20" : "bg-gray-500/20"
                    }`}>
                      <Key className={`w-5 h-5 ${apiKey.status === "active" ? "text-violet-400" : "text-gray-500"}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-white text-sm">{apiKey.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          apiKey.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"
                        }`}>
                          {apiKey.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <code className="text-xs text-gray-400 font-mono bg-white/5 px-2 py-1 rounded-lg">
                          {apiKey.key}
                        </code>
                        <button className="text-gray-500 hover:text-white transition-colors">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button className="text-gray-500 hover:text-white transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Created {apiKey.created}</span>
                        <span>Last used {apiKey.lastUsed}</span>
                        <span>{apiKey.requests} requests</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        {apiKey.scopes.map((scope) => (
                          <span key={scope} className={`text-xs px-2 py-0.5 rounded-full font-medium ${scopeColors[scope]}`}>
                            {scope}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="glass glass-hover p-2 rounded-lg text-gray-400 hover:text-white">
                      <EyeOff className="w-4 h-4" />
                    </button>
                    <button className="glass p-2 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Docs CTA */}
        <div className="glass rounded-2xl p-5 flex items-center gap-4">
          <Shield className="w-8 h-8 text-violet-400 shrink-0" />
          <div>
            <p className="font-medium text-white text-sm">API Documentation</p>
            <p className="text-xs text-gray-400 mt-0.5">Learn how to authenticate and use the SYNTHOS REST API and SDKs.</p>
          </div>
          <button className="ml-auto glass glass-hover text-gray-300 hover:text-white px-4 py-2 rounded-xl text-sm font-medium shrink-0">
            View Docs
          </button>
        </div>
      </div>
    </div>
  );
}
