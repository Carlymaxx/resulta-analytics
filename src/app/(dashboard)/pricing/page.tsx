"use client";

import { useState } from "react";
import { 
  Check, 
  X, 
  ArrowRight,
  Star,
  Users,
  Building,
  Crown,
  Zap
} from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    desc: "Perfect for individual teachers",
    icon: Star,
    features: [
      { name: "Up to 50 students", included: true },
      { name: "Basic analytics", included: true },
      { name: "Manual data entry", included: true },
      { name: "5 report templates", included: true },
      { name: "Email support", included: true },
      { name: "AI predictions", included: false },
      { name: "Parent portal", included: false },
      { name: "Custom branding", included: false },
      { name: "API access", included: false },
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Professional",
    price: "$49",
    period: "/month",
    desc: "Best for growing schools",
    icon: Zap,
    features: [
      { name: "Up to 500 students", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Import from spreadsheets", included: true },
      { name: "Unlimited reports", included: true },
      { name: "Priority support", included: true },
      { name: "AI predictions", included: true },
      { name: "Parent portal", included: true },
      { name: "Custom branding", included: false },
      { name: "API access", included: false },
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    desc: "For large institutions",
    icon: Crown,
    features: [
      { name: "Unlimited students", included: true },
      { name: "Full analytics suite", included: true },
      { name: "System integrations", included: true },
      { name: "Custom reports", included: true },
      { name: "24/7 dedicated support", included: true },
      { name: "AI predictions", included: true },
      { name: "Parent portal", included: true },
      { name: "Custom branding", included: true },
      { name: "API access", included: true },
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const faqs = [
  { q: "Can I switch plans later?", a: "Yes! You can upgrade or downgrade your plan at any time. We'll proration your billing." },
  { q: "Is there a free trial?", a: "Yes, our Professional plan comes with a 14-day free trial. No credit card required." },
  { q: "What payment methods do you accept?", a: "We accept all major credit cards, PayPal, and bank transfers for annual plans." },
  { q: "Can I cancel anytime?", a: "Absolutely. You can cancel your subscription anytime with no penalties." },
  { q: "Do you offer discounts for annual billing?", a: "Yes! Save 20% when you choose annual billing." },
  { q: "Is my data secure?", a: "We use enterprise-grade encryption and are GDPR compliant. Your data is always safe." },
];

export default function PricingPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Choose the plan that fits your school. All plans include a 14-day free trial.
        </p>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, i) => (
          <div 
            key={i} 
            className={`relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border-2 ${
              plan.popular ? 'border-teal-500' : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
            )}
            
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                plan.popular ? 'bg-teal-100 dark:bg-teal-900' : 'bg-slate-100 dark:bg-slate-700'
              }`}>
                <plan.icon className={`w-5 h-5 ${plan.popular ? 'text-teal-600' : 'text-slate-600 dark:text-slate-400'}`} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">{plan.name}</h3>
              </div>
            </div>
            
            <div className="mb-4">
              <span className="text-4xl font-bold text-slate-800 dark:text-white">{plan.price}</span>
              <span className="text-slate-500 dark:text-slate-400">{plan.period}</span>
            </div>
            
            <p className="text-slate-600 dark:text-slate-400 mb-6">{plan.desc}</p>
            
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, j) => (
                <li key={j} className="flex items-center gap-3">
                  {feature.included ? (
                    <Check className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  ) : (
                    <X className="w-5 h-5 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                  )}
                  <span className={feature.included ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}>
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>
            
            <button className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              plan.popular 
                ? 'bg-teal-600 text-white hover:bg-teal-700' 
                : 'border-2 border-teal-600 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900'
            }`}>
              {plan.cta} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Features Comparison */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-8 text-center">Compare Plans</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-4 px-4 text-slate-600 dark:text-slate-400">Feature</th>
                <th className="text-center py-4 px-4 text-slate-800 dark:text-white">Starter</th>
                <th className="text-center py-4 px-4 text-teal-600 font-bold">Professional</th>
                <th className="text-center py-4 px-4 text-slate-800 dark:text-white">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Max Students", "50", "500", "Unlimited"],
                ["Analytics", "Basic", "Advanced", "Full Suite"],
                ["Reports", "5 Templates", "Unlimited", "Custom"],
                ["AI Predictions", false, true, true],
                ["Parent Portal", false, true, true],
                ["Support", "Email", "Priority", "24/7 Dedicated"],
                ["API Access", false, false, true],
              ].map((row, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-700">
                  <td className="py-4 px-4 text-slate-700 dark:text-slate-300">{row[0]}</td>
                  <td className="py-4 px-4 text-center">
                    {typeof row[1] === 'boolean' ? (
                      row[1] ? <Check className="w-5 h-5 text-teal-500 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />
                    ) : <span className="text-slate-800 dark:text-white">{row[1]}</span>}
                  </td>
                  <td className="py-4 px-4 text-center bg-teal-50 dark:bg-teal-900/20">
                    {typeof row[2] === 'boolean' ? (
                      row[2] ? <Check className="w-5 h-5 text-teal-500 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />
                    ) : <span className="text-teal-600 font-medium">{row[2]}</span>}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {typeof row[3] === 'boolean' ? (
                      row[3] ? <Check className="w-5 h-5 text-teal-500 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />
                    ) : <span className="text-slate-800 dark:text-white">{row[3]}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQs */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-800 dark:text-white mb-2">{faq.q}</h3>
              <p className="text-slate-600 dark:text-slate-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-2xl p-12 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-teal-100 mb-8 max-w-xl mx-auto">
          Join 500+ schools already using Resulta Analytics to improve student outcomes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="inline-flex items-center gap-2 bg-white text-teal-600 px-8 py-3 rounded-xl font-semibold hover:bg-teal-50 transition-all">
            Start Free Trial <ArrowRight className="w-5 h-5" />
          </button>
          <button className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all">
            Schedule Demo
          </button>
        </div>
      </div>
    </div>
  );
}