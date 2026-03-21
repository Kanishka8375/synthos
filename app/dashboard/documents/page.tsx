import DashboardHeader from "@/components/dashboard/header";
import { FileText, Plus, Search, Star, Clock, MoreHorizontal, Sparkles } from "lucide-react";

const documents = [
  { name: "Product Strategy 2025", type: "Doc", updated: "1h ago", size: "24 KB", starred: true, author: "Jane S." },
  { name: "Q1 Campaign Brief", type: "Doc", updated: "3h ago", size: "18 KB", starred: true, author: "Mark T." },
  { name: "API Documentation v3", type: "Doc", updated: "1d ago", size: "142 KB", starred: false, author: "Dev Team" },
  { name: "Onboarding Checklist", type: "Doc", updated: "2d ago", size: "8 KB", starred: false, author: "Jane S." },
  { name: "Investor Deck Q4", type: "Doc", updated: "1w ago", size: "3.2 MB", starred: true, author: "CEO" },
  { name: "Brand Guidelines", type: "Doc", updated: "2w ago", size: "12 MB", starred: false, author: "Design" },
  { name: "Security Policy", type: "Doc", updated: "1mo ago", size: "56 KB", starred: false, author: "Ops" },
  { name: "Team Handbook", type: "Doc", updated: "2mo ago", size: "220 KB", starred: false, author: "HR" },
];

export default function DocumentsPage() {
  return (
    <div>
      <DashboardHeader title="Documents" description="Your workspace documents and files" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 glass rounded-xl px-4 py-2.5 text-sm text-gray-400 w-64">
            <Search className="w-4 h-4" />
            <input type="text" placeholder="Search documents..." className="bg-transparent outline-none text-white placeholder-gray-500 flex-1" />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 glass glass-hover text-gray-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all">
              <Sparkles className="w-4 h-4 text-violet-400" />
              Generate with AI
            </button>
            <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all">
              <Plus className="w-4 h-4" />
              New Document
            </button>
          </div>
        </div>

        {/* Starred Section */}
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            Starred
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {documents.filter(d => d.starred).map((doc) => (
              <div key={doc.name} className="glass glass-hover rounded-xl p-4 cursor-pointer group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-violet-400" />
                  </div>
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                </div>
                <h3 className="font-medium text-white text-sm mb-1">{doc.name}</h3>
                <p className="text-xs text-gray-500">{doc.author} · {doc.size}</p>
              </div>
            ))}
          </div>
        </div>

        {/* All Documents Table */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <h2 className="font-semibold text-white">All Documents</h2>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5" />
              Recently updated
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-xs border-b border-white/10">
                <th className="text-left px-6 py-3 font-medium">Name</th>
                <th className="text-left px-6 py-3 font-medium hidden md:table-cell">Author</th>
                <th className="text-left px-6 py-3 font-medium hidden sm:table-cell">Updated</th>
                <th className="text-left px-6 py-3 font-medium hidden lg:table-cell">Size</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {documents.map((doc) => (
                <tr key={doc.name} className="hover:bg-white/5 transition-colors cursor-pointer">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-violet-400 shrink-0" />
                      <span className="text-gray-300 font-medium">{doc.name}</span>
                      {doc.starred && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-gray-400 hidden md:table-cell">{doc.author}</td>
                  <td className="px-6 py-3 text-gray-400 hidden sm:table-cell">{doc.updated}</td>
                  <td className="px-6 py-3 text-gray-400 hidden lg:table-cell">{doc.size}</td>
                  <td className="px-6 py-3 text-right">
                    <button className="text-gray-500 hover:text-white transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
