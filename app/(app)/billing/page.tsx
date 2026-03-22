"use client";
import { useState } from "react";
import Link from "next/link";
import { DashHeader } from "@/components/dashboard/header";
import { OpenClawBadge } from "@/components/ui/openclaw-badge";
import { PRICING_TIERS } from "@/lib/constants";
import { OPENCLAW_AGENTS_DATA } from "@/lib/openclaw";
import { Check, Zap, Receipt, CreditCard, CheckCircle2 } from "lucide-react";

const invoices = [
  { date: "Mar 1, 2026",  amount: "$99.00", status: "Paid", id: "INV-2026-03" },
  { date: "Feb 1, 2026",  amount: "$99.00", status: "Paid", id: "INV-2026-02" },
  { date: "Jan 1, 2026",  amount: "$99.00", status: "Paid", id: "INV-2026-01" },
  { date: "Dec 1, 2025",  amount: "$99.00", status: "Paid", id: "INV-2025-12" },
];

const usageMeters = [
  { label: "Render Hours", used: 87,    limit: 500,    unit: "hrs", color: "bg-indigo-500" },
  { label: "Storage",      used: 42,    limit: 1000,   unit: "GB",  color: "bg-pink-500" },
  { label: "Projects",     used: 6,     limit: 999,    unit: "",    color: "bg-violet-500" },
  { label: "API Calls",    used: 14200, limit: 100000, unit: "",    color: "bg-cyan-500" },
];

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  setTimeout(onDone, 2500);
  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium">
      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
      {message}
    </div>
  );
}

export default function BillingPage() {
  const [annual, setAnnual]   = useState(false);
  const [toast, setToast]     = useState("");
  const [cancelled, setCancelled] = useState(false);
  const notify = (msg: string) => setToast(msg);

  const handleDownload = (inv: typeof invoices[0]) => {
    const content = `Invoice: ${inv.id}\nDate: ${inv.date}\nAmount: ${inv.amount}\nStatus: ${inv.status}\nPlan: Studio`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${inv.id}.txt`; a.click();
    URL.revokeObjectURL(url);
    notify(`Downloaded ${inv.id}`);
  };

  const handleCancel = () => {
    const ok = window.confirm("Cancel your Studio plan? You'll keep access until April 21, 2026.");
    if (ok) { setCancelled(true); notify("Subscription cancelled. Access continues until April 21, 2026."); }
  };

  const handleChangePlan = (planName: string) => {
    if (planName === "Studio") return;
    notify(`Switching to ${planName} plan — payment flow coming in v1.1`);
  };

  return (
    <div>
      <DashHeader title="Billing" description="Subscription, usage, and invoices" />
      <div className="p-5 space-y-5">

        {/* Current plan */}
        <div className="glass rounded-2xl p-5 border border-indigo-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-transparent pointer-events-none" />
          <div className="relative flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-semibold text-white">Current Plan</h2>
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                Studio <span className="text-indigo-400">$99</span>
                <span className="text-gray-500 text-sm font-normal">/mo</span>
              </p>
              <p className="text-xs text-gray-400">
                {cancelled ? "Cancelled — access until April 21, 2026" : "Next billing: April 21, 2026 · Auto-renews"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <OpenClawBadge label="All 9 agents" />
              {!cancelled && (
                <>
                  <button
                    onClick={() => notify("Plan change flow — coming in v1.1")}
                    className="glass glass-hover text-xs text-gray-300 hover:text-white px-3 py-1.5 rounded-xl"
                  >
                    Change plan
                  </button>
                  <button
                    onClick={handleCancel}
                    className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1.5 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Usage meters */}
        <div className="glass rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Usage This Month</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {usageMeters.map((m) => {
              const pct = Math.round((m.used / m.limit) * 100);
              return (
                <div key={m.label}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-gray-400">{m.label}</span>
                    <span className="text-gray-300">
                      {m.used.toLocaleString()} / {m.limit.toLocaleString()}{m.unit ? ` ${m.unit}` : ""}
                    </span>
                  </div>
                  <div className="h-2 bg-white/8 rounded-full overflow-hidden mb-1">
                    <div className={`h-full ${m.color} rounded-full`} style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                  <p className="text-[10px] text-gray-600">{pct}% used</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* OpenClaw Agent Usage */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-semibold text-white">OpenClaw Agent Usage</h2>
            <OpenClawBadge size="sm" />
          </div>
          <div className="space-y-2.5">
            {(() => {
              const maxTasks = Math.max(...OPENCLAW_AGENTS_DATA.map(a => a.tasksCompleted));
              return OPENCLAW_AGENTS_DATA.map((agent) => (
                <div key={agent.id} className="flex items-center gap-3">
                  <p className="text-xs text-gray-400 w-36 shrink-0 truncate">{agent.name}</p>
                  <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${agent.active ? "bg-indigo-500" : "bg-gray-600"}`}
                      style={{ width: `${Math.round((agent.tasksCompleted / maxTasks) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-20 text-right">
                    {agent.tasksCompleted.toLocaleString()} tasks
                  </span>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Plan comparison */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <h2 className="text-sm font-semibold text-white">All Plans</h2>
            <div className="flex items-center gap-3">
              <span className={`text-xs ${!annual ? "text-white" : "text-gray-500"}`}>Monthly</span>
              <button
                onClick={() => setAnnual(!annual)}
                className={`relative w-10 h-5 rounded-full transition-colors ${annual ? "bg-indigo-600" : "bg-white/10"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${annual ? "left-5" : "left-0.5"}`} />
              </button>
              <span className={`text-xs ${annual ? "text-white" : "text-gray-500"}`}>
                Annual <span className="text-emerald-400">-20%</span>
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {PRICING_TIERS.map((tier) => {
              const isCurrent = tier.name === "Studio";
              return (
                <div key={tier.name} className={`rounded-xl p-4 ${isCurrent ? "bg-indigo-600/20 border-2 border-indigo-500/50" : "glass"}`}>
                  <p className="font-semibold text-white text-sm mb-1">{tier.name}</p>
                  <div className="flex items-baseline gap-1 mb-3">
                    {typeof tier.price === "number" ? (
                      <>
                        <span className="text-xl font-bold text-white">${annual ? Math.round(tier.price * 0.8) : tier.price}</span>
                        <span className="text-xs text-gray-500">/mo</span>
                      </>
                    ) : (
                      <span className="text-xl font-bold text-white">{tier.price}</span>
                    )}
                  </div>
                  <ul className="space-y-1.5 mb-4">
                    {tier.features.slice(0, 4).map((f) => (
                      <li key={f} className="flex items-start gap-1.5 text-xs text-gray-400">
                        <Check className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                  {isCurrent ? (
                    <span className="block text-center text-xs text-indigo-400 font-medium">Current plan</span>
                  ) : (
                    <button
                      onClick={() => handleChangePlan(tier.name)}
                      className="w-full glass glass-hover text-xs text-gray-400 hover:text-white py-2 rounded-lg transition-all"
                    >
                      {tier.cta}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Invoice history */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/8">
            <Receipt className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">Invoice History</h2>
          </div>
          <div className="divide-y divide-white/5">
            {invoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.03] transition-colors">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="text-sm text-white">{inv.id}</p>
                    <p className="text-xs text-gray-500">{inv.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-white">{inv.amount}</span>
                  <span className="text-xs bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full">{inv.status}</span>
                  <button
                    onClick={() => handleDownload(inv)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast("")} />}
    </div>
  );
}
