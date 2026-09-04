"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { DollarSign, Plus, X, TrendingUp } from "lucide-react";
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
import { loadStudents, getStudentCount, logAudit, FeePayment, FeeStructure, savePayment } from "@/lib/schoolStore";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PAYMENT_KEY = "payments";
const FEE_STRUCTURE_KEY = "fee_structure";

function loadPaymentsStore(schoolId?: string): FeePayment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`resulta_${PAYMENT_KEY}${schoolId ? `_${schoolId}` : ""}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function loadFeeStructure(schoolId?: string): FeeStructure[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`resulta_${FEE_STRUCTURE_KEY}${schoolId ? `_${schoolId}` : ""}`);
    if (raw) return JSON.parse(raw);
    return [
      { id: 1, category: "Tuition Fee", amount: 15000, term: "Per Term", schoolId },
      { id: 2, category: "Boarding Fee", amount: 8000, term: "Per Term", schoolId },
      { id: 3, category: "Transport Fee", amount: 3000, term: "Per Term", schoolId },
      { id: 4, category: "Activity Fee", amount: 1500, term: "Per Term", schoolId },
    ];
  } catch { return []; }
}

const tabs = ["Fee Structure", "Payments"];

export default function FinancePage() {
  const { user } = useAuth();
  const schoolName = user?.school || "My School";
  const [activeTab, setActiveTab] = useState("Fee Structure");
  const [showPayment, setShowPayment] = useState(false);
  const [payForm, setPayForm] = useState({ student: "", amount: "", method: "M-Pesa", category: "Tuition Fee" });
  const [students, setStudents] = useState<ReturnType<typeof loadStudents>>([]);
  const [payments, setPayments] = useState<FeePayment[]>([]);
  const [feeStructure, setFeeStructure] = useState<FeeStructure[]>([]);

  useEffect(() => {
    setStudents(loadStudents(user?.schoolId));
    setPayments(loadPaymentsStore(user?.schoolId));
    setFeeStructure(loadFeeStructure(user?.schoolId));
  }, [user?.schoolId]);

  const studentCount = getStudentCount(user?.schoolId);
  const totalCollected = payments.filter(p => p.status === "Confirmed").reduce((s, p) => s + p.amount, 0);
  const pendingCount = payments.filter(p => p.status === "Pending").length;
  const totalExpected = feeStructure.reduce((sum, f) => sum + (studentCount * f.amount), 0);

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const student = students.find(s => `${s.firstName} ${s.lastName}` === payForm.student);
    if (!student) return;
    const newPayment: FeePayment = {
      id: Date.now(),
      studentId: student.id,
      amount: Number(payForm.amount) || 0,
      category: payForm.category,
      date: new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Nairobi" }),
      method: payForm.method,
      receipt: `RCP${Date.now().toString().slice(-9)}`,
      status: "Confirmed",
      schoolId: user.schoolId,
    };
    savePayment(newPayment, user.schoolId);
    setPayments([newPayment, ...payments]);
    logAudit(
      { userId: user.id, userName: user.name, userRole: user.role, action: "CREATE", module: "finance", details: `Recorded payment of KES ${newPayment.amount} for ${student.firstName} ${student.lastName}` },
      user.schoolId
    );
    setShowPayment(false);
    setPayForm({ student: "", amount: "", method: "M-Pesa", category: "Tuition Fee" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Finance</h1>
          <p className="text-slate-500 text-sm mt-1">Fee management for {schoolName}</p>
        </div>
        <button onClick={() => setShowPayment(true)} className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all text-sm font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" /> Record Payment
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center mb-3">
            <DollarSign className="w-5 h-5 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">KES {totalCollected.toLocaleString()}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Total Collected</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">KES {totalExpected.toLocaleString()}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Expected ({studentCount} students)</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mb-3">
            <DollarSign className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">{pendingCount}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Pending Payments</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mb-3">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">{totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0}%</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Collection Rate</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="border-b border-slate-200 px-6">
          <div className="flex gap-6">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? "border-teal-600 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
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
                    {["Fee Category", "Amount (KES)", "Frequency"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {feeStructure.map(fee => (
                    <tr key={fee.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">{fee.category}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 font-semibold">{fee.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{fee.term}</td>
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
                    {["Student", "Category", "Amount", "Date", "Method", "Receipt", "Status"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                        <p className="font-medium">No payments recorded</p>
                        <p className="text-sm">Click "Record Payment" to add the first payment</p>
                      </td>
                    </tr>
                  ) : payments.map(p => {
                    const student = students.find(s => s.id === p.studentId);
                    return (
                      <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-4 py-3 text-sm font-medium text-slate-800">{student ? `${student.firstName} ${student.lastName}` : `Student #${p.studentId}`}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{p.category}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-slate-800">KES {p.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{p.date}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{p.method}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500 font-mono text-xs">{p.receipt}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.status === "Confirmed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{p.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Record Payment</h2>
              <button onClick={() => setShowPayment(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handlePaySubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Student *</label>
                <select value={payForm.student} onChange={e => setPayForm({ ...payForm, student: e.target.value })} required className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="">Select student</option>
                  {students.map(s => <option key={s.id} value={`${s.firstName} ${s.lastName}`}>{s.firstName} {s.lastName} ({s.class})</option>)}
                </select>
                {students.length === 0 && <p className="text-xs text-amber-600 mt-1">No students enrolled yet. Add students first.</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Fee Category</label>
                <select value={payForm.category} onChange={e => setPayForm({ ...payForm, category: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                  {feeStructure.map(f => <option key={f.id} value={f.category}>{f.category}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Amount (KES) *</label>
                <input type="number" value={payForm.amount} onChange={e => setPayForm({ ...payForm, amount: e.target.value })} required className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Payment Method</label>
                <select value={payForm.method} onChange={e => setPayForm({ ...payForm, method: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option>M-Pesa</option><option>Cash</option><option>Bank Transfer</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={students.length === 0} className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all text-sm font-medium flex-1 disabled:opacity-50 disabled:cursor-not-allowed">Record Payment</button>
                <button type="button" onClick={() => setShowPayment(false)} className="border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm font-medium">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
