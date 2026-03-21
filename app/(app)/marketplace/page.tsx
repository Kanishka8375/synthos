import { DashHeader } from "@/components/dashboard/header";
import { MOCK_MARKET_ITEMS } from "@/lib/mock-data";
import type { MarketCategory } from "@/lib/types";
import { Search, Star, Download, ShoppingBag } from "lucide-react";

const categories: MarketCategory[] = ["Workflows", "Templates", "Presets", "Characters", "Soundtracks"];
const catColors: Record<MarketCategory, string> = {
  Workflows:   "bg-indigo-500/15 text-indigo-400",
  Templates:   "bg-violet-500/15 text-violet-400",
  Presets:     "bg-pink-500/15 text-pink-400",
  Characters:  "bg-cyan-500/15 text-cyan-400",
  Soundtracks: "bg-emerald-500/15 text-emerald-400",
};

export default function MarketplacePage() {
  return (
    <div>
      <DashHeader title="Marketplace" description="Community workflows, templates, and assets" />
      <div className="p-5 space-y-5">
        {/* Search + filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 glass rounded-xl px-3 py-2 text-xs text-gray-400 flex-1 min-w-0 max-w-xs">
            <Search className="w-3.5 h-3.5 shrink-0" />
            <input type="text" placeholder="Search marketplace..." className="bg-transparent outline-none text-white placeholder-gray-600 flex-1 text-xs" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button className="text-xs px-3 py-1.5 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">All</button>
            {categories.map((cat) => (
              <button key={cat} className="text-xs px-3 py-1.5 rounded-xl text-gray-500 hover:text-white glass glass-hover">{cat}</button>
            ))}
          </div>
        </div>

        {/* Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {MOCK_MARKET_ITEMS.map((item) => (
            <div key={item.id} className="glass glass-hover rounded-2xl p-5 flex flex-col group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-indigo-400" />
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${catColors[item.category]}`}>{item.category}</span>
              </div>

              <h3 className="font-semibold text-white text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed flex-1 mb-3">{item.description}</p>

              <div className="flex flex-wrap gap-1 mb-3">
                {item.tags.map((tag) => (
                  <span key={tag} className="text-[10px] bg-white/5 text-gray-500 px-1.5 py-0.5 rounded">#{tag}</span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>by {item.creator}</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" />{item.rating}</span>
                  <span className="flex items-center gap-1"><Download className="w-3 h-3" />{item.downloads.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white flex-1">
                  {item.price === "Free" ? <span className="text-emerald-400">Free</span> : `$${item.price}`}
                </span>
                <button className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  item.price === "Free"
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                    : "bg-pink-600 hover:bg-pink-500 text-white"
                }`}>
                  {item.price === "Free" ? "Install" : "Purchase"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
