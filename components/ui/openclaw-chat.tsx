"use client";

import {
  createContext, useContext, useState, useRef, useEffect,
  useCallback, type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Send, Sparkles, User, RotateCcw, Loader2,
} from "lucide-react";
import { SynthosLogo } from "@/components/ui/synthos-logo";

/* ─── Context ────────────────────────────────────────────────────────────── */
interface ChatCtx { open: () => void; close: () => void; toggle: () => void; }
const ChatContext = createContext<ChatCtx>({ open: () => {}, close: () => {}, toggle: () => {} });

export function useChatPanel() { return useContext(ChatContext); }

/* ─── Message types ──────────────────────────────────────────────────────── */
interface Msg { role: "user" | "assistant"; content: string; streaming?: boolean; }

const WELCOME: Msg = {
  role: "assistant",
  content: "Hi! I'm **Synthos AI**, your AI production assistant.\n\nI can help with scriptwriting, character backstories, episode plotting, world-building, dialogue polish, and getting the most out of SYNTHOS. What are you creating today?",
};

/* ─── Provider ───────────────────────────────────────────────────────────── */
export function SynthosChatProvider({ children }: { children: ReactNode }) {
  const [isOpen,   setIsOpen]   = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input,    setInput]    = useState("");
  const [busy,     setBusy]     = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  const open   = useCallback(() => setIsOpen(true),  []);
  const close  = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(v => !v), []);

  /* ⌘K / Ctrl+K */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggle]);

  /* Auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* Focus input when opened */
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 150);
  }, [isOpen]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || busy) return;

    const userMsg: Msg = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setBusy(true);

    // Add empty streaming assistant message
    const assistantMsg: Msg = { role: "assistant", content: "", streaming: true };
    setMessages(prev => [...prev, assistantMsg]);

    try {
      const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok || !res.body) throw new Error("Chat API error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") break;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed?.choices?.[0]?.delta?.content ?? "";
            if (delta) {
              accumulated += delta;
              setMessages(prev => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: "assistant", content: accumulated, streaming: true };
                return copy;
              });
            }
          } catch { /* ignore parse errors */ }
        }
      }

      // Mark done
      setMessages(prev => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", content: accumulated, streaming: false };
        return copy;
      });
    } catch {
      setMessages(prev => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "Sorry, I ran into an error. Please try again.",
          streaming: false,
        };
        return copy;
      });
    } finally {
      setBusy(false);
    }
  }, [input, busy, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const reset = () => { setMessages([WELCOME]); setInput(""); };

  return (
    <ChatContext.Provider value={{ open, close, toggle }}>
      {children}

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40"
            onClick={close}
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="panel"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0,      opacity: 1 }}
            exit={{    x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 bottom-0 w-[420px] max-w-full z-50
                       flex flex-col bg-[#0a0a17] border-l border-white/[0.08]
                       shadow-2xl shadow-black/60"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl overflow-hidden shadow-lg shadow-indigo-500/30">
                  <SynthosLogo size={32} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Synthos AI</p>
                  <p className="text-[11px] text-indigo-400">AI Production Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={reset}
                  title="New chat"
                  className="p-1.5 text-gray-600 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={close}
                  className="p-1.5 text-gray-600 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((msg, i) => (
                <ChatBubble key={i} msg={msg} />
              ))}
              {busy && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500/30 to-violet-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                  </div>
                  <div className="flex gap-1 items-center pt-2">
                    {[0, 1, 2].map(j => (
                      <motion.div
                        key={j}
                        className="w-1.5 h-1.5 bg-indigo-400/60 rounded-full"
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ duration: 0.7, repeat: Infinity, delay: j * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Prompt chips */}
            {messages.length <= 1 && (
              <div className="px-4 pb-3 flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map(p => (
                  <button
                    key={p}
                    onClick={() => { setInput(p); inputRef.current?.focus(); }}
                    className="px-2.5 py-1 bg-white/[0.05] border border-white/[0.08] rounded-lg text-[11px] text-gray-500
                               hover:text-gray-200 hover:border-white/20 transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 pb-5 pt-2 border-t border-white/[0.08]">
              <div className="relative flex items-end gap-2 bg-white/[0.04] border border-white/[0.10] rounded-xl
                              focus-within:border-indigo-500/50 transition-colors">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Synthos AI anything…"
                  rows={2}
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 px-4 py-3 resize-none focus:outline-none"
                />
                <button
                  onClick={send}
                  disabled={!input.trim() || busy}
                  className="mb-2.5 mr-2.5 flex items-center justify-center w-8 h-8 rounded-lg
                             bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed
                             text-white transition-all active:scale-95 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-gray-700 mt-1.5 text-center">Enter to send · Shift+Enter for newline · Esc to close</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ChatContext.Provider>
  );
}

/* ─── Chat bubble ────────────────────────────────────────────────────────── */
function ChatBubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";

  // Very simple markdown: bold, newlines
  const formatted = msg.content
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>");

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5
        ${isUser
          ? "bg-indigo-600/30 border border-indigo-500/30"
          : "bg-gradient-to-br from-indigo-500/30 to-violet-500/30"
        }`}>
        {isUser
          ? <User className="w-3.5 h-3.5 text-indigo-300" />
          : <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
        }
      </div>
      <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
        ${isUser
          ? "bg-indigo-600/20 border border-indigo-500/25 text-indigo-100 rounded-tr-sm"
          : "bg-white/[0.05] border border-white/[0.08] text-gray-200 rounded-tl-sm"
        }`}
        dangerouslySetInnerHTML={{ __html: formatted || (msg.streaming ? "▌" : "") }}
      />
    </div>
  );
}

const QUICK_PROMPTS = [
  "Write an episode outline",
  "Suggest character traits",
  "Help with world-building",
  "Polish my dialogue",
  "Trending anime tropes",
  "Improve my script",
];

/** @deprecated use SynthosChatProvider */
export const OpenClawChatProvider = SynthosChatProvider;
