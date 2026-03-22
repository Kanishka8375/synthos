"use client";
import { useState, useRef } from "react";
import { DashHeader } from "@/components/dashboard/header";
import { OpenClawBadge } from "@/components/ui/openclaw-badge";
import { Bell, Key, Download, Trash2, User, Shield, ChevronRight, Eye, EyeOff, CheckCircle2 } from "lucide-react";

const INITIAL_API_KEY = "sk-syn-live-7f3k2p9xq1w8m4v6z3b1n0c8x5d4e7f";

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  // auto-dismiss
  setTimeout(onDone, 2500);
  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium animate-pulse-slow">
      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
      {message}
    </div>
  );
}

export default function SettingsPage() {
  const [showApiKey, setShowApiKey]       = useState(false);
  const [apiKey, setApiKey]               = useState(INITIAL_API_KEY);
  const [toast, setToast]                 = useState("");
  const [deleting, setDeleting]           = useState(false);
  const formRef                           = useRef<HTMLFormElement>(null);

  const [notifications, setNotifications] = useState({
    renderComplete: true,
    agentAlerts:    true,
    trendAlerts:    false,
    weeklyDigest:   true,
    billingAlerts:  true,
  });

  const notify = (msg: string) => setToast(msg);

  const toggleNotif = (key: keyof typeof notifications) =>
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));

  const handleSaveProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    notify("Profile saved successfully.");
  };

  const rotateApiKey = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const random = Array.from({ length: 24 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    setApiKey(`sk-syn-live-${random}`);
    setShowApiKey(true);
    notify("API key rotated. Save it now — it won't be shown again.");
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ exported: "SYNTHOS studio data", date: new Date().toISOString() }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "synthos-export.json"; a.click();
    URL.revokeObjectURL(url);
    notify("Data exported.");
  };

  const handleDeleteAccount = () => {
    const ok = window.confirm("Delete your account? This cannot be undone. Type OK to confirm.");
    if (ok) {
      setDeleting(true);
      notify("Account deletion scheduled. You will receive a confirmation email.");
    }
  };

  return (
    <div>
      <DashHeader title="Settings" description="Account and studio preferences" />
      <div className="p-5 space-y-5 max-w-2xl">

        {/* Profile */}
        <form ref={formRef} onSubmit={handleSaveProfile} className="glass rounded-2xl p-5">
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
            <button
              type="button"
              onClick={() => notify("Avatar upload — coming in v1.1")}
              className="ml-auto glass glass-hover text-xs text-gray-300 hover:text-white px-3 py-1.5 rounded-xl"
            >
              Change avatar
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "First name",   name: "firstName",   defaultValue: "Jane" },
              { label: "Last name",    name: "lastName",    defaultValue: "Smith" },
              { label: "Email",        name: "email",       defaultValue: "creator@studio.com" },
              { label: "Studio name",  name: "studioName",  defaultValue: "Studio Kage" },
            ].map((f) => (
              <div key={f.name}>
                <label htmlFor={f.name} className="block text-xs text-gray-500 mb-1.5">{f.label}</label>
                <input
                  id={f.name}
                  name={f.name}
                  type={f.name === "email" ? "email" : "text"}
                  defaultValue={f.defaultValue}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-[1.01]"
          >
            Save profile
          </button>
        </form>

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
            <a href="/billing" className="glass glass-hover text-xs text-gray-300 hover:text-white px-3 py-1.5 rounded-xl flex items-center gap-1">
              Manage <ChevronRight className="w-3 h-3" />
            </a>
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
              { key: "renderComplete" as const, label: "Render complete",  desc: "Notify when a render job finishes" },
              { key: "agentAlerts"    as const, label: "Agent alerts",     desc: "OpenClaw agent errors or warnings" },
              { key: "trendAlerts"    as const, label: "Trend alerts",     desc: "High-relevance trends for your projects" },
              { key: "weeklyDigest"   as const, label: "Weekly digest",    desc: "Summary of production activity" },
              { key: "billingAlerts"  as const, label: "Billing alerts",   desc: "Usage limits and payment notifications" },
            ].map((n) => (
              <div key={n.key} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm text-white">{n.label}</p>
                  <p className="text-xs text-gray-500">{n.desc}</p>
                </div>
                <button
                  onClick={() => { toggleNotif(n.key); notify(`${n.label} ${!notifications[n.key] ? "enabled" : "disabled"}.`); }}
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
            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-mono text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
              {showApiKey ? apiKey : apiKey.replace(/(?<=.{15}).+/g, "•".repeat(20))}
            </div>
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className="glass glass-hover p-2.5 rounded-xl text-gray-500 hover:text-white shrink-0"
              title={showApiKey ? "Hide" : "Show"}
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={rotateApiKey}
              className="glass glass-hover px-3 py-2.5 rounded-xl text-xs text-gray-400 hover:text-white shrink-0"
            >
              Rotate
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-2">Keep this key secret. Do not expose it in client-side code.</p>
        </div>

        {/* Data & Account */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Download className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">Data &amp; Account</h2>
          </div>
          <div className="space-y-2">
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-between px-4 py-3 glass glass-hover rounded-xl text-sm text-gray-300 hover:text-white"
            >
              <span>Export all data</span>
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => notify("Import — drag & drop your synthos-export.json")}
              className="w-full flex items-center justify-between px-4 py-3 glass glass-hover rounded-xl text-sm text-gray-300 hover:text-white"
            >
              <span>Import project data</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all disabled:opacity-50"
            >
              <span>{deleting ? "Deletion scheduled…" : "Delete account"}</span>
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast("")} />}
    </div>
  );
}
