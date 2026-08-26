"use client";

import { useState } from "react";
import { BookMarked, Plus, X, ChevronDown, CheckCircle } from "lucide-react";
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
import { CLASSES_BY_LEVEL, LEVEL_LABELS, LEARNING_AREAS_BY_LEVEL, ASSESSMENT_BY_LEVEL } from "@/lib/grading";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Learning Area metadata: maps learning area name to code + type
// Codes are level-agnostic labels; the same subject name across levels keeps its code
const SUBJECT_META: Record<string, { code: string; type: "Compulsory" | "Optional" }> = {
  Mathematics: { code: "MAT", type: "Compulsory" },
  English: { code: "ENG", type: "Compulsory" },
  Kiswahili: { code: "KIS", type: "Compulsory" },
  Science: { code: "SCI", type: "Compulsory" },
  "Integrated Science": { code: "ISCI", type: "Compulsory" },
  "Social Studies": { code: "SST", type: "Compulsory" },
  Biology: { code: "BIO", type: "Compulsory" },
  Chemistry: { code: "CHE", type: "Compulsory" },
  Physics: { code: "PHY", type: "Compulsory" },
  History: { code: "HIS", type: "Compulsory" },
  Geography: { code: "GEO", type: "Compulsory" },
  CRE: { code: "CRE", type: "Optional" },
  "Christian Religious Education": { code: "CRE", type: "Compulsory" },
  Agriculture: { code: "AGR", type: "Optional" },
  "Creative Arts and Sports": { code: "CAS", type: "Optional" },
  "Pre-Technical Studies": { code: "PTS", type: "Optional" },
  "Computer Studies": { code: "CS", type: "Optional" },
  Commerce: { code: "COM", type: "Optional" },
  Literature: { code: "LIT", type: "Optional" },
  "Creative Arts": { code: "CAR", type: "Optional" },
  "Pre-Primary Activities": { code: "PPA", type: "Optional" },
  "Physical Education": { code: "PE", type: "Optional" },
  "Religious Education": { code: "RE", type: "Compulsory" },
  "Home Science": { code: "HS", type: "Optional" },
  "Business Studies": { code: "BS", type: "Optional" },
  "Art & Design": { code: "ART", type: "Optional" },
  Music: { code: "MUS", type: "Optional" },
};

const colorMap: Record<string, string> = {
  MAT: "bg-blue-100 text-blue-700",
  ENG: "bg-green-100 text-green-700",
  KIS: "bg-teal-100 text-teal-700",
  BIO: "bg-emerald-100 text-emerald-700",
  CHE: "bg-purple-100 text-purple-700",
  PHY: "bg-indigo-100 text-indigo-700",
  SCI: "bg-cyan-100 text-cyan-700",
  ISCI: "bg-cyan-100 text-cyan-700",
  HIS: "bg-amber-100 text-amber-700",
  GEO: "bg-orange-100 text-orange-700",
  CRE: "bg-rose-100 text-rose-700",
  AGR: "bg-lime-100 text-lime-700",
  CAS: "bg-fuchsia-100 text-fuchsia-700",
  PTS: "bg-yellow-100 text-yellow-700",
  CS: "bg-sky-100 text-sky-700",
  COM: "bg-yellow-100 text-yellow-700",
  LIT: "bg-pink-100 text-pink-700",
  CAR: "bg-fuchsia-100 text-fuchsia-700",
  PPA: "bg-lime-100 text-lime-700",
  PE: "bg-green-100 text-green-700",
  RE: "bg-rose-100 text-rose-700",
  HS: "bg-orange-100 text-orange-700",
  BS: "bg-yellow-100 text-yellow-700",
  ART: "bg-pink-100 text-pink-700",
  MUS: "bg-violet-100 text-violet-700",
  SST: "bg-amber-100 text-amber-700",
};

