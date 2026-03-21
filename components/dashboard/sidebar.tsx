"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap,
  LayoutDashboard,
  FolderOpen,
  BarChart3,
  FileText,
  Layout,
  Users,
  Puzzle,
  Key,
  CreditCard,
  Bell,
  Activity,
  PieChart,
  Settings,
  HelpCircle,
  User,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projects", icon: FolderOpen },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/documents", label: "Documents", icon: FileText },
  { href: "/dashboard/templates", label: "Templates", icon: Layout },
  { href: "/dashboard/reports", label: "Reports", icon: PieChart },
  { href: "/dashboard/activity", label: "Activity", icon: Activity },
];

const bottomItems = [
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/integrations", label: "Integrations", icon: Puzzle },
  { href: "/dashboard/api-keys", label: "API Keys", icon: Key },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/support", label: "Support", icon: HelpCircle },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        "flex flex-col h-screen bg-[#0d0d1a] border-r border-white/10 transition-all duration-300 sticky top-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={clsx("flex items-center h-16 px-4 border-b border-white/10", collapsed ? "justify-center" : "gap-3")}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && <span className="text-lg font-bold gradient-text">SYNTHOS</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5",
                collapsed && "justify-center"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && item.label}
            </Link>
          );
        })}

        <div className="pt-4 pb-2">
          {!collapsed && <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3 mb-2">Manage</p>}
          {bottomItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  active
                    ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5",
                  collapsed && "justify-center"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-white/10 space-y-1">
        <Link
          href="/login"
          className={clsx(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all",
            collapsed && "justify-center"
          )}
          title={collapsed ? "Sign out" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && "Sign out"}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={clsx(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-white/5 transition-all w-full",
            collapsed && "justify-center"
          )}
        >
          <ChevronLeft className={clsx("w-5 h-5 shrink-0 transition-transform", collapsed && "rotate-180")} />
          {!collapsed && "Collapse"}
        </button>
      </div>
    </aside>
  );
}
