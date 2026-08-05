"use client";

import { useState } from "react";
import { ClipboardList, Zap, CheckCircle, Database, Plus, X, AlertTriangle } from "lucide-react";

const exams = [
  { title: "Mathematics Mid-Term Exam", subject: "Mathematics", class: "Form 3", date: "Dec 10, 2025", duration: 90, questions: 40, status: "Upcoming" },
  { title: "English Comprehension Test", subject: "English", class: "Form 2", date: "Dec 5, 2025", duration: 60, questions: 30, status: "Active" },
  { title: "Biology End of Term", subject: "Biology", class: "Form 4", date: "Dec 12, 2025", duration: 120, questions: 50, status: "Upcoming" },
  { title: "Physics Quiz - Forces", subject: "Physics", class: "Form 3", date: "Nov 28, 2025", duration: 45, questions: 20, status: "Active" },
  { title: "History CAT 2", subject: "History", class: "Form 1", date: "Nov 20, 2025", duration: 60, questions: 25, status: "Completed" },
  { title: "Geography Term Test", subject: "Geography", class: "Form 2", date: "Nov 15, 2025", duration: 60, questions: 30, status: "Completed" },
];

const questionBank = [
  { subject: "Mathematics", count: 120, topics: ["Algebra", "Geometry", "Calculus", "Statistics"] },
  { subject: "English", count: 85, topics: ["Grammar", "Comprehension", "Essay Writing", "Literature"] },
  { subject: "Biology", count: 95, topics: ["Cell Biology", "Genetics", "Ecology", "Human Physiology"] },
  { subject: "Physics", count: 80, topics: ["Mechanics", "Electricity", "Waves", "Optics"] },
  { subject: "History", count: 70, topics: ["African History", "World Wars", "Kenya History", "Independence"] },
];

const completedResults = [
  { exam: "History CAT 2", class: "Form 1", students: 45, avg: 72, highest: 96, lowest: 38, date: "Nov 20, 2025" },
  { exam: "Geography Term Test", class: "Form 2", students: 52, avg: 68, highest: 92, lowest: 42, date: "Nov 15, 2025" },
];

const stats = [
  { label: "Total Exams", value: "18", icon: ClipboardList, color: "bg-teal-100 text-teal-600" },
  { label: "Active Now", value: "2", icon: Zap, color: "bg-red-100 text-red-600" },
  { label: "Completed", value: "14", icon: CheckCircle, color: "bg-green-100 text-green-600" },
  { label: "Question Bank", value: "450+", icon: Database, color: "bg-purple-100 text-purple-600" },
];

export default function CBTPage() {
  const [activeTab, setActiveTab] = useState("exams");
  const [showModal, setShowModal] = useState(false);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  const activeExams = exams.filter(e => e.status === "Active");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">CBT Examinations</h1>
          <p className="text-sm text-slate-500 mt-1">Computer-based testing, question bank, and results</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> Create Exam
        </button>
      </div>

      {/* Active Exam Banner */}
      {activeExams.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-red-800">{activeExams.length} Exam{activeExams.length > 1 ? "s" : ""} Currently Live</div>
            <div className="text-sm text-red-600">{activeExams.map(e => e.title).join(" · ")}</div>
          </div>
          <span className="flex items-center gap-1 text-xs bg-red-600 text-white px-3 py-1 rounded-full font-medium">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{s.value}</div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {["exams", "questions", "results"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === t ? "border-teal-600 text-teal-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
            {t === "exams" ? "Exams" : t === "questions" ? "Question Bank" : "Results"}
          </button>
        ))}
      </div>

      {activeTab === "exams" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>{["Title", "Subject", "Class", "Date", "Duration", "Questions", "Status"].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {exams.map((e, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-3 px-4 text-sm font-medium text-slate-800">{e.title}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{e.subject}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{e.class}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{e.date}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{e.duration} min</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{e.questions}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${e.status === "Active" ? "bg-red-100 text-red-700" : e.status === "Upcoming" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>{e.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "questions" && (
        <div className="space-y-3">
          {questionBank.map((qb, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <button onClick={() => setExpandedSubject(expandedSubject === qb.subject ? null : qb.subject)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                    <Database className="w-4 h-4 text-teal-600" />
                  </div>
                  <span className="font-medium text-slate-800">{qb.subject}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono font-bold text-teal-700">{qb.count} questions</span>
                  <span className="text-slate-400">{expandedSubject === qb.subject ? "▲" : "▼"}</span>
                </div>
              </button>
              {expandedSubject === qb.subject && (
                <div className="px-4 pb-4 border-t border-slate-100">
                  <div className="flex flex-wrap gap-2 pt-3">
                    {qb.topics.map(topic => (
                      <span key={topic} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">{topic}</span>
                    ))}
                  </div>
                  <button className="mt-3 text-sm text-teal-600 font-medium hover:underline">+ Add Question</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === "results" && (
        <div className="space-y-4">
          {completedResults.map((r, i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-800">{r.exam}</h3>
                  <p className="text-sm text-slate-500">{r.class} · {r.date} · {r.students} students</p>
                </div>
                <button className="border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-50 text-sm font-medium">View Report</button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">{r.avg}%</div>
                  <div className="text-xs text-blue-600 mt-1">Class Average</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">{r.highest}%</div>
                  <div className="text-xs text-green-600 mt-1">Highest Score</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-700">{r.lowest}%</div>
                  <div className="text-xs text-red-600 mt-1">Lowest Score</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">Create Exam</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              {[["Exam Title", "text"], ["Subject", "select-subj"], ["Class", "select-class"], ["Exam Date", "date"], ["Duration (minutes)", "number"], ["Total Questions", "number"], ["Instructions", "textarea"]].map(([label, type]) => (
                <div key={label as string}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{label as string}</label>
                  {type === "select-subj" ? (
                    <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                      {questionBank.map(q => <option key={q.subject}>{q.subject}</option>)}
                    </select>
                  ) : type === "select-class" ? (
                    <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                      {["Form 1A", "Form 1B", "Form 2A", "Form 2B", "Form 3A", "Form 4A"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  ) : type === "textarea" ? (
                    <textarea rows={3} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" />
                  ) : (
                    <input type={type as string} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 p-6 border-t border-slate-200">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-slate-200 text-slate-700 py-2 rounded-lg hover:bg-slate-50 text-sm font-medium">Cancel</button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 text-sm font-medium">Create Exam</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
