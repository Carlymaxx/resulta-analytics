"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, EDUCATION_LEVELS, EducationLevel } from "@/context/AuthContext";
import { LEVEL_LABELS } from "@/lib/grading";
import { GraduationCap, BookOpen, School, ArrowRight, Megaphone, CheckCircle2, Lock, ChevronDown } from "lucide-react";

const LEVEL_META: Record<EducationLevel, { icon: typeof School; accent: string; badge: string; ring: string }> = {
  primary: { icon: BookOpen, accent: "bg-emerald-600", badge: "bg-emerald-100 text-emerald-700", ring: "ring-emerald-500" },
  junior: { icon: GraduationCap, accent: "bg-blue-600", badge: "bg-blue-100 text-blue-700", ring: "ring-blue-500" },
  secondary: { icon: School, accent: "bg-teal-600", badge: "bg-teal-100 text-teal-700", ring: "ring-teal-500" },
  other: { icon: School, accent: "bg-slate-600", badge: "bg-slate-100 text-slate-700", ring: "ring-slate-500" },
};

export default function PortalPage() {
  const router = useRouter();
  const { user, currentLevel, setCurrentLevel } = useAuth();
  const [showSwitcher, setShowSwitcher] = useState(false);

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Africa/Nairobi",
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
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSwitcher(!showSwitcher)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-all"
              >
                Switch Area
                <ChevronDown className={`w-4 h-4 transition-transform ${showSwitcher ? "rotate-180" : ""}`} />
              </button>
              {showSwitcher && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-20">
                  <div className="py-1">
                    {EDUCATION_LEVELS.map((lvl) => {
                      const isCurrent = currentLevel === lvl.value;
                      const labels = LEVEL_LABELS[lvl.value];
                      return (
                        <button
                          key={lvl.value}
                          onClick={() => {
                            setCurrentLevel(lvl.value);
                            router.push(`/portal/${lvl.value}`);
                            setShowSwitcher(false);
                          }}
                          className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 ${
                            isCurrent ? "bg-teal-50 dark:bg-teal-900/20" : ""
                          }`}
                        >
                          <div className="flex-1">
                            <div className={`font-medium ${isCurrent ? "text-teal-700 dark:text-teal-300" : "text-slate-800 dark:text-white"}`}>{labels.label}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{labels.description}</div>
                          </div>
                          {isCurrent && <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center">
              <GraduationCap className="w-9 h-9 text-white" />
            </div>
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
            const labels = LEVEL_LABELS[lvl.value];
            const isCurrent = currentLevel === lvl.value;
            const canAccess = !!user;

            const cardInner = (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${canAccess ? meta.accent : "bg-slate-300"} flex items-center justify-center`}>
                    {canAccess ? <Icon className="w-6 h-6 text-white" /> : <Lock className="w-6 h-6 text-white" />}
                  </div>
                  {isCurrent && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-teal-100 text-teal-700">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Current area
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-800">{labels.label}</h3>
                <p className="text-sm text-slate-500 mt-1">{labels.description}</p>
                {canAccess ? (
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-teal-600">
                    Enter area <ArrowRight className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-400">
                    <Lock className="w-4 h-4" /> Locked
                  </div>
                )}
              </>
            );

            const handleClick = () => {
              setCurrentLevel(lvl.value);
            };

            return canAccess ? (
              <Link
                key={lvl.value}
                href={`/portal/${lvl.value}`}
                onClick={handleClick}
                className={`group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all ${isCurrent ? `ring-2 ${meta.ring}` : ""}`}
              >
                {cardInner}
              </Link>
            ) : (
              <div
                key={lvl.value}
                title="You can only access your own area"
                className="bg-slate-50 rounded-2xl p-6 shadow-sm border border-slate-200 opacity-70 cursor-not-allowed"
              >
                {cardInner}
              </div>
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
