"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  GraduationCap,
  ArrowRight,
  Shield,
  Clock,
  Brain,
  CheckCircle
} from "lucide-react";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <main>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">Resulta Analytics</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-600 hover:text-teal-600 transition-colors">Features</a>
            <a href="#benefits" className="text-slate-600 hover:text-teal-600 transition-colors">Benefits</a>
            <a href="#about" className="text-slate-600 hover:text-teal-600 transition-colors">About</a>
          </nav>
          <button 
            onClick={() => setShowLogin(true)}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-all hover:scale-105"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-teal-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="fade-in">
              <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <GraduationCap className="w-4 h-4" />
                Academic Excellence Platform
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                Analyze & Predict
                <span className="text-teal-600"> Student Performance</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Transform academic data into actionable insights. Identify at-risk learners early and make data-driven decisions to improve educational outcomes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setShowLogin(true)}
                  className="inline-flex items-center justify-center gap-2 bg-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-teal-700 transition-all hover:scale-105"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="inline-flex items-center justify-center gap-2 bg-white text-teal-600 border-2 border-teal-600 px-8 py-4 rounded-xl font-semibold hover:bg-teal-50 transition-all">
                  Watch Demo
                </button>
              </div>
              <div className="flex items-center gap-8 mt-10 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-600" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-600" />
                  14-day free trial
                </div>
              </div>
            </div>
            <div className="relative slide-in">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-slate-800">Performance Overview</h3>
                    <p className="text-sm text-slate-500">Academic Year 2025-2026</p>
                  </div>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">+12%</span>
                </div>
                <div className="space-y-4">
                  {[
                    { subject: "Mathematics", score: 78, change: "+5%" },
                    { subject: "English", score: 82, change: "+3%" },
                    { subject: "Science", score: 71, change: "+8%" },
                    { subject: "History", score: 85, change: "+2%" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="w-24 text-sm text-slate-600">{item.subject}</span>
                      <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-teal-500 rounded-full transition-all duration-1000" 
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-800 w-12">{item.score}%</span>
                      <span className="text-xs text-green-600 font-medium">{item.change}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-teal-600 text-white p-6 rounded-2xl shadow-xl">
                <div className="text-3xl font-bold">94%</div>
                <div className="text-teal-200 text-sm">Prediction Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to analyze, predict, and improve student performance
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: "Visual Analytics",
                desc: "Interactive dashboards with charts and graphs showing performance trends over time."
              },
              {
                icon: Brain,
                title: "AI Predictions",
                desc: "Machine learning algorithms predict future academic outcomes based on historical data."
              },
              {
                icon: TrendingUp,
                title: "Trend Analysis",
                desc: "Identify patterns in student performance across subjects, classes, and time periods."
              },
              {
                icon: Users,
                title: "At-Risk Detection",
                desc: "Automatically identify learners who need early intervention before they fall behind."
              },
              {
                icon: Clock,
                title: "Real-Time Updates",
                desc: "Access the latest student data instantly with automatic synchronization."
              },
              {
                icon: Shield,
                title: "Secure & Private",
                desc: "Enterprise-grade security with role-based access control for all users."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-100">
                <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Why Schools Choose Resulta Analytics
              </h2>
              <div className="space-y-6">
                {[
                  { title: "For Teachers", desc: "Identify struggling students early and personalize interventions based on data-driven insights.", icon: "📚" },
                  { title: "For Administrators", desc: "Get comprehensive reports on school-wide performance and make informed strategic decisions.", icon: "🏫" },
                  { title: "For Parents", desc: "Stay informed about your child's progress with transparent performance updates.", icon: "👨‍👩‍👧" },
                  { title: "For Students", desc: "Track your own progress and receive feedback that helps you improve.", icon: "🎯" }
                ].map((benefit, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                    <span className="text-3xl">{benefit.icon}</span>
                    <div>
                      <h4 className="font-bold text-slate-800">{benefit.title}</h4>
                      <p className="text-slate-600 text-sm">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Impact Summary</h3>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: "2,500+", label: "Students Tracked" },
                    { value: "85%", label: "Accuracy Rate" },
                    { value: "40%", label: "Faster Insights" },
                    { value: "60%", label: "Early Interventions" }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/10 rounded-xl p-4">
                      <div className="text-3xl font-bold">{stat.value}</div>
                      <div className="text-teal-200 text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your School&apos;s Performance?
          </h2>
          <p className="text-xl text-slate-300 mb-10">
            Join hundreds of schools already using Resulta Analytics to improve educational outcomes.
          </p>
          <button 
            onClick={() => setShowLogin(true)}
            className="inline-flex items-center gap-2 bg-teal-500 text-white px-10 py-4 rounded-xl font-semibold hover:bg-teal-400 transition-all hover:scale-105 text-lg"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Resulta Analytics</span>
            </div>
            <p className="text-slate-400 text-sm">
              © 2025 Resulta Analytics. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLogin && (
        <div className="modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
              <button 
                onClick={() => setShowLogin(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input 
                  type="email" 
                  placeholder="teacher@school.edu"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="input-field"
                />
              </div>
              <button 
                type="submit"
                className="btn-primary w-full"
              >
                Sign In
              </button>
              <p className="text-center text-slate-500 text-sm">
                Don&apos;t have an account? <span className="text-teal-600 font-medium cursor-pointer">Sign up</span>
              </p>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}