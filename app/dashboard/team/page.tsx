import DashboardHeader from "@/components/dashboard/header";
import { Users, Plus, Search, Shield, Crown, MoreHorizontal, Mail } from "lucide-react";

const members = [
  { name: "Jane Smith", email: "jane@company.com", role: "Owner", status: "active", joined: "Jan 2024", avatar: "JS", projects: 8 },
  { name: "Mark Thompson", email: "mark@company.com", role: "Admin", status: "active", joined: "Feb 2024", avatar: "MT", projects: 5 },
  { name: "Sarah Chen", email: "sarah@company.com", role: "Member", status: "active", joined: "Mar 2024", avatar: "SC", projects: 4 },
  { name: "Alex Rivera", email: "alex@company.com", role: "Member", status: "active", joined: "Apr 2024", avatar: "AR", projects: 3 },
  { name: "Jordan Lee", email: "jordan@company.com", role: "Member", status: "active", joined: "May 2024", avatar: "JL", projects: 6 },
  { name: "Taylor Brooks", email: "taylor@company.com", role: "Viewer", status: "active", joined: "Jun 2024", avatar: "TB", projects: 1 },
  { name: "Casey Morgan", email: "casey@company.com", role: "Member", status: "invited", joined: "—", avatar: "CM", projects: 0 },
  { name: "Riley Davis", email: "riley@company.com", role: "Member", status: "invited", joined: "—", avatar: "RD", projects: 0 },
];

const roleColors: Record<string, string> = {
  Owner: "bg-amber-500/20 text-amber-400",
  Admin: "bg-violet-500/20 text-violet-400",
  Member: "bg-cyan-500/20 text-cyan-400",
  Viewer: "bg-gray-500/20 text-gray-400",
};

const roleIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Owner: Crown,
  Admin: Shield,
  Member: Users,
  Viewer: Users,
};

export default function TeamPage() {
  return (
    <div>
      <DashboardHeader title="Team" description="Manage team members and permissions" />
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Members", value: "8" },
            { label: "Admins", value: "2" },
            { label: "Pending Invites", value: "2" },
            { label: "Active Projects", value: "12" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 glass rounded-xl px-4 py-2.5 text-sm text-gray-400 w-64">
            <Search className="w-4 h-4" />
            <input type="text" placeholder="Search members..." className="bg-transparent outline-none text-white placeholder-gray-500 flex-1" />
          </div>
          <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all">
            <Plus className="w-4 h-4" />
            Invite Member
          </button>
        </div>

        {/* Members Table */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="font-semibold text-white">Members</h2>
            <span className="text-xs text-gray-500">{members.length} people</span>
          </div>
          <div className="divide-y divide-white/5">
            {members.map((member) => {
              const RoleIcon = roleIcons[member.role];
              return (
                <div key={member.email} className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/40 to-cyan-500/40 flex items-center justify-center text-white text-sm font-semibold">
                      {member.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">{member.name}</p>
                        {member.status === "invited" && (
                          <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">Pending</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden md:block text-xs text-gray-500">{member.projects} projects</div>
                    <div className="hidden sm:block text-xs text-gray-500">Joined {member.joined}</div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 ${roleColors[member.role]}`}>
                      <RoleIcon className="w-3 h-3" />
                      {member.role}
                    </span>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-gray-500 hover:text-white transition-colors p-1">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="text-gray-500 hover:text-white transition-colors p-1">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Roles & Permissions */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-4">Roles & Permissions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { role: "Owner", desc: "Full access to all features, billing, and can delete the workspace.", color: "border-amber-500/30 bg-amber-500/10" },
              { role: "Admin", desc: "Can manage members, projects, and most settings. Cannot delete workspace.", color: "border-violet-500/30 bg-violet-500/10" },
              { role: "Member", desc: "Can create and edit projects, documents, and templates.", color: "border-cyan-500/30 bg-cyan-500/10" },
              { role: "Viewer", desc: "Read-only access to shared projects and documents.", color: "border-gray-500/30 bg-gray-500/10" },
            ].map((r) => (
              <div key={r.role} className={`rounded-xl p-4 border ${r.color}`}>
                <p className="font-medium text-white text-sm mb-2">{r.role}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
