"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Users, DollarSign, CheckCircle, Clock, X, Eye } from "lucide-react";

const payrollData = [
  { name: "Sarah Wanjiku", dept: "Academics", basic: 45000, allowances: 12000, deductions: 6800, status: "Paid" },
  { name: "James Otieno", dept: "Finance", basic: 55000, allowances: 15000, deductions: 8500, status: "Paid" },
  { name: "Grace Muthoni", dept: "Academics", basic: 42000, allowances: 10000, deductions: 6200, status: "Paid" },
  { name: "Peter Kamau", dept: "Academics", basic: 43000, allowances: 11000, deductions: 6400, status: "Pending" },
  { name: "Joyce Auma", dept: "Academics", basic: 40000, allowances: 9000, deductions: 5900, status: "Paid" },
  { name: "David Kipchoge", dept: "Transport", basic: 35000, allowances: 8000, deductions: 5200, status: "Paid" },
  { name: "Fatuma Hassan", dept: "Library", basic: 38000, allowances: 7500, deductions: 5500, status: "Pending" },
  { name: "Robert Njoroge", dept: "Academics", basic: 44000, allowances: 11500, deductions: 6600, status: "Paid" },
];

const stats = [
  { label: "Total Staff", value: "52", icon: Users, color: "bg-teal-100 text-teal-600" },
  { label: "Monthly Payroll", value: "KES 1.84M", icon: DollarSign, color: "bg-blue-100 text-blue-600" },
  { label: "Processed", value: "48", icon: CheckCircle, color: "bg-green-100 text-green-600" },
  { label: "Pending", value: "4", icon: Clock, color: "bg-amber-100 text-amber-600" },
];

export default function PayrollPage() {
  const { user } = useAuth();
  const schoolName = user?.school || "My School";
  const [activeTab, setActiveTab] = useState("payroll");
  const [selectedEmployee, setSelectedEmployee] = useState<typeof payrollData[0] | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Payroll Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage staff salaries, allowances, and payslips</p>
        </div>
        <div className="flex gap-2">
          <button className="border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">Export</button>
          <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium">Process All</button>
        </div>
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
        {["payroll", "payslips", "allowances"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === t ? "border-teal-600 text-teal-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "payroll" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {["Employee", "Department", "Basic (KES)", "Allowances", "Deductions", "Net Pay", "Status", "Action"].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payrollData.map((e, i) => {
                  const net = e.basic + e.allowances - e.deductions;
                  return (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-3 px-4 text-sm font-medium text-slate-800">{e.name}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{e.dept}</td>
                      <td className="py-3 px-4 text-sm font-mono text-slate-800">{e.basic.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm font-mono text-green-600">+{e.allowances.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm font-mono text-red-600">-{e.deductions.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm font-mono font-bold text-slate-800">{net.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${e.status === "Paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{e.status}</span>
                      </td>
                      <td className="py-3 px-4">
                        <button onClick={() => setSelectedEmployee(e)} className="flex items-center gap-1 text-teal-600 hover:text-teal-700 text-sm font-medium">
                          <Eye className="w-4 h-4" /> Payslip
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "payslips" && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-500 text-sm mb-4">Click Payslip on any employee in the Payroll tab to view their payslip preview.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {payrollData.map((e, i) => (
              <button key={i} onClick={() => setSelectedEmployee(e)} className="p-4 border border-slate-200 rounded-xl hover:border-teal-400 hover:bg-teal-50 transition-colors text-left">
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold mb-2">
                  {e.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="text-sm font-medium text-slate-800">{e.name}</div>
                <div className="text-xs text-slate-500">{e.dept}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === "allowances" && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Allowance Types</h3>
          <div className="space-y-3">
            {[
              { name: "House Allowance", amount: "KES 5,000", applies: "All Staff" },
              { name: "Transport Allowance", amount: "KES 3,000", applies: "Non-resident Staff" },
              { name: "Medical Allowance", amount: "KES 2,000", applies: "All Staff" },
              { name: "Teaching Allowance", amount: "KES 1,500", applies: "Teachers only" },
              { name: "Risk Allowance", amount: "KES 1,000", applies: "Security, Medical" },
            ].map((a, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <div className="font-medium text-slate-800">{a.name}</div>
                  <div className="text-xs text-slate-500">{a.applies}</div>
                </div>
                <div className="font-mono font-bold text-teal-700">{a.amount}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payslip Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">Payslip — {selectedEmployee.name}</h2>
              <button onClick={() => setSelectedEmployee(null)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center border-b border-slate-200 pb-4">
                <div className="text-sm font-semibold text-teal-700">{schoolName}</div>
                <div className="text-xs text-slate-500">Payslip for {new Date().toLocaleString("default", { month: "long", year: "numeric" })}</div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-600">Employee</span><span className="font-medium">{selectedEmployee.name}</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Department</span><span>{selectedEmployee.dept}</span></div>
                <div className="border-t border-slate-200 pt-2 mt-2">
                  <div className="flex justify-between"><span className="text-slate-600">Basic Salary</span><span className="font-mono">KES {selectedEmployee.basic.toLocaleString()}</span></div>
                  <div className="flex justify-between text-green-600"><span>Total Allowances</span><span className="font-mono">+ {selectedEmployee.allowances.toLocaleString()}</span></div>
                  <div className="flex justify-between text-red-600"><span>Total Deductions</span><span className="font-mono">- {selectedEmployee.deductions.toLocaleString()}</span></div>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-base">
                  <span>Net Pay</span>
                  <span className="text-teal-700 font-mono">KES {(selectedEmployee.basic + selectedEmployee.allowances - selectedEmployee.deductions).toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-slate-200">
              <button onClick={() => setSelectedEmployee(null)} className="flex-1 border border-slate-200 text-slate-700 py-2 rounded-lg hover:bg-slate-50 text-sm font-medium">Close</button>
              <button className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 text-sm font-medium">Download PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
