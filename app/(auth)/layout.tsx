export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#07070f] relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-pink-600/8 rounded-full blur-[100px] pointer-events-none" />
      {children}
    </div>
  );
}
