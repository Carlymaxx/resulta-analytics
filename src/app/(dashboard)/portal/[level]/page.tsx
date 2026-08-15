"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EDUCATION_LEVELS, EducationLevel } from "@/context/AuthContext";
import { ArrowLeft, Users, UserCheck, FileText, TrendingUp, ClipboardList } from "lucide-react";

const VALID: EducationLevel[] = ["primary", "junior", "secondary"];

const QUICK_LINKS = [
  { href: "/students", label: "Students", icon: Users, desc: "Manage learners" },
  { href: "/teachers", label: "Teachers", icon: UserCheck, desc: "Manage staff" },
  { href: "/marks", label: "Marks & Reports", icon: ClipboardList, desc: "Enter marks, print reports & certificates" },
  { href: "/analytics", label: "Analytics", icon: TrendingUp, desc: "Performance trends" },
];

export default function PortalLevelPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = use(params);

  if (!VALID.includes(level as EducationLevel)) {
    notFound();
  }

  const meta = EDUCATION_LEVELS.find((l) => l.value === level)!;

  return (
    <div className="space-y-6">
      <Link href="/portal" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600">
        <ArrowLeft className="w-4 h-4" /> Back to Portal
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-800">{meta.label}</h1>
        <p className="text-slate-500 text-sm mt-1">{meta.description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all"
          >
            <div className="w-11 h-11 rounded-lg bg-teal-100 flex items-center justify-center mb-4">
              <link.icon className="w-5 h-5 text-teal-600" />
            </div>
            <div className="font-semibold text-slate-800">{link.label}</div>
            <div className="text-sm text-slate-500">{link.desc}</div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-2">Overview</h2>
        <p className="text-slate-500 text-sm">
          This is the {meta.label} area. Use the quick links above or the sidebar to manage records,
          enter results and view analytics for this level.
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700"
        >
          Go to full dashboard
        </Link>
      </div>
    </div>
  );
}