export default function SubjectsPage() {
  const { currentLevel, setCurrentLevel } = useAuth();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", code: "", type: "Compulsory" });
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);

  const levelLearningAreas = LEARNING_AREAS_BY_LEVEL[currentLevel] || LEARNING_AREAS_BY_LEVEL.junior;
  const levelLabels = LEVEL_LABELS[currentLevel];

  // Build the learning areas display array from level-specific list + metadata
  const learningAreasWithMeta = levelLearningAreas.map((name, idx) => {
    const meta = SUBJECT_META[name] || { code: name.substring(0, 3).toUpperCase(), type: "Compulsory" as const };
    return {
      id: idx,
      code: meta.code,
      name,
      type: meta.type,
      teachers: 2,
      avgScore: 65 + (idx % 5) * 3,
      students: 120 + idx * 20,
    };
  });

  const chartData = {
    labels: learningAreasWithMeta.map(s => s.code),
    datasets: [
      {
        label: "Average Score (%)",
        data: learningAreasWithMeta.map(s => s.avgScore),
        backgroundColor: "rgba(20, 184, 166, 0.7)",
        borderColor: "rgb(20, 184, 166)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true, max: 100, grid: { color: "#f1f5f9" } },
      x: { grid: { display: false } },
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAdd(false);
    setForm({ name: "", code: "", type: "Compulsory" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold text-slate-800">Learning Areas</h1>
           <p className="text-slate-500 text-sm mt-1">{levelLabels.description} — {levelLearningAreas.length} learning areas</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLevelDropdown(!showLevelDropdown)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition-all"
            >
              {levelLabels.short}
              <ChevronDown className="w-4 h-4" />
            </button>
            {showLevelDropdown && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-20">
                <div className="py-1">
                  {Object.entries(LEVEL_LABELS).map(([key, labels]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setCurrentLevel(key as any);
                        setShowLevelDropdown(false);
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 ${
                        currentLevel === key ? "bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 font-medium" : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {currentLevel === key && <CheckCircle className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
                      <span>{labels.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button onClick={() => setShowAdd(true)} className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Learning Area
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
           { label: "Total Learning Areas", value: learningAreasWithMeta.length, color: "text-teal-600", bg: "bg-teal-50" },
           { label: "Compulsory", value: learningAreasWithMeta.filter(s => s.type === "Compulsory").length, color: "text-blue-600", bg: "bg-blue-50" },
           { label: "Optional", value: learningAreasWithMeta.filter(s => s.type === "Optional").length, color: "text-purple-600", bg: "bg-purple-50" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
              <BookMarked className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className="text-2xl font-bold text-slate-800">{s.value}</div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
         <h2 className="text-base font-semibold text-slate-800 mb-4">Average Scores by Learning Area</h2>
        <div className="h-56">
          <Bar data={chartData} options={{ ...chartOptions, maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Learning Area Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
         {learningAreasWithMeta.map(s => (
          <div key={s.code} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <span className={`px-2 py-1 rounded-lg text-xs font-bold ${colorMap[s.code]}`}>{s.code}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.type === "Compulsory" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"}`}>{s.type}</span>
            </div>
            <div className="text-base font-semibold text-slate-800 mb-3">{s.name}</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Avg Score</span>
                <span className="font-semibold text-slate-800">{s.avgScore}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${s.avgScore}%` }} />
              </div>
              <div className="flex justify-between text-slate-500">
                <span>{s.teachers} teachers</span>
                <span>{s.students} students</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Learning Area Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
               <h2 className="text-lg font-semibold text-slate-800">Add New Learning Area</h2>
              <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Learning Area Name</label>
                 <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" placeholder="e.g. Mathematics" />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Learning Area Code</label>
                 <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" placeholder="e.g. MAT" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500">
                  <option>Compulsory</option>
                  <option>Optional</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                 <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex-1">Add Learning Area</button>
                <button type="button" onClick={() => setShowAdd(false)} className="border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
