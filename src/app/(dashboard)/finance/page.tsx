"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { DollarSign, Plus, X } from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const feeStructure = [
  { category: "Tuition Fee", amount: 15000, term: "Per Term", students: 480, schoolId: "school-nairobi-high" },
  { category: "Boarding Fee", amount: 8000, term: "Per Term", students: 140, schoolId: "school-nairobi-high" },
  { category: "Transport Fee", amount: 3000, term: "Per Term", students: 180, schoolId: "school-nairobi-high" },
  { category: "Uniform Fee", amount: 2500, term: "Once", students: 480, schoolId: "school-nairobi-high" },
  { category: "Lab Fee", amount: 1500, term: "Per Term", students: 380, schoolId: "school-nairobi-high" },
  { category: "Library Fee", amount: 500, term: "Per Term", students: 480, schoolId: "school-nairobi-high" },
];

const payments = [
  { id: "REC001", student: "Alice Wanjiru", class: "Grade 9", amount: 15000, date: "2025-01-08", method: "M-Pesa", receipt: "MP240108001", status: "Confirmed", schoolId: "school-nairobi-high" },
  { id: "REC002", student: "Brian Otieno", class: "Grade 8", amount: 8000, date: "2025-01-09", method: "Cash", receipt: "CSH240109001", status: "Confirmed", schoolId: "school-nairobi-high" },
  { id: "REC003", student: "Christine Mwangi", class: "Grade 9", amount: 15000, date: "2025-01-10", method: "M-Pesa", receipt: "MP240110001", status: "Confirmed", schoolId: "school-nairobi-high" },
  { id: "REC004", student: "Dennis Kamau", class: "Grade 7", amount: 3000, date: "2025-01-10", method: "M-Pesa", receipt: "MP240110002", status: "Pending", schoolId: "school-nairobi-high" },
  { id: "REC005", student: "Esther Njeri", class: "Grade 8", amount: 15000, date: "2025-01-11", method: "Cash", receipt: "CSH240111001", status: "Confirmed", schoolId: "school-nairobi-high" },
  { id: "REC006", student: "Frank Odhiambo", class: "Grade 7", amount: 1500, date: "2025-01-11", method: "M-Pesa", receipt: "MP240111001", status: "Confirmed", schoolId: "school-nairobi-high" },
  { id: "REC007", student: "Gloria Adhiambo", class: "Grade 8", amount: 15000, date: "2025-01-12", method: "M-Pesa", receipt: "MP240112001", status: "Confirmed", schoolId: "school-nairobi-high" },
  { id: "REC008", student: "Hassan Abdi", class: "Grade 9", amount: 8000, date: "2025-01-12", method: "Cash", receipt: "CSH240112001", status: "Confirmed", schoolId: "school-nairobi-high" },
  { id: "REC009", student: "Irene Wambua", class: "Grade 7", amount: 500, date: "2025-01-13", method: "M-Pesa", receipt: "MP240113001", status: "Confirmed", schoolId: "school-nairobi-high" },
  { id: "REC010", student: "John Muthoni", class: "Grade 8", amount: 15000, date: "2025-01-14", method: "Cash", receipt: "CSH240114001", status: "Pending", schoolId: "school-nairobi-high" },
];

const tabs = ["Fee Structure", "Payments", "Invoices", "Expenses"];

const monthlyData = {
  labels: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
  datasets: [{
    label: "Collections (KES)",
    data: [1800000, 2100000, 1950000, 2300000, 1600000, 2450000],
    backgroundColor: "rgba(20, 184, 166, 0.7)",
    borderColor: "rgb(20, 184, 166)",
    borderWidth: 1,
    borderRadius: 4,
  }],
};

const invoices = [
  { id: "INV001", student: "Alice Wanjiru", amount: 15000, due: "2025-02-01", status: "Paid", schoolId: "school-nairobi-high" },
  { id: "INV002", student: "Brian Otieno", amount: 23000, due: "2025-02-01", status: "Overdue", schoolId: "school-nairobi-high" },
  { id: "INV003", student: "Christine Mwangi", amount: 15000, due: "2025-02-15", status: "Pending", schoolId: "school-nairobi-high" },
  { id: "INV004", student: "Dennis Kamau", amount: 18000, due: "2025-02-01", status: "Paid", schoolId: "school-nairobi-high" },
  { id: "INV005", student: "Esther Njeri", amount: 15000, due: "2025-02-20", status: "Pending", schoolId: "school-nairobi-high" },
];

