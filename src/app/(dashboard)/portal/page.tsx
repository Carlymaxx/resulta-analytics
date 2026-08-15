"use client";

import Link from "next/link";
import { useAuth, EDUCATION_LEVELS, EducationLevel } from "@/context/AuthContext";
import { GraduationCap, BookOpen, School, ArrowRight, Megaphone, CheckCircle2 } from "lucide-react";

const LEVEL_META: Record<EducationLevel, { icon: typeof School; accent: string; badge: string; ring: string }> = {
  primary: { icon: BookOpen, accent: "bg-emerald-600", badge: "bg-emerald-100 text-emerald-700", ring: "ring-emerald-500" },
  junior: { icon: GraduationCap, accent: "bg-blue-600", badge: "bg-blue-100 text-blue-700", ring: "ring-blue-500" },
  secondary: { icon: School, accent: "bg-teal-600", badge: "bg-teal-100 text-teal-700", ring: "ring-teal-500" },
};

export default function PortalPage() {
  const { user } = useAuth();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8">
      {/* Header banner */}
      <div className="rounded-2xl bg-gradient-to-r from-teal-700 to-teal-500 text-white p-8 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-teal-100 text-sm">{today}</p>
            <h1 className="text-3xl font-bold mt-1">Resulta Analytics Portal</h1>
            <p className="text-teal-100 mt-2">
              You are signed in as{" "}
              <span className="font-semibold text-white">{user?.name || "Guest"}</span>
              {user?.role && <span className="capitalize"> ({user.role.replace("_", " ")})</span>}
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center">
            <GraduationCap className="w-9 h-9 text-white" />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-1">Choose an area</h2>
        <p className="text-slate-500 text-sm mb-4">Select the education level you want to manage.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EDUCATION_LEVELS.map((lvl) => {
            const meta = LEVEL_META[lvl.value];
            const Icon = meta.icon;
            const isMine = user?.level === lvl.value;
            return (
              <Link
                key={lvl.value}
                href={`/portal/${lvl.value}`}
                className={`group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all ${isMine ? `ring-2 ${meta.ring}` : ""}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${meta.accent} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {isMine && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-teal-100 text-teal-700">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Your area
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-800">{lvl.label}</h3>
                <p className="text-sm text-slate-500 mt-1">{lvl.description}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-teal-600 group-hover:gap-3 transition-all">
                  Enter area <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Announcements */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-amber-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Important Announcements</h2>
        </div>
        <p className="text-slate-500 text-sm">Check back for important updates and announcements.</p>
      </div>
    </div>
  );
}
