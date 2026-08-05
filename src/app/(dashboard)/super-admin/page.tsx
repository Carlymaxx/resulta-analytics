"use client";

import { useState } from "react";
import { Shield, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
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

const schools = [
  { id: 1, name: "Nairobi High School", city: "Nairobi", students: 680, plan: "Pro", status: "Active", joined: "2023-01-15" },
  { id: 2, name: "Mombasa Academy", city: "Mombasa", students: 450, plan: "Starter", status: "Active", joined: "2023-04-20" },
  { id: 3, name: "Kisumu Lakeside School", city: "Kisumu", students: 310, plan: "Starter", status: "Active", joined: "2023-07-01" },
  { id: 4, name: "Nakuru Learning Center", city: "Nakuru", students: 220, plan: "Free", status: "Suspended", joined: "2023-09-10" },
  { id: 5, name: "Eldoret International", city: "Eldoret", students: 520, plan: "Pro", status: "Active", joined: "2024-01-08" },
  { id: 6, name: "Thika Road Academy", city: "Nairobi", students: 380, plan: "Starter", status: "Active", joined: "2024-03-22" },
  { id: 7, name: "Nyeri Hills School", city: "Nyeri", students: 280, plan: "Free", status: "Active", joined: "2024-06-15" },
  { id: 8, name: "Garissa Model School", city: "Garissa", students: 190, plan: "Starter", status: "Suspended", joined: "2024-08-30" },
];

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
  { name: "Free Trial", price: "KES 0", students: "50 students", features: ["Basic student management", "Attendance tracking", "2 teacher accounts", "Community support"], color: "border-slate-200", badge: "bg-slate-100 text-slate-600" },
  { name: "Starter", price: "KES 2,500/mo", students: "200 students", features: ["All Free features", "Results & analytics", "10 teacher accounts", "SMS notifications", "Email support"], color: "border-blue-200", badge: "bg-blue-100 text-blue-700" },
  { name: "Professional", price: "KES 5,000/mo", students: "500 students", features: ["All Starter features", "All modules unlocked", "Unlimited teachers", "CBT exams", "Priority support", "API access"], color: "border-teal-500", badge: "bg-teal-600 text-white", highlight: true },
  { name: "Enterprise", price: "KES 12,000/mo", students: "Unlimited", features: ["All Pro features", "Multi-school management", "Custom branding", "Dedicated support", "SLA guarantee", "On-site training"], color: "border-purple-200", badge: "bg-purple-100 text-purple-700" },
];

const tickets = [
  { id: "TKT001", school: "Mombasa Academy", subject: "Unable to export reports", priority: "High", status: "Open", date: "2025-01-14" },
  { id: "TKT002", school: "Kisumu Lakeside School", subject: "SMS integration not working", priority: "Medium", status: "In Progress", date: "2025-01-13" },
  { id: "TKT003", school: "Nairobi High School", subject: "Payroll calculations incorrect", priority: "High", status: "Resolved", date: "2025-01-10" },
  { id: "TKT004", school: "Eldoret International", subject: "Password reset not sending email", priority: "Low", status: "Open", date: "2025-01-12" },
  { id: "TKT005", school: "Thika Road Academy", subject: "Timetable generator crash", priority: "Medium", status: "In Progress", date: "2025-01-11" },
];

const tabs = ["Schools", "Revenue", "Packages", "Support Tickets"];

export default function SuperAdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Schools");
  const [schoolStatuses, setSchoolStatuses] = useState<Record<number, string>>(
    Object.fromEntries(schools.map(s => [s.id, s.status]))
  );

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
    setSchoolStatuses(prev => ({
      ...prev,
      [id]: prev[id] === "Active" ? "Suspended" : "Active"
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Super Admin</h1>
        <p className="text-slate-500 text-sm mt-1">Platform-wide management and oversight</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Schools", value: "48", color: "text-teal-600", bg: "bg-teal-50" },
          { label: "Active Schools", value: "44", color: "text-green-600", bg: "bg-green-50" },
          { label: "Suspended", value: "2", color: "text-red-600", bg: "bg-red-50" },
          { label: "Monthly Revenue", value: "KES 2.4M", color: "text-blue-600", bg: "bg-blue-50" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
              <Shield className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className="text-2xl font-bold text-slate-800">{s.value}</div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200 px-6 overflow-x-auto">
          <div className="flex gap-6 min-w-max">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? "border-teal-600 text-teal-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6">
          {activeTab === "Schools" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    {["School Name", "City", "Students", "Plan", "Status", "Joined", "Action"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schools.map(s => {
                    const currentStatus = schoolStatuses[s.id] || s.status;
                    return (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm font-medium text-slate-800">{s.name}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{s.city}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{s.students}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.plan === "Pro" ? "bg-teal-100 text-teal-700" : s.plan === "Starter" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>{s.plan}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${currentStatus === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{currentStatus}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">{s.joined}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => toggleSchool(s.id)} className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${currentStatus === "Active" ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}>
                            {currentStatus === "Active" ? "Suspend" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
                      <li key={f} className="text-xs text-slate-600 flex items-center gap-2">
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
                    {["Ticket ID", "School", "Subject", "Priority", "Status", "Date"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tickets.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-mono text-slate-500">{t.id}</td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">{t.school}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{t.subject}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.priority === "High" ? "bg-red-100 text-red-700" : t.priority === "Medium" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{t.priority}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.status === "Resolved" ? "bg-green-100 text-green-700" : t.status === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>{t.status}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{t.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
