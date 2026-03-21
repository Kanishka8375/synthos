import { STATUS_COLORS } from "@/lib/constants";
import clsx from "clsx";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const color = STATUS_COLORS[status as keyof typeof STATUS_COLORS] ?? "bg-gray-500/20 text-gray-400";
  return (
    <span className={clsx("text-xs px-2.5 py-1 rounded-full font-medium", color, className)}>
      {status}
    </span>
  );
}
