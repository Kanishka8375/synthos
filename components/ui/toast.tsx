"use client";

import {
  createContext, useContext, useState, useCallback,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X, Loader2 } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────────────── */
type ToastType = "success" | "error" | "info" | "loading";

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastCtx {
  success: (msg: string) => void;
  error:   (msg: string) => void;
  info:    (msg: string) => void;
  loading: (msg: string) => string;   // returns id for dismiss
  dismiss: (id: string) => void;
}

/* ─── Context ────────────────────────────────────────────────────────────── */
const ToastContext = createContext<ToastCtx>({
  success: () => {},
  error:   () => {},
  info:    () => {},
  loading: () => "",
  dismiss: () => {},
});

/* ─── Provider ───────────────────────────────────────────────────────────── */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const add = useCallback((type: ToastType, message: string, ttl = 4000) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(p => [...p, { id, type, message }]);
    if (ttl > 0) setTimeout(() => dismiss(id), ttl);
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(p => p.filter(t => t.id !== id));
  }, []);

  const ctx: ToastCtx = {
    success: (m) => { add("success", m); },
    error:   (m) => { add("error",   m); },
    info:    (m) => { add("info",    m); },
    loading: (m) => add("loading", m, 0),
    dismiss,
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}

      {/* Toast portal */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none"
      >
        <AnimatePresence initial={false}>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0,  scale: 1    }}
              exit={{    opacity: 0, x: 60, scale: 0.95 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="pointer-events-auto flex items-center gap-3 px-4 py-3
                         bg-[#10101f] border border-white/[0.12] rounded-2xl shadow-2xl
                         shadow-black/60 backdrop-blur-xl max-w-xs w-[300px]"
            >
              <ToastIcon type={t.type} />
              <span className="text-sm text-gray-200 flex-1 leading-snug">{t.message}</span>
              <button
                onClick={() => dismiss(t.id)}
                className="text-gray-600 hover:text-white transition-colors ml-1 shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastIcon({ type }: { type: ToastType }) {
  if (type === "success") return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
  if (type === "error")   return <AlertCircle  className="w-4 h-4 text-rose-400   shrink-0" />;
  if (type === "loading") return <Loader2      className="w-4 h-4 text-indigo-400 shrink-0 animate-spin" />;
  return                         <Info         className="w-4 h-4 text-indigo-400 shrink-0" />;
}

/* ─── Hook ───────────────────────────────────────────────────────────────── */
export function useToast() {
  return useContext(ToastContext);
}
