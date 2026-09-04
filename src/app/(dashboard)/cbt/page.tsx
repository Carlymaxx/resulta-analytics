"use client";

import { useState } from "react";
import { ClipboardList, Zap, CheckCircle, Database, Plus, X, AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { CLASSES_BY_LEVEL, LEARNING_AREAS_BY_LEVEL } from "@/lib/grading";

const getExamsForLevel = (level: string) => {
  const schoolId = "school-nairobi-high";
  const cls = level === "primary" ? "Grade 4" : level === "secondary" ? "Form 3" : "Grade 8";
  const cls2 = level === "primary" ? "Grade 5" : level === "secondary" ? "Grade 9" : "Grade 9";
  const areas = LEARNING_AREAS_BY_LEVEL[level] || LEARNING_AREAS_BY_LEVEL.junior;
  const area1 = areas[0] || "Mathematics";
  const area2 = areas[1] || "English";
  const area3 = areas[2] || "Science";
  const area4 = areas[3] || "Social Studies";
  return [
    { title: `${area1} Mid-Term Exam`, subject: area1, class: cls2, date: "Dec 10, 2025", duration: 90, questions: 40, status: "Upcoming", schoolId },
    { title: `${area2} Comprehension Test`, subject: area2, class: cls, date: "Dec 5, 2025", duration: 60, questions: 30, status: "Active", schoolId },
    { title: `${area3} End of Term`, subject: area3, class: cls2, date: "Dec 12, 2025", duration: 120, questions: 50, status: "Upcoming", schoolId },
    { title: `${area4} Quiz`, subject: area4, class: cls, date: "Nov 28, 2025", duration: 45, questions: 20, status: "Active", schoolId },
  ];
};

const getQuestionBankForLevel = (level: string) => {
  const schoolId = "school-nairobi-high";
  const areas = LEARNING_AREAS_BY_LEVEL[level] || LEARNING_AREAS_BY_LEVEL.junior;
  return areas.slice(0, 5).map(learningArea => ({
    learningArea,
    count: 50 + Math.floor(Math.random() * 100),
    topics: ["Topic A", "Topic B", "Topic C", "Topic D"],
    schoolId,
  }));
};

const getCompletedResultsForLevel = (level: string) => {
  const schoolId = "school-nairobi-high";
  const cls = level === "primary" ? "Grade 4" : level === "secondary" ? "Form 3" : "Grade 8";
  const area = (LEARNING_AREAS_BY_LEVEL[level] || LEARNING_AREAS_BY_LEVEL.junior)[0] || "Mathematics";
  return [
    { exam: `${area} CAT 2`, class: cls, students: 45, avg: 72, highest: 96, lowest: 38, date: "Nov 20, 2025", schoolId },
    { exam: `${area} Term Test`, class: cls, students: 52, avg: 68, highest: 92, lowest: 42, date: "Nov 15, 2025", schoolId },
  ];
};

const stats = [
  { label: "Total Exams", value: "18", icon: ClipboardList, color: "bg-teal-100 text-teal-600" },
  { label: "Active Now", value: "2", icon: Zap, color: "bg-red-100 text-red-600" },
  { label: "Completed", value: "14", icon: CheckCircle, color: "bg-green-100 text-green-600" },
  { label: "Question Bank", value: "450+", icon: Database, color: "bg-purple-100 text-purple-600" },
];

export default function CBTPage() {
  const { currentLevel, user } = useAuth();
  const levelClasses = CLASSES_BY_LEVEL[currentLevel] || CLASSES_BY_LEVEL.junior;
  const levelLearningAreas = LEARNING_AREAS_BY_LEVEL[currentLevel] || LEARNING_AREAS_BY_LEVEL.junior;
  const exams = getExamsForLevel(currentLevel);
  const questionBank = getQuestionBankForLevel(currentLevel);
  const completedResults = getCompletedResultsForLevel(currentLevel);
  const [activeTab, setActiveTab] = useState("exams");
  const [showModal, setShowModal] = useState(false);
  const [expandedLearningArea, setExpandedLearningArea] = useState<string | null>(null);

  const activeExams = exams.filter(e => e.status === "Active");
  const filteredExams = exams.filter(e => !user?.schoolId || e.schoolId === user.schoolId);
  const filteredQuestionBank = questionBank.filter(q => !user?.schoolId || q.schoolId === user.schoolId);
  const filteredCompletedResults = completedResults.filter(r => !user?.schoolId || r.schoolId === user.schoolId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">CBT Examinations</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Computer-based testing, question bank, and results</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all text-sm font-medium">
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
          <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-white">{s.value}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {["exams", "questions", "results"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === t ? "border-teal-600 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
            {t === "exams" ? "Exams" : t === "questions" ? "Question Bank" : "Results"}
          </button>
        ))}
      </div>

      {activeTab === "exams" && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200">
                <tr>{["Title", "Learning Area", "Class", "Date", "Duration", "Questions", "Status"].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider uppercase tracking-wider uppercase tracking-wider">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExams.map((e, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="py-3 px-4 text-sm font-medium text-slate-800">{e.title}</td>
                     <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{e.subject}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{e.class}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{e.date}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{e.duration} min</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{e.questions}</td>
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
          {filteredQuestionBank.map((qb, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <button onClick={() => setExpandedLearningArea(expandedLearningArea === qb.learningArea ? null : qb.learningArea)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                    <Database className="w-4 h-4 text-teal-600" />
                  </div>
                   <span className="font-medium text-slate-800">{qb.learningArea}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono font-bold text-teal-700">{qb.count} questions</span>
                   <span className="text-slate-400">{expandedLearningArea === qb.learningArea ? "▲" : "▼"}</span>
                </div>
              </button>
                  {expandedLearningArea === qb.learningArea && (
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
          {filteredCompletedResults.map((r, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-800">{r.exam}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{r.class} · {r.date} · {r.students} students</p>
                </div>
                <button className="border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 text-sm font-medium">View Report</button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">{r.avg}%</div>
                   <div className="text-xs text-blue-600 mt-1">Grade Average</div>
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Create Exam</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><X className="w-5 h-5 text-slate-500 dark:text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-4">
                  {[["Exam Title", "text"], ["Learning Area", "select-subj"], ["Class", "select-class"], ["Exam Date", "date"], ["Duration (minutes)", "number"], ["Total Questions", "number"], ["Instructions", "textarea"]].map(([label, type]) => (
                <div key={label as string}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label as string}</label>
                  {type === "select-subj" ? (
                    <select className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                      {levelLearningAreas.map(area => <option key={area} value={area}>{area}</option>)}
                    </select>
                  ) : type === "select-class" ? (
                    <select className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                        {levelClasses.map(c => <option key={c}>{c}</option>)}
                    </select>
                  ) : type === "textarea" ? (
                    <textarea rows={3} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" />
                  ) : (
                    <input type={type as string} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 p-6 border-t border-slate-200">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-slate-200 text-slate-700 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 text-sm font-medium">Cancel</button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 text-sm font-medium">Create Exam</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
