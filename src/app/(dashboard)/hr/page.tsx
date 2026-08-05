"use client";

import { useState } from "react";
import { Users, Calendar, Building2, Briefcase, Plus, X, Check } from "lucide-react";

const employees = [
  { name: "Sarah Wanjiku", id: "EMP001", dept: "Academics", role: "Teacher", joined: "Jan 2020", status: "Active" },
  { name: "James Otieno", id: "EMP002", dept: "Finance", role: "Accountant", joined: "Mar 2019", status: "Active" },
  { name: "Grace Muthoni", id: "EMP003", dept: "Academics", role: "Teacher", joined: "Sep 2021", status: "Active" },
  { name: "Peter Kamau", id: "EMP004", dept: "Academics", role: "Teacher", joined: "Jan 2018", status: "On Leave" },
  { name: "Joyce Auma", id: "EMP005", dept: "Administration", role: "Receptionist", joined: "Jun 2022", status: "Active" },
  { name: "David Kipchoge", id: "EMP006", dept: "Transport", role: "Transport Manager", joined: "Apr 2020", status: "Active" },
  { name: "Fatuma Hassan", id: "EMP007", dept: "Library", role: "Librarian", joined: "Aug 2021", status: "Active" },
  { name: "Robert Njoroge", id: "EMP008", dept: "Security", role: "Security Officer", joined: "Nov 2019", status: "Active" },
];

const leaveRequests = [
  { employee: "Peter Kamau", dept: "Academics", type: "Sick Leave", from: "Dec 1, 2025", to: "Dec 14, 2025", days: 14, status: "Approved" },
  { employee: "Grace Muthoni", dept: "Academics", type: "Annual Leave", from: "Jan 6, 2026", to: "Jan 16, 2026", days: 10, status: "Pending" },
  { employee: "Joyce Auma", dept: "Administration", type: "Maternity Leave", from: "Feb 1, 2026", to: "Apr 30, 2026", days: 90, status: "Approved" },
  { employee: "Robert Njoroge", dept: "Security", type: "Emergency Leave", from: "Nov 28, 2025", to: "Nov 29, 2025", days: 2, status: "Rejected" },
  { employee: "Fatuma Hassan", dept: "Library", type: "Annual Leave", from: "Dec 20, 2025", to: "Jan 2, 2026", days: 13, status: "Pending" },
];

const departments = [
  { name: "Academics", employees: 22, head: "Dr. Mary Wanjiku" },
  { name: "Finance", employees: 5, head: "James Otieno" },
  { name: "Administration", employees: 6, head: "Joyce Auma" },
  { name: "Hostel", employees: 4, head: "Mary Njeri" },
  { name: "Transport", employees: 7, head: "David Kipchoge" },
  { name: "Library", employees: 3, head: "Fatuma Hassan" },
  { name: "Medical", employees: 3, head: "Nurse Alice" },
  { name: "Security", employees: 5, head: "Robert Njoroge" },
];

const stats = [
  { label: "Total Employees", value: "52", icon: Users, color: "bg-teal-100 text-teal-600" },
  { label: "On Leave", value: "4", icon: Calendar, color: "bg-amber-100 text-amber-600" },
  { label: "Departments", value: "8", icon: Building2, color: "bg-blue-100 text-blue-600" },
  { label: "Open Positions", value: "3", icon: Briefcase, color: "bg-purple-100 text-purple-600" },
];

export default function HRPage() {
  const [activeTab, setActiveTab] = useState("employees");
  const [showModal, setShowModal] = useState(false);
  const [leaveStatuses, setLeaveStatuses] = useState<Record<number, string>>(
    Object.fromEntries(leaveRequests.map((r, i) => [i, r.status]))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Human Resources</h1>
          <p className="text-sm text-slate-500 mt-1">Manage staff, departments, and leave requests</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{s.value}</div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {["employees", "leave", "departments"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === t ? "border-teal-600 text-teal-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
            {t === "employees" ? "Employees" : t === "leave" ? "Leave Requests" : "Departments"}
          </button>
        ))}
      </div>

      {activeTab === "employees" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {["Employee", "ID", "Department", "Role", "Joined", "Status"].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((e, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                          {e.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="text-sm font-medium text-slate-800">{e.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600 font-mono">{e.id}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{e.dept}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{e.role}</td>
                    <td className="py-3 px-4 text-sm text-slate-500">{e.joined}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${e.status === "Active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{e.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "leave" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {["Employee", "Department", "Type", "Period", "Days", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaveRequests.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-3 px-4 text-sm font-medium text-slate-800">{r.employee}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{r.dept}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{r.type}</td>
                    <td className="py-3 px-4 text-xs text-slate-500">{r.from} – {r.to}</td>
                    <td className="py-3 px-4 text-sm font-medium text-slate-800">{r.days}d</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${leaveStatuses[i] === "Approved" ? "bg-green-100 text-green-700" : leaveStatuses[i] === "Rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                        {leaveStatuses[i]}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {leaveStatuses[i] === "Pending" && (
                        <div className="flex gap-2">
                          <button onClick={() => setLeaveStatuses(prev => ({ ...prev, [i]: "Approved" }))}
                            className="flex items-center gap-1 text-green-600 hover:text-green-700 text-xs font-medium">
                            <Check className="w-3 h-3" /> Approve
                          </button>
                          <button onClick={() => setLeaveStatuses(prev => ({ ...prev, [i]: "Rejected" }))}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700 text-xs font-medium">
                            <X className="w-3 h-3" /> Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "departments" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {departments.map((d, i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center mb-3">
                <Building2 className="w-5 h-5 text-teal-600" />
              </div>
              <div className="text-lg font-bold text-slate-800">{d.name}</div>
              <div className="text-2xl font-bold text-teal-700 my-1">{d.employees}</div>
              <div className="text-xs text-slate-500">employees</div>
              <div className="text-xs text-slate-600 mt-2 border-t border-slate-100 pt-2">Head: {d.head}</div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">Add Employee</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              {[["Full Name", "text"], ["Employee ID", "text"], ["Email", "email"], ["Phone", "tel"], ["Department", "select-dept"], ["Role/Position", "text"], ["Join Date", "date"]].map(([label, type]) => (
                <div key={label as string}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{label as string}</label>
                  {type === "select-dept" ? (
                    <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                      {departments.map(d => <option key={d.name}>{d.name}</option>)}
                    </select>
                  ) : (
                    <input type={type as string} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 p-6 border-t border-slate-200">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-slate-200 text-slate-700 py-2 rounded-lg hover:bg-slate-50 text-sm font-medium">Cancel</button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 text-sm font-medium">Save Employee</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
