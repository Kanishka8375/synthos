import { ReactNode } from "react";
import clsx from "clsx";

export function GradientText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={clsx("bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent", className)}>
      {children}
    </span>
  );
}
