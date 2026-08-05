"use client";

import { useState } from "react";
import { BookMarked, Plus, X } from "lucide-react";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const subjects = [
  { code: "MAT", name: "Mathematics", type: "Compulsory", teachers: 4, avgScore: 68, students: 480 },
  { code: "ENG", name: "English", type: "Compulsory", teachers: 3, avgScore: 72, students: 480 },
  { code: "KIS", name: "Kiswahili", type: "Compulsory", teachers: 3, avgScore: 74, students: 480 },
  { code: "BIO", name: "Biology", type: "Compulsory", teachers: 3, avgScore: 65, students: 480 },
  { code: "CHE", name: "Chemistry", type: "Compulsory", teachers: 2, avgScore: 61, students: 380 },
  { code: "PHY", name: "Physics", type: "Compulsory", teachers: 2, avgScore: 63, students: 380 },
  { code: "HIS", name: "History", type: "Compulsory", teachers: 2, avgScore: 70, students: 480 },
  { code: "GEO", name: "Geography", type: "Compulsory", teachers: 2, avgScore: 71, students: 480 },
  { code: "CRE", name: "CRE", type: "Optional", teachers: 2, avgScore: 78, students: 240 },
  { code: "CS", name: "Computer Studies", type: "Optional", teachers: 2, avgScore: 76, students: 200 },
  { code: "BS", name: "Business Studies", type: "Optional", teachers: 2, avgScore: 69, students: 180 },
  { code: "AGR", name: "Agriculture", type: "Optional", teachers: 2, avgScore: 73, students: 160 },
  { code: "ART", name: "Art & Design", type: "Optional", teachers: 1, avgScore: 80, students: 120 },
  { code: "MUS", name: "Music", type: "Optional", teachers: 1, avgScore: 82, students: 100 },
];

const colorMap: Record<string, string> = {
  MAT: "bg-blue-100 text-blue-700",
  ENG: "bg-green-100 text-green-700",
  KIS: "bg-teal-100 text-teal-700",
  BIO: "bg-emerald-100 text-emerald-700",
  CHE: "bg-purple-100 text-purple-700",
  PHY: "bg-indigo-100 text-indigo-700",
  HIS: "bg-amber-100 text-amber-700",
  GEO: "bg-orange-100 text-orange-700",
  CRE: "bg-rose-100 text-rose-700",
  CS: "bg-cyan-100 text-cyan-700",
  BS: "bg-yellow-100 text-yellow-700",
  AGR: "bg-lime-100 text-lime-700",
  ART: "bg-pink-100 text-pink-700",
  MUS: "bg-violet-100 text-violet-700",
};

export default function SubjectsPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", code: "", type: "Compulsory" });

  const chartData = {
    labels: subjects.map(s => s.code),
    datasets: [
      {
        label: "Average Score (%)",
        data: subjects.map(s => s.avgScore),
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
          <h1 className="text-2xl font-bold text-slate-800">Subjects</h1>
          <p className="text-slate-500 text-sm mt-1">Manage school curriculum subjects</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Subject
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Subjects", value: "14", color: "text-teal-600", bg: "bg-teal-50" },
          { label: "Compulsory", value: "8", color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Optional", value: "6", color: "text-purple-600", bg: "bg-purple-50" },
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
        <h2 className="text-base font-semibold text-slate-800 mb-4">Average Scores by Subject</h2>
        <div className="h-56">
          <Bar data={chartData} options={{ ...chartOptions, maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Subject Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {subjects.map(s => (
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

      {/* Add Subject Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Add New Subject</h2>
              <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" placeholder="e.g. Mathematics" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject Code</label>
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
                <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex-1">Add Subject</button>
                <button type="button" onClick={() => setShowAdd(false)} className="border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
