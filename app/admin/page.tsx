"use client";

import { useStore } from "@/store/useStore";
import { Users, FolderKanban, Eye, TrendingUp, ArrowUpRight } from "lucide-react";

export default function AdminDashboard() {
  const { projects, leads } = useStore();

  const stats = [
    { label: "Total Leads", value: leads.length || 24, icon: Users, color: "bg-blue-500", change: "+12%" },
    { label: "Projects", value: projects.length, icon: FolderKanban, color: "bg-green-500", change: "+2" },
    { label: "Visitors (Today)", value: 342, icon: Eye, color: "bg-purple-500", change: "+18%" },
    { label: "Conversion Rate", value: "4.2%", icon: TrendingUp, color: "bg-orange-500", change: "+0.5%" },
  ];

  const recentLeads = [
    { name: "Ravi Kumar", phone: "9876543210", project: "Green Valley", time: "2 min ago", status: "new" },
    { name: "Anitha S", phone: "9876543211", project: "Sunrise Garden", time: "15 min ago", status: "new" },
    { name: "Mohammed J", phone: "9876543212", project: "Royal Enclave", time: "1 hr ago", status: "contacted" },
    { name: "Lakshmi P", phone: "9876543213", project: "Metro City", time: "3 hrs ago", status: "qualified" },
    { name: "Suresh R", phone: "9876543214", project: "Green Valley", time: "5 hrs ago", status: "converted" },
  ];

  const statusColors: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-yellow-100 text-yellow-700",
    qualified: "bg-purple-100 text-purple-700",
    converted: "bg-green-100 text-green-700",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-green-600 font-medium flex items-center gap-0.5">
                {change} <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Leads</h2>
          <div className="space-y-3">
            {recentLeads.map((lead, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    {lead.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                    <p className="text-xs text-gray-500">{lead.project} • {lead.time}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Projects */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Projects</h2>
          <div className="space-y-3">
            {projects.slice(0, 5).map((project, i) => (
              <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{project.title}</p>
                    <p className="text-xs text-gray-500">{project.location}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                  project.status === "hot" ? "bg-orange-100 text-orange-700" :
                  project.status === "new" ? "bg-green-100 text-green-700" :
                  "bg-gray-100 text-gray-700"
                }`}>
                  {project.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
