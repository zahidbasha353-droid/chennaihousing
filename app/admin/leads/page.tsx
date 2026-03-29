"use client";

import { useState } from "react";
import { Download, Phone, MessageCircle, Search } from "lucide-react";

const demoLeads = [
  { id: "1", name: "Ravi Kumar", phone: "9876543210", email: "ravi@email.com", project: "Green Valley", source: "website", status: "new", created_at: "2024-03-28 14:30" },
  { id: "2", name: "Anitha S", phone: "9876543211", email: "anitha@email.com", project: "Sunrise Garden", source: "whatsapp", status: "contacted", created_at: "2024-03-28 12:15" },
  { id: "3", name: "Mohammed J", phone: "9876543212", email: "mj@email.com", project: "Royal Enclave", source: "exit_intent", status: "qualified", created_at: "2024-03-27 18:45" },
  { id: "4", name: "Lakshmi P", phone: "9876543213", email: "lakshmi@email.com", project: "Metro City", source: "website", status: "converted", created_at: "2024-03-27 10:00" },
  { id: "5", name: "Suresh R", phone: "9876543214", email: "suresh@email.com", project: "Green Valley", source: "brochure_download", status: "new", created_at: "2024-03-26 16:20" },
];

export default function AdminLeadsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = demoLeads.filter((l) => {
    if (statusFilter !== "all" && l.status !== statusFilter) return false;
    if (search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.phone.includes(search)) return false;
    return true;
  });

  const statusColors: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-yellow-100 text-yellow-700",
    qualified: "bg-purple-100 text-purple-700",
    converted: "bg-green-100 text-green-700",
  };

  const exportCSV = () => {
    const header = "Name,Phone,Email,Project,Source,Status,Date\n";
    const rows = demoLeads.map((l) => `${l.name},${l.phone},${l.email},${l.project},${l.source},${l.status},${l.created_at}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by name or phone..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white">
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left p-4 font-medium text-gray-600">Name</th>
                <th className="text-left p-4 font-medium text-gray-600">Contact</th>
                <th className="text-left p-4 font-medium text-gray-600">Project</th>
                <th className="text-left p-4 font-medium text-gray-600">Source</th>
                <th className="text-left p-4 font-medium text-gray-600">Status</th>
                <th className="text-left p-4 font-medium text-gray-600">Date</th>
                <th className="text-right p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{lead.name}</td>
                  <td className="p-4">
                    <p className="text-gray-600">{lead.phone}</p>
                    <p className="text-xs text-gray-400">{lead.email}</p>
                  </td>
                  <td className="p-4 text-gray-600">{lead.project}</td>
                  <td className="p-4 text-gray-600 capitalize">{lead.source.replace("_", " ")}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[lead.status]}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 text-xs">{lead.created_at}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <a href={`tel:${lead.phone}`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Phone className="w-4 h-4" />
                      </a>
                      <a href={`https://wa.me/91${lead.phone}`} target="_blank" rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 text-sm text-gray-500">
          {filtered.length} leads
        </div>
      </div>
    </div>
  );
}
