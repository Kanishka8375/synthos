import { Sidebar } from "@/components/dashboard/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#07070f]">
      <Sidebar />
      <main className="flex-1 overflow-auto min-w-0">{children}</main>
    </div>
  );
}
