"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { CreditCard, CheckCircle, Users, HardDrive, Smartphone, ExternalLink } from "lucide-react";
import { getStudentCount } from "@/lib/schoolStore";

const PAYSTACK_LINK = "https://paystack.shop/pay/carlymaxx";

const plans = [
  {
    name: "Free Trial",
    price: "KES 0",
    period: "14 days",
    students: 50,
    color: "border-slate-200",
    badge: "bg-slate-100 text-slate-700",
    current: true,
    features: ["Up to 50 students", "Basic attendance", "Basic results entry", "Email support", "1 admin account"],
  },
  {
    name: "Starter",
    price: "KES 2,500",
    period: "/month",
    students: 200,
    color: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    features: ["Up to 200 students", "All core modules", "Results & analytics", "Email & SMS (200/mo)", "5 staff accounts", "PDF reports"],
  },
  {
    name: "Professional",
    price: "KES 5,000",
    period: "/month",
    students: 500,
    color: "border-teal-500",
    badge: "bg-teal-100 text-teal-700",
    features: ["Up to 500 students", "All modules included", "Advanced analytics", "AI features", "SMS (1,000/mo)", "20 staff accounts", "Priority support", "Custom branding"],
  },
  {
    name: "Enterprise",
    price: "KES 12,000",
    period: "/month",
    students: -1,
    color: "border-purple-300",
    badge: "bg-purple-100 text-purple-700",
    features: ["Unlimited students", "All modules + custom", "API access", "White-label", "Unlimited SMS", "Unlimited accounts", "Dedicated support", "SLA guarantee"],
  },
];

export default function SubscriptionPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("plans");
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    setStudentCount(getStudentCount(user?.schoolId));
  }, [user?.schoolId]);

  const nextBilling = new Date();
  nextBilling.setMonth(nextBilling.getMonth() + 1);
  nextBilling.setDate(1);
  const nextBillingStr = nextBilling.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Subscription</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your plan, billing, and usage</p>
        </div>
        <button className="border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm font-medium">Manage Billing</button>
      </div>

      <div className="bg-teal-600 text-white rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <CreditCard className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-sm text-teal-100">Current Plan</div>
          <div className="text-xl font-bold">Free Trial — 14 days</div>
          <div className="text-sm text-teal-100">Next billing: {nextBillingStr}</div>
        </div>
        <a href={PAYSTACK_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-teal-700 hover:bg-teal-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
          <CreditCard className="w-4 h-4" /> Pay with Paystack <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Students</span>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-2xl font-bold text-slate-800 dark:text-white">{studentCount}</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">/ 50 (Free Trial limit)</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="h-2 rounded-full bg-teal-500" style={{ width: `${Math.min(100, (studentCount / 50) * 100)}%` }} />
          </div>
          <div className="text-xs text-slate-500 mt-1">{Math.round((studentCount / 50) * 100)}% used</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <HardDrive className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Storage</span>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-2xl font-bold text-slate-800 dark:text-white">0</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">MB / 100 MB</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="h-2 rounded-full bg-blue-500" style={{ width: `0%` }} />
          </div>
          <div className="text-xs text-slate-500 mt-1">0% used</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <Smartphone className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">SMS Credits</span>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-2xl font-bold text-slate-800 dark:text-white">0</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">/ 100</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="h-2 rounded-full bg-purple-500" style={{ width: `0%` }} />
          </div>
          <div className="text-xs text-slate-500 mt-1">0% used</div>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        <button onClick={() => setActiveTab("plans")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "plans" ? "border-teal-600 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
          Plan Comparison
        </button>
      </div>

      {activeTab === "plans" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map(p => (
            <div key={p.name} className={`bg-white rounded-xl p-5 shadow-sm border-2 ${p.color} relative`}>
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
              <a href={PAYSTACK_LINK} target="_blank" rel="noopener noreferrer"
                className={`w-full py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center justify-center gap-1 ${p.current ? "bg-teal-600 text-white cursor-default" : "bg-[#0BA4DD] text-white hover:bg-[#0995c9]"}`}>
                {p.current ? "Current Plan" : <>Subscribe <ExternalLink className="w-3 h-3" /></>}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
