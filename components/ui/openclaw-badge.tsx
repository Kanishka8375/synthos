import { SynthosLogo } from "@/components/ui/synthos-logo";
import clsx from "clsx";

interface SynthosBadgeProps {
  label?: string;
  size?: "sm" | "md";
  active?: boolean;
}

export function SynthosBadge({ label = "Synthos AI", size = "md", active = true }: SynthosBadgeProps) {
  return (
    <span className={clsx(
      "inline-flex items-center gap-1.5 rounded-full font-medium border",
      active
        ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
        : "bg-gray-500/10 text-gray-500 border-gray-500/20",
      size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1"
    )}>
      <SynthosLogo size={size === "sm" ? 12 : 14} />
      {label}
      {active && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />}
    </span>
  );
}

/** @deprecated use SynthosBadge */
export const OpenClawBadge = SynthosBadge;
