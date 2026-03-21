import DashboardHeader from "@/components/dashboard/header";
import { HelpCircle, Search, Sparkles, MessageCircle, Book, Video, ChevronRight, ArrowUpRight, CheckCircle2 } from "lucide-react";

const faqs = [
  { q: "How does OpenClaw AI integrate with my projects?", a: "OpenClaw automatically analyzes your project data, documents, and workflows to provide real-time suggestions, automate repetitive tasks, and surface insights. No configuration needed." },
  { q: "Can I export my data from SYNTHOS?", a: "Yes. Go to Settings → Danger Zone → Export workspace data to download all your projects, documents, and analytics in JSON format." },
  { q: "How do I add more team members?", a: "Navigate to Team → Invite Member. You can invite by email and assign roles (Admin, Member, Viewer). Invites are valid for 7 days." },
  { q: "What counts as an OpenClaw AI request?", a: "Each AI operation (analysis, generation, suggestion) counts as one request. Viewing cached results does not count. Your usage resets on your billing date." },
  { q: "How do I connect Slack notifications?", a: "Go to Integrations → Slack → Connect. Authorize SYNTHOS in your Slack workspace, then choose which channels to send notifications to." },
];

const resources = [
  { title: "Getting Started Guide", desc: "Set up your workspace in 10 minutes", icon: Book, href: "#" },
  { title: "OpenClaw AI Docs", desc: "Deep dive into AI features and prompts", icon: Sparkles, href: "#" },
  { title: "Video Tutorials", desc: "Step-by-step walkthroughs for every feature", icon: Video, href: "#" },
  { title: "API Reference", desc: "Full REST API and SDK documentation", icon: Book, href: "#" },
];

const tickets = [
  { id: "#4821", subject: "OpenClaw not returning results for long documents", status: "open", updated: "2h ago", priority: "high" },
  { id: "#4803", subject: "CSV export missing some columns", status: "resolved", updated: "3d ago", priority: "medium" },
  { id: "#4789", subject: "Slack integration disconnecting after 24h", status: "resolved", updated: "1w ago", priority: "low" },
];

const statusColors: Record<string, string> = {
  open: "bg-amber-500/20 text-amber-400",
  resolved: "bg-emerald-500/20 text-emerald-400",
};

export default function SupportPage() {
  return (
    <div>
      <DashboardHeader title="Support" description="Help center and ticket management" />
      <div className="p-6 space-y-6">
        {/* Search */}
        <div className="glass rounded-2xl p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent pointer-events-none" />
          <div className="relative">
            <h2 className="text-xl font-semibold text-white mb-2">How can we help?</h2>
            <p className="text-sm text-gray-400 mb-5">Search our knowledge base or ask OpenClaw</p>
            <div className="flex items-center gap-3 max-w-xl mx-auto">
              <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <Search className="w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search documentation..." className="bg-transparent outline-none text-white placeholder-gray-500 flex-1 text-sm" />
              </div>
              <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap">
                <Sparkles className="w-4 h-4" />
                Ask AI
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* FAQs */}
            <div className="glass rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-violet-400" />
                <h2 className="font-semibold text-white">Frequently Asked Questions</h2>
              </div>
              <div className="divide-y divide-white/5">
                {faqs.map((faq, i) => (
                  <details key={i} className="group">
                    <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none hover:bg-white/5 transition-colors">
                      <p className="text-sm font-medium text-gray-300 group-open:text-white transition-colors pr-4">{faq.q}</p>
                      <ChevronRight className="w-4 h-4 text-gray-500 shrink-0 group-open:rotate-90 transition-transform" />
                    </summary>
                    <div className="px-6 pb-4 text-sm text-gray-400 leading-relaxed">{faq.a}</div>
                  </details>
                ))}
              </div>
            </div>

            {/* Support Tickets */}
            <div className="glass rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-violet-400" />
                  <h2 className="font-semibold text-white">My Tickets</h2>
                </div>
                <button className="text-sm bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-xl font-medium transition-all">
                  New Ticket
                </button>
              </div>
              <div className="divide-y divide-white/5">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      {ticket.status === "resolved" ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <MessageCircle className="w-5 h-5 text-amber-400 shrink-0" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 font-mono">{ticket.id}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[ticket.status]}`}>
                            {ticket.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mt-0.5">{ticket.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 hidden sm:block">{ticket.updated}</span>
                      <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-violet-400 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resources & Contact */}
          <div className="space-y-4">
            <div className="glass rounded-2xl p-5">
              <h2 className="font-semibold text-white mb-4">Resources</h2>
              <div className="space-y-2">
                {resources.map((r) => (
                  <a key={r.title} href={r.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                    <r.icon className="w-5 h-5 text-gray-400 group-hover:text-violet-400 transition-colors shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{r.title}</p>
                      <p className="text-xs text-gray-500">{r.desc}</p>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-violet-400 transition-colors shrink-0" />
                  </a>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-5 border border-violet-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-violet-400" />
                <h3 className="font-semibold text-white">Pro Support</h3>
              </div>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                On the Pro plan you get priority support with a 4-hour response time from our team.
              </p>
              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 4-hour response SLA</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Dedicated Slack channel</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Screen-share sessions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
