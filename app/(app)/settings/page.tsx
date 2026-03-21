"use client";
import { useState } from "react";
import { DashHeader } from "@/components/dashboard/header";
import { OpenClawBadge } from "@/components/ui/openclaw-badge";
import { Bell, Key, Download, Trash2, User, Shield, ChevronRight, Eye, EyeOff } from "lucide-react";

export default function SettingsPage() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [notifications, setNotifications] = useState({
    renderComplete: true,
    agentAlerts: true,
    trendAlerts: false,
    weeklyDigest: true,
    billingAlerts: true,
  });

  const toggle = (key: keyof typeof notifications) =>
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div>
      <DashHeader title="Settings" description="Account and studio preferences" />
      <div className="p-5 space-y-5 max-w-2xl">
        {/* Profile */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">Profile</h2>
          </div>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
              JS
            </div>
            <div>
              <p className="font-semibold text-white">Jane Smith</p>
              <p className="text-xs text-gray-500">creator@studio.com</p>
              <p className="text-xs text-indigo-400 mt-1">Studio Plan</p>
            </div>
            <button className="ml-auto glass glass-hover text-xs text-gray-300 hover:text-white px-3 py-1.5 rounded-xl">Change avatar</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "First name", value: "Jane" },
              { label: "Last name", value: "Smith" },
              { label: "Email", value: "creator@studio.com" },
              { label: "Studio name", value: "Studio Kage" },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-xs text-gray-500 mb-1.5">{f.label}</label>
                <input defaultValue={f.value}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
              </div>
            ))}
          </div>
          <button className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all">
            Save profile
          </button>
        </div>

        {/* Subscription */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">Subscription</h2>
          </div>
          <div className="flex items-center justify-between p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
            <div>
              <p className="font-semibold text-white">Studio Plan</p>
              <p className="text-xs text-gray-400 mt-0.5">$99/month · Renews April 21, 2026</p>
            </div>
            <button className="glass glass-hover text-xs text-gray-300 hover:text-white px-3 py-1.5 rounded-xl flex items-center gap-1">
              Manage <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">Notifications</h2>
          </div>
          <div className="space-y-3">
            {[
              { key: "renderComplete" as const, label: "Render complete", desc: "Notify when a render job finishes" },
              { key: "agentAlerts" as const, label: "Agent alerts", desc: "OpenClaw agent errors or warnings" },
              { key: "trendAlerts" as const, label: "Trend alerts", desc: "High-relevance trends for your projects" },
              { key: "weeklyDigest" as const, label: "Weekly digest", desc: "Summary of production activity" },
              { key: "billingAlerts" as const, label: "Billing alerts", desc: "Usage limits and payment notifications" },
            ].map((n) => (
              <div key={n.key} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm text-white">{n.label}</p>
                  <p className="text-xs text-gray-500">{n.desc}</p>
                </div>
                <button
                  onClick={() => toggle(n.key)}
                  className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${notifications[n.key] ? "bg-indigo-600" : "bg-white/10"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${notifications[n.key] ? "left-5" : "left-0.5"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* API Key */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Key className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">API Key</h2>
            <OpenClawBadge label="Studio" size="sm" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-mono text-gray-400">
              {showApiKey ? "sk-syn-live-7f3k2p9xq1w8m4v6..." : "sk-syn-live-••••••••••••••••••••••••••"}
            </div>
            <button onClick={() => setShowApiKey(!showApiKey)} className="glass glass-hover p-2.5 rounded-xl text-gray-500 hover:text-white">
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button className="glass glass-hover px-3 py-2.5 rounded-xl text-xs text-gray-400 hover:text-white">Rotate</button>
          </div>
          <p className="text-xs text-gray-600 mt-2">Keep this key secret. Do not expose it in client-side code.</p>
        </div>

        {/* Data & Account */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Download className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">Data & Account</h2>
          </div>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between px-4 py-3 glass glass-hover rounded-xl text-sm text-gray-300 hover:text-white">
              <span>Export all data</span>
              <Download className="w-4 h-4" />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 glass glass-hover rounded-xl text-sm text-gray-300 hover:text-white">
              <span>Import project data</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all">
              <span>Delete account</span>
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
