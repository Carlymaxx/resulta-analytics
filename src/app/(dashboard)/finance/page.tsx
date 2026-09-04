"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { DollarSign, Plus, X, TrendingUp, CreditCard, ExternalLink, CheckCircle2, Copy } from "lucide-react";
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
import { loadStudents, getStudentCount, logAudit, FeePayment, FeeStructure, savePayment, loadSettings } from "@/lib/schoolStore";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PAYSTACK_LINK = "https://paystack.shop/pay/carlymaxx";

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
  const [showPayOnline, setShowPayOnline] = useState(false);
  const [payOnlineStudent, setPayOnlineStudent] = useState<{ id: number; name: string; amount: number } | null>(null);
  const [payForm, setPayForm] = useState({ student: "", amount: "", method: "M-Pesa", category: "Tuition Fee" });
  const [students, setStudents] = useState<ReturnType<typeof loadStudents>>([]);
  const [payments, setPayments] = useState<FeePayment[]>([]);
  const [feeStructure, setFeeStructure] = useState<FeeStructure[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setStudents(loadStudents(user?.schoolId));
    setPayments(loadPaymentsStore(user?.schoolId));
    setFeeStructure(loadFeeStructure(user?.schoolId));
  }, [user?.schoolId]);

  const studentCount = getStudentCount(user?.schoolId);
  const totalCollected = payments.filter(p => p.status === "Confirmed").reduce((s, p) => s + p.amount, 0);
  const pendingCount = payments.filter(p => p.status === "Pending").length;
  const totalExpected = feeStructure.reduce((sum, f) => sum + (studentCount * f.amount), 0);
  const settings = user?.schoolId ? loadSettings(user.schoolId) : null;
  const currency = settings?.currency || "KES";

  const openPayOnline = (studentId: number, studentName: string, amount: number) => {
    setPayOnlineStudent({ id: studentId, name: studentName, amount });
    setShowPayOnline(true);
    if (user) {
      logAudit(
        { userId: user.id, userName: user.name, userRole: user.role, action: "PAYSTACK_INITIATED", module: "finance", details: `Initiated Paystack payment for ${studentName} — KES ${amount}` },
        user.schoolId
      );
    }
  };

  const copyLink = async () => {
    if (typeof navigator === "undefined") return;
    await navigator.clipboard.writeText(PAYSTACK_LINK);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        <div className="flex items-center gap-2">
          <a
            href={PAYSTACK_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => user && logAudit({ userId: user.id, userName: user.name, userRole: user.role, action: "PAYSTACK_OPENED", module: "finance", details: "Opened Paystack payment link" }, user.schoolId)}
            className="inline-flex items-center gap-2 bg-[#0BA4DD] text-white px-4 py-2 rounded-lg hover:bg-[#0995c9] transition-all text-sm font-medium"
          >
            <CreditCard className="w-4 h-4" /> Pay Online (Paystack) <ExternalLink className="w-3 h-3" />
          </a>
          <button onClick={() => setShowPayment(true)} className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" /> Record Payment
          </button>
        </div>
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
                    {["Student", "Category", "Amount", "Date", "Method", "Receipt", "Status", ""].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                        <p className="font-medium">No payments recorded</p>
                        <p className="text-sm">Click "Record Payment" to add the first payment, or use "Pay Online" for Paystack checkout.</p>
                      </td>
                    </tr>
                  ) : payments.map(p => {
                    const student = students.find(s => s.id === p.studentId);
                    const methodColor = p.method === "Paystack" ? "bg-blue-100 text-blue-700" : p.method === "M-Pesa" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700";
                    return (
                      <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-4 py-3 text-sm font-medium text-slate-800">{student ? `${student.firstName} ${student.lastName}` : `Student #${p.studentId}`}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{p.category}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-slate-800">{currency} {p.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{p.date}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${methodColor}`}>{p.method}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500 font-mono text-xs">{p.receipt}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.status === "Confirmed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{p.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          {p.status !== "Confirmed" && (
                            <button onClick={() => student && openPayOnline(student.id, `${student.firstName} ${student.lastName}`, p.amount)}
                              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-[#0BA4DD] text-white rounded hover:bg-[#0995c9]">
                              <CreditCard className="w-3 h-3" /> Pay Now
                            </button>
                          )}
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
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Amount ({currency}) *</label>
                <input type="number" value={payForm.amount} onChange={e => setPayForm({ ...payForm, amount: e.target.value })} required className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Payment Method</label>
                <select value={payForm.method} onChange={e => setPayForm({ ...payForm, method: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option>M-Pesa</option>
                  <option>Cash</option>
                  <option>Bank Transfer</option>
                  <option value="Paystack">Paystack (Card / Mobile Money)</option>
                </select>
              </div>
              {payForm.method === "Paystack" && (
                <div className="bg-[#0BA4DD]/10 border border-[#0BA4DD]/30 rounded-lg p-3 flex items-start gap-2">
                  <CreditCard className="w-4 h-4 text-[#0BA4DD] mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-slate-700">
                    After saving, the parent will be redirected to <span className="font-mono font-semibold">paystack.shop</span> to complete payment via card or mobile money.
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={students.length === 0} className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all text-sm font-medium flex-1 disabled:opacity-50 disabled:cursor-not-allowed">Record Payment</button>
                <button type="button" onClick={() => setShowPayment(false)} className="border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm font-medium">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPayOnline && payOnlineStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#0BA4DD] flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Pay with Paystack</h2>
                  <p className="text-xs text-slate-500">Card · Mobile Money · Bank Transfer</p>
                </div>
              </div>
              <button onClick={() => setShowPayOnline(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Student</span><span className="font-semibold text-slate-800">{payOnlineStudent.name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Amount</span><span className="font-semibold text-slate-800">{currency} {payOnlineStudent.amount.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">School</span><span className="font-semibold text-slate-800">{schoolName}</span></div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Payment Link</label>
                <div className="flex gap-2">
                  <input readOnly value={PAYSTACK_LINK} className="flex-1 px-3 py-2 border border-slate-200 rounded-lg font-mono text-xs bg-slate-50" />
                  <button onClick={copyLink} className="px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm font-medium flex items-center gap-1">
                    {copied ? <><CheckCircle2 className="w-4 h-4 text-green-600" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
                  </button>
                </div>
              </div>

              <a
                href={PAYSTACK_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#0BA4DD] text-white px-4 py-3 rounded-lg hover:bg-[#0995c9] transition-all text-sm font-medium"
              >
                <CreditCard className="w-4 h-4" /> Continue to Paystack <ExternalLink className="w-3 h-3" />
              </a>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
                <strong>Powered by Paystack.</strong> Secure payments via card, M-Pesa, Airtel Money, and bank transfer. Your payment is logged and confirmed automatically.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
