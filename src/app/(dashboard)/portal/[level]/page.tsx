"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useAuth, EDUCATION_LEVELS, EducationLevel } from "@/context/AuthContext";
import { ArrowLeft, Users, UserCheck, ClipboardList, TrendingUp, Lock, Award } from "lucide-react";

const VALID: EducationLevel[] = ["primary", "junior", "secondary"];

const QUICK_LINKS = [
  { href: "/students", label: "Students", icon: Users, desc: "Manage learners" },
  { href: "/teachers", label: "Teachers", icon: UserCheck, desc: "Manage staff" },
  { href: "/marks", label: "Marks & Reports", icon: ClipboardList, desc: "Enter marks, print reports & certificates" },
  { href: "/analytics", label: "Analytics", icon: TrendingUp, desc: "Performance trends" },
];

// National assessments per level
const ASSESSMENTS: Record<EducationLevel, { code: string; name: string }[]> = {
  primary: [{ code: "KPSEA", name: "Kenya Primary School Education Assessment" }],
  junior: [{ code: "KJSEA", name: "Kenya Junior School Education Assessment" }],
  secondary: [{ code: "KCSE", name: "Kenya Certificate of Secondary Education" }],
};

export default function PortalLevelPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = use(params);
  const { user } = useAuth();

  if (!VALID.includes(level as EducationLevel)) {
    notFound();
  }

  const lvl = level as EducationLevel;
  const meta = EDUCATION_LEVELS.find((l) => l.value === lvl)!;
  const canAccess = user?.role === "superadmin" || user?.level === lvl;

  if (!canAccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-xl p-10 shadow-sm border border-slate-200 text-center max-w-sm">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Area Locked</h2>
          <p className="text-slate-500 text-sm mb-6">
            You can only access your own registered area. This is the <span className="font-semibold">{meta.label}</span> area.
          </p>
          <Link href="/portal" className="inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700">
            <ArrowLeft className="w-4 h-4" /> Back to Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/portal" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600">
        <ArrowLeft className="w-4 h-4" /> Back to Portal
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-800">{meta.label}</h1>
        <p className="text-slate-500 text-sm mt-1">{meta.description}</p>
      </div>

      {/* National assessments */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-teal-600" />
          <h2 className="text-lg font-bold text-slate-800">National Assessments</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ASSESSMENTS[lvl].map((a) => (
            <Link
              key={a.code}
              href="/marks"
              className="group flex items-center justify-between border border-slate-200 rounded-lg p-4 hover:border-teal-500 hover:bg-teal-50 transition-all"
            >
              <div>
                <div className="font-bold text-slate-800">{a.code}</div>
                <div className="text-sm text-slate-500">{a.name}</div>
              </div>
              <span className="text-xs font-medium text-teal-600 group-hover:underline">Enter marks →</span>
            </Link>
          ))}
        </div>
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
          enter marks and generate printable reports & certificates for this level.
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
