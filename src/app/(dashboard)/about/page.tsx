"use client";

import { useState } from "react";
import { 
  Target, 
  Eye, 
  Users, 
  Award, 
  TrendingUp, 
  Shield,
  Clock,
  Heart,
  Sparkles,
  CheckCircle,
  ArrowRight
} from "lucide-react";

const stats = [
  { value: "500+", label: "Schools", icon: Building },
  { value: "50K+", label: "Students", icon: Users },
  { value: "95%", label: "Accuracy", icon: Target },
  { value: "24/7", label: "Support", icon: Clock },
];

const team = [
  { name: "Dr. Sarah Johnson", role: "CEO & Founder", image: "SJ", bio: "Former education minister with 20+ years in ed-tech" },
  { name: "Michael Chen", role: "CTO", image: "MC", bio: "AI/ML expert from Stanford" },
  { name: "Emily Davis", role: "Head of Product", image: "ED", bio: "Former product lead at major LMS company" },
  { name: "James Wilson", role: "Head of Sales", image: "JW", bio: "15 years in enterprise SaaS sales" },
];

const values = [
  { icon: Heart, title: "Student-Centered", desc: "Every feature designed with students' success in mind" },
  { icon: Shield, title: "Data Security", desc: "Your data is protected with enterprise-grade security" },
  { icon: TrendingUp, title: "Continuous Innovation", desc: "We constantly improve based on user feedback" },
  { icon: Sparkles, title: "Excellence", desc: "We strive for the highest quality in everything we do" },
];

export default function AboutPage() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="text-center py-16 px-4">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">About Resulta Analytics</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
          Empowering schools with data-driven insights to improve student outcomes
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-xl flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Our Mission</h2>
          <p className="text-slate-600 dark:text-slate-400">
            To transform education through accessible, actionable analytics that help educators identify at-risk students early and provide targeted support for success.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mb-4">
            <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Our Vision</h2>
          <p className="text-slate-600 dark:text-slate-400">
            A world where every student has access to personalized learning support, and every educator has the tools to make data-driven decisions that transform lives.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: "500+", label: "Schools Using Us", icon: "🏫" },
          { value: "50,000+", label: "Students Tracked", icon: "👨‍🎓" },
          { value: "95%", label: "Prediction Accuracy", icon: "🎯" },
          { value: "24/7", label: "Support Available", icon: "💬" },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-teal-600">{stat.value}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Story */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Our Story</h2>
        <div className="space-y-4 text-slate-600 dark:text-slate-400">
          <p>
            Resulta Analytics was founded in 2022 by Dr. Sarah Johnson, a former education minister who witnessed firsthand the challenges schools face in tracking student progress.
          </p>
          <p>
            Seeing many students fall through the cracks due to lack of early intervention, she assembled a team of education experts and technologists to build a solution.
          </p>
          <p>
            Today, we&apos;re proud to serve over 500 schools worldwide, helping educators identify at-risk students earlier and provide targeted support that makes a real difference.
          </p>
        </div>
      </div>

      {/* Values */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 text-center">Our Values</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {values.map((value, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center mb-4">
                <value.icon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white mb-2">{value.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 text-center">Meet Our Team</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {member.image}
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white">{member.name}</h3>
              <p className="text-teal-600 text-sm mb-2">{member.role}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-2xl p-12 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Join Us in Transforming Education</h2>
        <p className="text-teal-100 mb-8 max-w-2xl mx-auto">
          Start your free trial today and see how Resulta Analytics can help your school improve student outcomes.
        </p>
        <button className="inline-flex items-center gap-2 bg-white text-teal-600 px-8 py-3 rounded-xl font-semibold hover:bg-teal-50 transition-all">
          Get Started Free <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function Building({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  );
}