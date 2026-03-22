import { Sidebar } from "@/components/dashboard/sidebar";
import { ToastProvider } from "@/components/ui/toast";
import { SynthosChatProvider } from "@/components/ui/openclaw-chat";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <SynthosChatProvider>
        <div className="flex min-h-screen bg-[#07070f]">
          <Sidebar />
          <main className="flex-1 overflow-auto min-w-0">{children}</main>
        </div>
      </SynthosChatProvider>
    </ToastProvider>
  );
}