const expenses = [
  { id: "EXP001", description: "Electricity Bill", category: "Utilities", amount: 45000, date: "2025-01-05", approvedBy: "Admin", schoolId: "school-nairobi-high" },
  { id: "EXP002", description: "Lab Supplies", category: "Academic", amount: 28000, date: "2025-01-08", approvedBy: "Principal", schoolId: "school-nairobi-high" },
  { id: "EXP003", description: "Sports Equipment", category: "Co-curricular", amount: 15000, date: "2025-01-10", approvedBy: "Admin", schoolId: "school-nairobi-high" },
  { id: "EXP004", description: "Office Stationery", category: "Administration", amount: 8500, date: "2025-01-12", approvedBy: "Admin", schoolId: "school-nairobi-high" },
  { id: "EXP005", description: "Cleaning Supplies", category: "Maintenance", amount: 12000, date: "2025-01-14", approvedBy: "Admin", schoolId: "school-nairobi-high" },
];

export default function FinancePage() {
  const { user } = useAuth();
  const schoolName = user?.school || "My School";
  const [activeTab, setActiveTab] = useState("Fee Structure");
  const [showPayment, setShowPayment] = useState(false);
  const [payForm, setPayForm] = useState({ student: "", amount: "", method: "M-Pesa", category: "Tuition Fee" });

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPayment(false);
    setPayForm({ student: "", amount: "", method: "M-Pesa", category: "Tuition Fee" });
  };

  const filteredFeeStructure = feeStructure.filter(f => !user?.schoolId || f.schoolId === user.schoolId);
  const filteredPayments = payments.filter(p => !user?.schoolId || p.schoolId === user.schoolId);
  const filteredInvoices = invoices.filter(inv => !user?.schoolId || inv.schoolId === user.schoolId);
  const filteredExpenses = expenses.filter(exp => !user?.schoolId || exp.schoolId === user.schoolId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Finance</h1>
          <p className="text-slate-500 text-sm mt-1">Fee management and financial records for {schoolName}</p>
        </div>
        <button onClick={() => setShowPayment(true)} className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" /> Record Payment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Collected", value: "KES 2,450,000", color: "text-teal-600", bg: "bg-teal-50" },
          { label: "Pending Fees", value: "KES 380,000", color: "text-amber-600", bg: "bg-amber-50" },
          { label: "This Month", value: "KES 120,000", color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Defaulters", value: "34", color: "text-red-600", bg: "bg-red-50" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
              <DollarSign className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className="text-2xl font-bold text-slate-800">{s.value}</div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-base font-semibold text-slate-800 mb-4">Monthly Collections</h2>
        <div className="h-48">
          <Bar data={monthlyData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: "#f1f5f9" } }, x: { grid: { display: false } } } }} />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200 px-6">
          <div className="flex gap-6">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? "border-teal-600 text-teal-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === "Fee Structure" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    {["Fee Category", "Amount (KES)", "Frequency", "Students"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFeeStructure.map(fee => (
                    <tr key={fee.category} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">{fee.category}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 font-semibold">{fee.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{fee.term}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{fee.students}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "Payments" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                      {["Student", "Class", "Amount", "Date", "Method", "Receipt", "Status"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPayments.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">{p.student}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{p.class}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800">KES {p.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{p.date}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.method === "M-Pesa" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>{p.method}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500 font-mono text-xs">{p.receipt}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.status === "Confirmed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{p.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "Invoices" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    {["Invoice ID", "Student", "Amount (KES)", "Due Date", "Status"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInvoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-mono text-slate-600">{inv.id}</td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">{inv.student}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800">{inv.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{inv.due}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${inv.status === "Paid" ? "bg-green-100 text-green-700" : inv.status === "Overdue" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{inv.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "Expenses" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    {["ID", "Description", "Category", "Amount (KES)", "Date", "Approved By"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredExpenses.map(exp => (
                    <tr key={exp.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-mono text-slate-500">{exp.id}</td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">{exp.description}</td>
                      <td className="px-4 py-3"><span className="px-2 py-1 bg-slate-100 rounded-full text-xs text-slate-600">{exp.category}</span></td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800">{exp.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{exp.date}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{exp.approvedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Record Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Record Payment</h2>
              <button onClick={() => setShowPayment(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handlePaySubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Student Name</label>
                <input value={payForm.student} onChange={e => setPayForm({ ...payForm, student: e.target.value })} required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" placeholder="Student name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fee Category</label>
                <select value={payForm.category} onChange={e => setPayForm({ ...payForm, category: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500">
                  {feeStructure.map(f => <option key={f.category}>{f.category}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount (KES)</label>
                <input type="number" value={payForm.amount} onChange={e => setPayForm({ ...payForm, amount: e.target.value })} required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
                <select value={payForm.method} onChange={e => setPayForm({ ...payForm, method: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500">
                  <option>M-Pesa</option>
                  <option>Cash</option>
                  <option>Bank Transfer</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex-1">Record Payment</button>
                <button type="button" onClick={() => setShowPayment(false)} className="border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
