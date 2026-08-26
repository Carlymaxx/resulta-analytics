"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Shield, X, Plus, Trash2 } from "lucide-react";
import { getRegisteredUsers, RegisteredUser, EDUCATION_LEVELS } from "@/context/AuthContext";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type School = {
  id: number;
  name: string;
  city: string;
  students: number;
  plan: string;
  status: string;
  joined: string;
  schoolId?: string;
};

const initialSchools: School[] = [];

const revenueData = {
  labels: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
  datasets: [{
    label: "Revenue (KES)",
    data: [1800000, 2100000, 2050000, 2300000, 2150000, 2400000],
    borderColor: "rgb(20, 184, 166)",
    backgroundColor: "rgba(20, 184, 166, 0.1)",
    borderWidth: 2,
    tension: 0.4,
    fill: true,
  }],
};

const packages = [
  { name: "Free Trial", price: "KES 0", students: "50 students", features: ["Basic student management", "Attendance tracking", "2 teacher accounts", "Community support"], color: "border-slate-200", badge: "bg-slate-100 text-slate-600 dark:text-slate-400" },
  { name: "Starter", price: "KES 2,500/mo", students: "200 students", features: ["All Free features", "Results & analytics", "10 teacher accounts", "SMS notifications", "Email support"], color: "border-blue-200", badge: "bg-blue-100 text-blue-700" },
  { name: "Professional", price: "KES 5,000/mo", students: "500 students", features: ["All Starter features", "All modules unlocked", "Unlimited teachers", "CBT exams", "Priority support", "API access"], color: "border-teal-500", badge: "bg-teal-600 text-white", highlight: true },
  { name: "Enterprise", price: "KES 12,000/mo", students: "Unlimited", features: ["All Pro features", "Multi-school management", "Custom branding", "Dedicated support", "SLA guarantee", "On-site training"], color: "border-purple-200", badge: "bg-purple-100 text-purple-700" },
];

const tickets = [
  { id: "TKT001", school: "Mombasa Academy", topic: "Unable to export reports", priority: "High", status: "Open", date: "2025-01-14", schoolId: "school-mombasa" },
  { id: "TKT002", school: "Kisumu Lakeside School", topic: "SMS integration not working", priority: "Medium", status: "In Progress", date: "2025-01-13", schoolId: "school-kisumu" },
  { id: "TKT003", school: "Nairobi High School", topic: "Payroll calculations incorrect", priority: "High", status: "Resolved", date: "2025-01-10", schoolId: "school-nairobi-high" },
  { id: "TKT004", school: "Eldoret International", topic: "Password reset not sending email", priority: "Low", status: "Open", date: "2025-01-12", schoolId: "school-eldoret" },
  { id: "TKT005", school: "Thika Road Academy", topic: "Timetable generator crash", priority: "Medium", status: "In Progress", date: "2025-01-11", schoolId: "school-thika" },
];

const tabs = ["Schools", "Registered Users", "Revenue", "Packages", "Support Tickets"];

const levelLabel = (v?: string) => EDUCATION_LEVELS.find((l) => l.value === v)?.label || "—";

