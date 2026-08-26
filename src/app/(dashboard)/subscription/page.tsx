"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { CreditCard, CheckCircle, Users, HardDrive, Smartphone, TrendingUp } from "lucide-react";

const plans = [
  {
    name: "Free Trial",
    price: "KES 0",
    period: "14 days",
    students: 50,
    color: "border-slate-200",
    badge: "bg-slate-100 text-slate-700",
    current: false,
    features: ["Up to 50 students", "Basic attendance", "Basic results entry", "Email support", "1 admin account"],
  },
  {
    name: "Starter",
    price: "KES 2,500",
    period: "/month",
    students: 200,
    color: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    current: false,
    features: ["Up to 200 students", "All core modules", "Results & analytics", "Email & SMS (200/mo)", "5 staff accounts", "PDF reports"],
  },
  {
    name: "Professional",
    price: "KES 5,000",
    period: "/month",
    students: 500,
    color: "border-teal-500",
    badge: "bg-teal-100 text-teal-700",
    current: true,
    features: ["Up to 500 students", "All modules included", "Advanced analytics", "AI features", "SMS (1,000/mo)", "20 staff accounts", "Priority support", "Custom branding"],
  },
  {
    name: "Enterprise",
    price: "KES 12,000",
    period: "/month",
    students: -1,
    color: "border-purple-300",
    badge: "bg-purple-100 text-purple-700",
    current: false,
    features: ["Unlimited students", "All modules + custom", "API access", "White-label", "Unlimited SMS", "Unlimited accounts", "Dedicated support", "SLA guarantee"],
  },
];

const billingHistory = [
  { date: "Nov 1, 2025", description: "Professional Plan - November 2025", amount: "KES 5,000", status: "Paid", invoice: "INV-2025-011", schoolId: "school-nairobi-high" },
  { date: "Oct 1, 2025", description: "Professional Plan - October 2025", amount: "KES 5,000", status: "Paid", invoice: "INV-2025-010", schoolId: "school-nairobi-high" },
  { date: "Sep 1, 2025", description: "Professional Plan - September 2025", amount: "KES 5,000", status: "Paid", invoice: "INV-2025-009", schoolId: "school-nairobi-high" },
  { date: "Aug 1, 2025", description: "Professional Plan - August 2025", amount: "KES 5,000", status: "Paid", invoice: "INV-2025-008", schoolId: "school-nairobi-high" },
  { date: "Jul 1, 2025", description: "Starter Plan - July 2025", amount: "KES 2,500", status: "Paid", invoice: "INV-2025-007", schoolId: "school-nairobi-high" },
  { date: "Jun 1, 2025", description: "Starter Plan - June 2025", amount: "KES 2,500", status: "Paid", invoice: "INV-2025-006", schoolId: "school-nairobi-high" },
];

const usage = [
  { label: "Students", used: 247, total: 500, icon: Users, color: "bg-teal-500", schoolId: "school-nairobi-high" },
  { label: "Storage", used: 2.4, total: 10, unit: "GB", icon: HardDrive, color: "bg-blue-500", schoolId: "school-nairobi-high" },
  { label: "SMS Credits", used: 450, total: 1000, icon: Smartphone, color: "bg-purple-500", schoolId: "school-nairobi-high" },
];

export default function SubscriptionPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("plans");
  const [selectedPlan, setSelectedPlan] = useState("Professional");

  const filteredBillingHistory = billingHistory.filter(b => !user?.schoolId || b.schoolId === user.schoolId);
  const filteredUsage = usage.filter(u => !user?.schoolId || u.schoolId === user.schoolId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Subscription</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your plan, billing, and usage</p>
        </div>
        <button className="border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm font-medium">Manage Billing</button>
      </div>

      {/* Current Plan Banner */}
      <div className="bg-teal-600 text-white rounded-xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
          <CreditCard className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-sm text-teal-100">Current Plan</div>
          <div className="text-xl font-bold">Professional — KES 5,000/month</div>
          <div className="text-sm text-teal-100">Next billing: January 1, 2026</div>
        </div>
        <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Upgrade</button>
      </div>

      {/* Usage */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {filteredUsage.map((u, i) => {
          const pct = Math.round((u.used / u.total) * 100);
          return (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <u.icon className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">{u.label}</span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-2xl font-bold text-slate-800 dark:text-white">{u.used}{u.unit || ""}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">/ {u.total}{u.unit || ""}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className={`h-2 rounded-full ${u.color} ${pct > 80 ? "bg-amber-500" : ""}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="text-xs text-slate-500 mt-1">{pct}% used</div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {["plans", "billing"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === t ? "border-teal-600 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
            {t === "plans" ? "Plan Comparison" : "Billing History"}
          </button>
        ))}
      </div>

      {activeTab === "plans" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map(p => (
            <div key={p.name} className={`bg-white rounded-xl p-5 shadow-sm border-2 ${p.current ? "border-teal-500" : p.color} relative`}>
              {p.current && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-teal-600 text-white text-xs px-3 py-1 rounded-full font-medium">Current Plan</span>
                </div>
              )}
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${p.badge}`}>{p.name}</div>
              <div>
                <span className="text-2xl font-bold text-slate-800 dark:text-white">{p.price}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">{p.period}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500 my-3">
                <Users className="w-3 h-3" />
                <span>{p.students === -1 ? "Unlimited students" : `Up to ${p.students} students`}</span>
              </div>
              <div className="space-y-2 mb-5">
                {p.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setSelectedPlan(p.name)}
                disabled={p.current}
                className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${p.current ? "bg-teal-600 text-white cursor-default" : "border border-slate-200 text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"}`}>
                {p.current ? "Current Plan" : selectedPlan === p.name ? "Selected" : "Upgrade"}
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "billing" && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200">
                <tr>{["Date", "Description", "Amount", "Status", "Invoice"].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider uppercase tracking-wider uppercase tracking-wider">{h}</th>
                ))}</tr>
              </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBillingHistory.map((b, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{b.date}</td>
                    <td className="py-3 px-4 text-sm text-slate-800">{b.description}</td>
                    <td className="py-3 px-4 text-sm font-mono font-bold text-slate-800">{b.amount}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{b.status}</span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="flex items-center gap-1 text-teal-600 hover:text-teal-700 text-xs font-medium">
                        <TrendingUp className="w-3 h-3" /> {b.invoice}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
        <div>
          <div className="font-medium text-red-800 text-sm">Cancel Subscription</div>
          <div className="text-xs text-red-600">Your access will remain until the end of the billing period.</div>
        </div>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-medium">Cancel Plan</button>
      </div>
    </div>
  );
}
