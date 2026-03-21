import DashboardHeader from "@/components/dashboard/header";
import { CreditCard, Check, Zap, Download, ArrowUpRight, AlertCircle } from "lucide-react";

const invoices = [
  { date: "Mar 1, 2025", amount: "$29.00", status: "paid", id: "INV-2025-003" },
  { date: "Feb 1, 2025", amount: "$29.00", status: "paid", id: "INV-2025-002" },
  { date: "Jan 1, 2025", amount: "$29.00", status: "paid", id: "INV-2025-001" },
  { date: "Dec 1, 2024", amount: "$29.00", status: "paid", id: "INV-2024-012" },
  { date: "Nov 1, 2024", amount: "$0.00", status: "paid", id: "INV-2024-011" },
];

const usage = [
  { label: "OpenClaw AI Requests", used: 48291, limit: 50000, unit: "requests" },
  { label: "Team Members", used: 8, limit: 25, unit: "seats" },
  { label: "Projects", used: 12, limit: 999, unit: "projects" },
  { label: "Storage", used: 4.2, limit: 50, unit: "GB" },
];

export default function BillingPage() {
  return (
    <div>
      <DashboardHeader title="Billing" description="Manage your subscription and invoices" />
      <div className="p-6 space-y-6">
        {/* Current Plan */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass rounded-2xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs bg-violet-500/20 text-violet-300 px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5">
                    <Zap className="w-3 h-3" />
                    Pro Plan
                  </span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">Active</span>
                </div>
                <h2 className="text-2xl font-bold text-white mt-2">$29 <span className="text-sm font-normal text-gray-400">/ month</span></h2>
                <p className="text-sm text-gray-400 mt-1">Next billing date: <span className="text-white">April 1, 2025</span></p>
              </div>
              <button className="glass glass-hover text-gray-300 hover:text-white px-4 py-2 rounded-xl text-sm font-medium">
                Change Plan
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                "Unlimited projects",
                "50,000 OpenClaw AI requests/mo",
                "Advanced analytics",
                "Priority support",
                "25 team members",
                "API access",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  {feature}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/10">
              <button className="glass glass-hover text-gray-300 hover:text-white px-4 py-2 rounded-xl text-sm">
                Cancel subscription
              </button>
              <button className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all">
                Upgrade to Enterprise
              </button>
            </div>
          </div>

          {/* Payment Method */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-4">Payment Method</h2>
            <div className="glass rounded-xl p-4 flex items-center gap-3 mb-4">
              <CreditCard className="w-8 h-8 text-violet-400" />
              <div>
                <p className="text-sm font-medium text-white">Visa •••• 4242</p>
                <p className="text-xs text-gray-400">Expires 12/2026</p>
              </div>
            </div>
            <button className="w-full glass glass-hover text-gray-300 hover:text-white py-2.5 rounded-xl text-sm font-medium">
              Update payment method
            </button>

            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-300">AI requests at 97% — consider upgrading before your limit resets.</p>
            </div>
          </div>
        </div>

        {/* Usage */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-5">Current Usage</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {usage.map((item) => {
              const pct = Math.round((item.used / item.limit) * 100);
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-300">{item.label}</span>
                    <span className="text-gray-400">
                      {typeof item.used === "number" && item.used > 100 ? item.used.toLocaleString() : item.used}
                      {" / "}
                      {item.limit > 900 ? "∞" : item.limit.toLocaleString()} {item.unit}
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${pct >= 90 ? "bg-amber-500" : "bg-violet-500"}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{pct}% used</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Invoices */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <h2 className="font-semibold text-white">Invoice History</h2>
          </div>
          <div className="divide-y divide-white/5">
            {invoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm font-medium text-white">{inv.date}</p>
                    <p className="text-xs text-gray-500">{inv.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-white font-medium">{inv.amount}</span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full">{inv.status}</span>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
