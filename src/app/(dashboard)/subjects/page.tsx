"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookMarked, Plus, X, ChevronDown, CheckCircle, ArrowRight, BookOpen } from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuth } from "@/context/AuthContext";
import { LEARNING_AREAS_BY_LEVEL, LEVEL_LABELS, loadRecords, averageScore } from "@/lib/grading";
import { loadStudents, loadSettings, isOnboarded, logAudit } from "@/lib/schoolStore";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SUBJECT_META: Record<string, { code: string; type: "Compulsory" | "Optional" }> = {
  Mathematics: { code: "MAT", type: "Compulsory" },
  English: { code: "ENG", type: "Compulsory" },
  Kiswahili: { code: "KIS", type: "Compulsory" },
  "Science & Technology": { code: "SCI", type: "Compulsory" },
  "Social Studies": { code: "SST", type: "Compulsory" },
  "Religious Education": { code: "RE", type: "Compulsory" },
  "Creative Arts": { code: "CAR", type: "Compulsory" },
  "Physical Education": { code: "PE", type: "Compulsory" },
  Biology: { code: "BIO", type: "Compulsory" },
  Chemistry: { code: "CHE", type: "Compulsory" },
  Physics: { code: "PHY", type: "Compulsory" },
  History: { code: "HIS", type: "Compulsory" },
  Geography: { code: "GEO", type: "Compulsory" },
  CRE: { code: "CRE", type: "Optional" },
  "Business Studies": { code: "BS", type: "Optional" },
  "Trade Theory": { code: "TT", type: "Compulsory" },
  "Trade Practice": { code: "TP", type: "Compulsory" },
  Entrepreneurship: { code: "ENT", type: "Compulsory" },
  Sciences: { code: "SCI", type: "Compulsory" },
  Humanities: { code: "HUM", type: "Compulsory" },
  Languages: { code: "LAN", type: "Compulsory" },
  Science: { code: "SCI", type: "Compulsory" },
};

const colorMap: Record<string, string> = {
  MAT: "bg-blue-100 text-blue-700", ENG: "bg-green-100 text-green-700", KIS: "bg-teal-100 text-teal-700",
  BIO: "bg-emerald-100 text-emerald-700", CHE: "bg-purple-100 text-purple-700", PHY: "bg-indigo-100 text-indigo-700",
  SCI: "bg-cyan-100 text-cyan-700", HIS: "bg-amber-100 text-amber-700", GEO: "bg-orange-100 text-orange-700",
  CRE: "bg-rose-100 text-rose-700", RE: "bg-rose-100 text-rose-700", CAR: "bg-fuchsia-100 text-fuchsia-700",
  PE: "bg-green-100 text-green-700", SST: "bg-amber-100 text-amber-700", BS: "bg-yellow-100 text-yellow-700",
  TT: "bg-blue-100 text-blue-700", TP: "bg-blue-100 text-blue-700", ENT: "bg-purple-100 text-purple-700",
  HUM: "bg-orange-100 text-orange-700", LAN: "bg-pink-100 text-pink-700",
};