export default function SuperAdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Schools");
  const [schools, setSchools] = useState<School[]>(initialSchools);
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [schoolForm, setSchoolForm] = useState({ name: "", city: "", students: "", plan: "Free" });
  const [registered, setRegistered] = useState<RegisteredUser[]>(() => getRegisteredUsers());

  if (user?.role !== "superadmin") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-xl p-10 shadow-sm border border-slate-200 text-center max-w-sm">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Access Denied</h2>
          <p className="text-slate-500 text-sm">This page is restricted to Super Administrators only. You do not have the required permissions to access this area.</p>
        </div>
      </div>
    );
  }

  const toggleSchool = (id: number) => {
    setSchools(prev => prev.map(s =>
      s.id === id ? { ...s, status: s.status === "Active" ? "Suspended" : "Active" } : s
    ));
  };

  const deleteSchool = (id: number) => {
    setSchools(prev => prev.filter(s => s.id !== id));
  };

  const handleAddSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolForm.name.trim()) return;
    const newSchool: School = {
      id: Date.now(),
      name: schoolForm.name,
      city: schoolForm.city,
      students: Number(schoolForm.students) || 0,
      plan: schoolForm.plan,
      status: "Active",
      joined: new Date().toISOString().slice(0, 10),
      schoolId: `school-${Date.now()}`,
    };
    setSchools(prev => [newSchool, ...prev]);
    setSchoolForm({ name: "", city: "", students: "", plan: "Free" });
    setShowAddSchool(false);
  };

  const totalSchools = schools.length;
  const activeSchools = schools.filter(s => s.status === "Active").length;
  const suspendedSchools = schools.filter(s => s.status === "Suspended").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Super Admin</h1>
        <p className="text-slate-500 text-sm mt-1">Platform-wide management and oversight</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Schools", value: String(totalSchools), color: "text-teal-600", bg: "bg-teal-50" },
          { label: "Registered Users", value: String(registered.length), color: "text-green-600", bg: "bg-green-50" },
          { label: "Suspended Schools", value: String(suspendedSchools), color: "text-red-600", bg: "bg-red-50" },
          { label: "Active Schools", value: String(activeSchools), color: "text-blue-600", bg: "bg-blue-50" },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
              <Shield className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-white">{s.value}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="border-b border-slate-200 px-6 overflow-x-auto">
          <div className="flex gap-6 min-w-max">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? "border-teal-600 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6">
          {activeTab === "Schools" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-500 dark:text-slate-400">{schools.length} schools</span>
                <button onClick={() => setShowAddSchool(true)} className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all text-sm font-medium flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add School
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      {["School Name", "City", "Students", "Plan", "Status", "Joined", "Action"].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {schools.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                          No schools yet. Click <span className="font-medium text-teal-600">Add School</span> to create one.
                        </td>
                      </tr>
                    )}
                    {schools.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-4 py-3 text-sm font-medium text-slate-800">{s.name}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{s.city}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{s.students}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.plan === "Pro" ? "bg-teal-100 text-teal-700" : s.plan === "Starter" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600 dark:text-slate-400"}`}>{s.plan}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{s.status}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{s.joined}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => toggleSchool(s.id)} className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${s.status === "Active" ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}>
                              {s.status === "Active" ? "Suspend" : "Activate"}
                            </button>
                            <button onClick={() => deleteSchool(s.id)} className="px-2 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-colors" title="Delete">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "Registered Users" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-500 dark:text-slate-400">{registered.length} registered accounts (built-in + self sign-ups)</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Primary", value: registered.filter(u => u.level === "primary").length },
                  { label: "Junior", value: registered.filter(u => u.level === "junior").length },
                  { label: "Secondary", value: registered.filter(u => u.level === "secondary").length },
                  { label: "Self sign-ups", value: registered.filter(u => u.source === "signup").length },
                ].map(s => (
                  <div key={s.label} className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500 mb-1">{s.label}</div>
                    <div className="font-bold text-slate-800">{s.value}</div>
                  </div>
                ))}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      {["Name", "Email", "Role", "Level", "School", "Source"].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {registered.length === 0 && (
                      <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400">No registered users yet.</td></tr>
                    )}
                    {registered.map(u => (
                      <tr key={u.id + u.email} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-4 py-3 text-sm font-medium text-slate-800">{u.name}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 capitalize">{u.role.replace("_", " ")}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{levelLabel(u.level)}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{u.school || "—"}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.source === "signup" ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-600 dark:text-slate-400"}`}>
                            {u.source === "signup" ? "Sign-up" : "Built-in"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "Revenue" && (
            <div>
              <h3 className="font-semibold text-slate-800 mb-4">6-Month Revenue Trend</h3>
              <div className="h-64">
                <Line data={revenueData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: "#f1f5f9" } }, x: { grid: { display: false } } } }} />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                {[
                  { label: "This Month", value: "KES 2,400,000" },
                  { label: "Last Month", value: "KES 2,150,000" },
                  { label: "6-Month Total", value: "KES 12,800,000" },
                ].map(r => (
                  <div key={r.label} className="bg-slate-50 rounded-xl p-4 text-center">
                    <div className="text-xs text-slate-500 mb-1">{r.label}</div>
                    <div className="font-bold text-slate-800">{r.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Packages" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {packages.map(pkg => (
                <div key={pkg.name} className={`border-2 rounded-xl p-5 ${pkg.color} ${pkg.highlight ? "shadow-md" : ""}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="font-bold text-slate-800">{pkg.name}</div>
                    {pkg.highlight && <span className="px-2 py-0.5 bg-teal-600 text-white rounded-full text-xs font-medium">Popular</span>}
                  </div>
                  <div className="text-xl font-bold text-teal-600 mb-1">{pkg.price}</div>
                  <div className="text-xs text-slate-500 mb-4">{pkg.students}</div>
                  <ul className="space-y-2">
                    {pkg.features.map(f => (
                      <li key={f} className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-teal-500 rounded-full flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Support Tickets" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                     {["Ticket ID", "School", "Topic", "Priority", "Status", "Date"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tickets.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-3 text-sm font-mono text-slate-500">{t.id}</td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">{t.school}</td>
                       <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{t.topic}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.priority === "High" ? "bg-red-100 text-red-700" : t.priority === "Medium" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600 dark:text-slate-400"}`}>{t.priority}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.status === "Resolved" ? "bg-green-100 text-green-700" : t.status === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>{t.status}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{t.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add School Modal */}
      {showAddSchool && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Add New School</h2>
              <button onClick={() => setShowAddSchool(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddSchool} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">School Name</label>
                  <input value={schoolForm.name} onChange={e => setSchoolForm({ ...schoolForm, name: e.target.value })} required className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="School name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">City</label>
                  <input value={schoolForm.city} onChange={e => setSchoolForm({ ...schoolForm, city: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="City" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Students</label>
                  <input type="number" min="0" value={schoolForm.students} onChange={e => setSchoolForm({ ...schoolForm, students: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="0" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Plan</label>
                  <select value={schoolForm.plan} onChange={e => setSchoolForm({ ...schoolForm, plan: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    {["Free", "Starter", "Pro", "Enterprise"].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all text-sm font-medium flex-1">Add School</button>
                <button type="button" onClick={() => setShowAddSchool(false)} className="border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm font-medium">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
