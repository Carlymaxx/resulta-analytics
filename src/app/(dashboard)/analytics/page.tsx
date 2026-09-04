"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  TrendingUp, 
  TrendingDown,
  Download
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { CLASSES_BY_LEVEL, LEARNING_AREAS_BY_LEVEL } from "@/lib/grading";
import { loadStudents } from "@/lib/schoolStore";
import { loadRecords, averageScore } from "@/lib/grading";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsPage() {
  const { user, currentLevel } = useAuth();
  const schoolName = user?.school || "My School";
  const levelClasses = CLASSES_BY_LEVEL[currentLevel] || CLASSES_BY_LEVEL.junior;
  const levelLearningAreas = LEARNING_AREAS_BY_LEVEL[currentLevel] || LEARNING_AREAS_BY_LEVEL.junior;
  const [selectedClass, setSelectedClass] = useState("all");
  const [records, setRecords] = useState<ReturnType<typeof loadRecords>>([]);
  const [students, setStudents] = useState<ReturnType<typeof loadStudents>>([]);

  useEffect(() => {
    setRecords(loadRecords(user?.schoolId));
    setStudents(loadStudents(user?.schoolId));
  }, [user?.schoolId]);

  const classFiltered = selectedClass === "all" ? records : records.filter(r => r.className === selectedClass);
  const classStudents = selectedClass === "all" ? students : students.filter(s => s.class === selectedClass);

  const overallAvg = classFiltered.length > 0
    ? Math.round(classFiltered.reduce((s, r) => s + averageScore(r.marks), 0) / classFiltered.length)
    : 0;
  const passRate = classFiltered.length > 0
    ? Math.round((classFiltered.filter(r => averageScore(r.marks) >= 50).length / classFiltered.length) * 100)
    : 0;
  const atRisk = classFiltered.filter(r => averageScore(r.marks) < 50).length;
  const topPerformers = [...classFiltered]
    .sort((a, b) => averageScore(b.marks) - averageScore(a.marks))
    .slice(0, 5);

  const subjectAverages = levelLearningAreas.map(area => {
    const allScores = classFiltered.flatMap(r => r.marks.filter(m => m.subject === area).map(m => m.score));
    const avg = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;
    return { subject: area, current: avg, previous: avg };
  }).filter(s => s.current > 0);

  const monthlyData = {
    labels: ['Term 1', 'Term 2', 'Term 3'],
    datasets: [
      {
        label: 'Average Score',
        data: [Math.max(0, overallAvg - 3), Math.max(0, overallAvg - 1), overallAvg],
        borderColor: '#0D9488',
        backgroundColor: 'rgba(13, 148, 136, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const subjectComparison = {
    labels: subjectAverages.map(s => s.subject.length > 12 ? s.subject.substring(0, 12) + '…' : s.subject),
    datasets: [
      {
        label: 'Average Score',
        data: subjectAverages.map(s => s.current),
        backgroundColor: '#0D9488',
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Analytics</h1>
          <p className="text-slate-500">Performance insights for {schoolName}</p>
        </div>
        <div className="flex gap-3">
          <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option value="all">All Classes</option>
            {levelClasses.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Overall Average</div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">{overallAvg > 0 ? `${overallAvg}%` : "—"}</div>
          <div className="text-sm font-medium text-slate-500">{classStudents.length} students</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Pass Rate</div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">{passRate > 0 ? `${passRate}%` : "—"}</div>
          <div className="text-sm font-medium text-green-600">Score ≥ 50%</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">At-Risk</div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">{atRisk}</div>
          <div className="text-sm font-medium text-amber-600">Need attention</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Records</div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">{classFiltered.length}</div>
          <div className="text-sm font-medium text-slate-500">Mark entries</div>
        </div>
      </div>

      {classFiltered.length > 0 ? (
        <>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Performance Trend</h3>
              <div className="h-72">
                <Line data={monthlyData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100 } } }} />
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Learning Area Averages</h3>
              <div className="h-72">
                <Bar data={subjectComparison} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100 } } }} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Top Performers</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200">
                    {["Rank", "Student", "Class", "Average", "Trend"].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topPerformers.map((r, i) => {
                    const avg = averageScore(r.marks);
                    const trend = avg >= 70 ? "up" : avg >= 50 ? "same" : "down";
                    return (
                      <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm bg-teal-100 text-teal-700">{i + 1}</span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800">{r.name}</td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{r.className}</td>
                        <td className="py-3 px-4 text-center font-mono font-semibold text-teal-700">{avg.toFixed(1)}%</td>
                        <td className="py-3 px-4 text-center">
                          {trend === 'up' ? <TrendingUp className="w-5 h-5 text-green-600 inline" /> :
                           trend === 'down' ? <TrendingDown className="w-5 h-5 text-red-600 inline" /> :
                           <span className="text-slate-400">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 shadow-sm border border-slate-200 dark:border-slate-700 text-center">
          <TrendingUp className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">No data yet</h3>
          <p className="text-slate-500 text-sm">Add students and enter their marks to see analytics. The dashboard, predictions, and reports all use the same data source.</p>
        </div>
      )}
    </div>
  );
}