export default function SubjectsPage() {
  const { user, currentLevel, setCurrentLevel } = useAuth();
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);
  const [form, setForm] = useState({ name: "", code: "", type: "Compulsory" });
  const [configuredAreas, setConfiguredAreas] = useState<string[]>([]);
  const [records, setRecords] = useState<ReturnType<typeof loadRecords>>([]);
  const [students, setStudents] = useState<ReturnType<typeof loadStudents>>([]);

  useEffect(() => {
    if (!user) return;
    if (!isOnboarded(user.schoolId)) { router.push("/onboarding"); return; }
    const settings = loadSettings(user.schoolId);
    setConfiguredAreas(settings ? defaultAreasFor(settings.curriculum) : []);
    setRecords(loadRecords(user.schoolId));
    setStudents(loadStudents(user.schoolId));
  }, [user, router]);

  const levelLabels = LEVEL_LABELS[currentLevel];

  const areaStats = (area: string) => {
    const allScores = records.flatMap(r => r.marks.filter(m => m.subject === area).map(m => m.score));
    const studentsInArea = students.length;
    const avg = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;
    return { avg, students: studentsInArea };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.schoolId) return;
    const newArea = form.name.trim();
    if (!newArea) return;
    const next = Array.from(new Set([...configuredAreas, newArea]));
    setConfiguredAreas(next);
    const settings = loadSettings(user.schoolId);
    if (settings) saveConfiguredAreas(user.schoolId, settings, next);
    logAudit({ userId: user.id, userName: user.name, userRole: user.role, action: "CREATE", module: "subjects", details: `Added learning area: ${newArea}` }, user.schoolId);
    setShowAdd(false);
    setForm({ name: "", code: "", type: "Compulsory" });
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {configuredAreas.length === 0 && (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-slate-800 mb-1">No learning areas yet</h2>
              <p className="text-slate-600 text-sm mb-3">Add the subjects your school offers. You can also do this during onboarding.</p>
              <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-1.5 bg-teal-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-teal-700">
                <Plus className="w-3.5 h-3.5" /> Add your first learning area <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Learning Areas</h1>
          <p className="text-slate-500 text-sm mt-1">{levelLabels.description} · {configuredAreas.length} learning areas configured</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button onClick={() => setShowLevelDropdown(!showLevelDropdown)} className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm">
              {levelLabels.short} <ChevronDown className="w-4 h-4" />
            </button>
            {showLevelDropdown && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-20">
                <div className="py-1">
                  {Object.entries(LEVEL_LABELS).map(([key, labels]) => (
                    <button key={key} onClick={() => { setCurrentLevel(key as any); setShowLevelDropdown(false); }}
                      className={`w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 ${currentLevel === key ? "bg-teal-50 dark:bg-teal-900/20 text-teal-700 font-medium" : "text-slate-700"}`}>
                      {currentLevel === key && <CheckCircle className="w-4 h-4 text-teal-600" />}
                      <span>{labels.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button onClick={() => setShowAdd(true)} className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Learning Area
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center mb-3">
            <BookMarked className="w-5 h-5 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">{configuredAreas.length}</div>
          <div className="text-sm text-slate-500">Total Learning Areas</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
            <CheckCircle className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">{configuredAreas.filter(a => SUBJECT_META[a]?.type === "Compulsory").length}</div>
          <div className="text-sm text-slate-500">Compulsory</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mb-3">
            <BookOpen className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">{configuredAreas.filter(a => SUBJECT_META[a]?.type === "Optional").length}</div>
          <div className="text-sm text-slate-500">Optional</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-3">
            <BookMarked className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">{students.length}</div>
          <div className="text-sm text-slate-500">Enrolled Students</div>
        </div>
      </div>

      {configuredAreas.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {configuredAreas.map(area => {
            const meta = SUBJECT_META[area] || { code: area.substring(0, 3).toUpperCase(), type: "Compulsory" as const };
            const stats = areaStats(area);
            return (
              <div key={area} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold ${colorMap[meta.code] || "bg-slate-100 text-slate-700"}`}>{meta.code}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${meta.type === "Compulsory" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"}`}>{meta.type}</span>
                </div>
                <div className="text-base font-semibold text-slate-800 mb-3">{area}</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Avg Score</span>
                    <span className="font-semibold text-slate-800">{stats.avg > 0 ? `${stats.avg}%` : "—"}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${stats.avg}%` }} />
                  </div>
                  <div className="flex justify-between text-slate-500 text-xs">
                    <span>Students: {stats.students}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Add Learning Area</h2>
              <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Learning Area Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-2.5 border border-slate-200 rounded-lg" placeholder="e.g. Mathematics" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg">
                  <option>Compulsory</option><option>Optional</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 text-sm font-medium flex-1">Add Learning Area</button>
                <button type="button" onClick={() => setShowAdd(false)} className="border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 text-sm font-medium">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function defaultAreasFor(curriculum: string): string[] {
  if (curriculum === "CBC") return ["Mathematics", "English", "Kiswahili", "Science & Technology", "Social Studies"];
  if (curriculum === "KCSE") return ["Mathematics", "English", "Kiswahili", "Biology", "Chemistry", "Physics"];
  if (curriculum === "IGCSE") return ["Mathematics", "English", "Sciences", "Humanities"];
  if (curriculum === "TVET") return ["Trade Theory", "Trade Practice", "Mathematics", "English"];
  return ["Mathematics", "English", "Science"];
}

function saveConfiguredAreas(schoolId: string, settings: any, areas: string[]) {
  if (typeof window === "undefined") return;
  const key = `resulta_learning_areas_${schoolId}`;
  localStorage.setItem(key, JSON.stringify(areas));
  settings.learningAreas = areas;
  const settingsKey = `resulta_school_settings_${schoolId}`;
  localStorage.setItem(settingsKey, JSON.stringify(settings));
}
