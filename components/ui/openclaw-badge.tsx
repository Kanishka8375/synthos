import { Cpu } from "lucide-react";
import clsx from "clsx";

interface OpenClawBadgeProps {
  label?: string;
  size?: "sm" | "md";
  active?: boolean;
}

export function OpenClawBadge({ label = "OpenClaw", size = "md", active = true }: OpenClawBadgeProps) {
  return (
    <span className={clsx(
      "inline-flex items-center gap-1.5 rounded-full font-medium border",
      active
        ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
        : "bg-gray-500/10 text-gray-500 border-gray-500/20",
      size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1"
    )}>
      <Cpu className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      {label}
      {active && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />}
    </span>
  );
}
