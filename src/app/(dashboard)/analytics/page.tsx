"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  TrendingUp, 
  TrendingDown,
  Filter,
  Download,
  Calendar,
  ChevronDown
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

const monthlyData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: '2024',
      data: [72, 74, 73, 76, 78, 80, 82, 79, 81, 83, 85, 84],
      borderColor: '#94A3B8',
      backgroundColor: 'transparent',
      tension: 0.4,
      schoolId: "school-nairobi-high",
    },
    {
      label: '2025',
      data: [75, 77, 79, 81, 83, 85, 87, 86, 88, 90, 92, 91],
      borderColor: '#0D9488',
      backgroundColor: 'transparent',
      tension: 0.4,
      schoolId: "school-nairobi-high",
    },
  ],
};

const subjectComparison = (levelClasses: string[], learningAreas: string[]) => {
  const labels = learningAreas.slice(0, 8);
  const classLabel = levelClasses[levelClasses.length - 1] || "Grade 9";
  const midLabel = levelClasses.length > 1 ? levelClasses[Math.floor(levelClasses.length / 2)] : "Grade 8";
  return {
    labels,
    datasets: [
      {
        label: classLabel,
        data: labels.map(() => 70 + Math.floor(Math.random() * 25)),
        backgroundColor: '#0D9488',
        borderRadius: 4,
      },
      {
        label: midLabel,
        data: labels.map(() => 65 + Math.floor(Math.random() * 25)),
        backgroundColor: '#14B8A6',
        borderRadius: 4,
      },
      {
        label: 'School Avg',
        data: labels.map(() => 68 + Math.floor(Math.random() * 25)),
        backgroundColor: '#E2E8F0',
        borderRadius: 4,
      },
    ],
  };
};

const performanceByTerm = {
  labels: ['Term 1', 'Term 2', 'Term 3', 'Term 4'],
  datasets: [
    {
      label: 'Top Performers',
      data: [25, 28, 32, 35],
      backgroundColor: '#22C55E',
      borderRadius: 4,
      schoolId: "school-nairobi-high",
    },
    {
      label: 'Average',
      data: [45, 48, 50, 52],
      backgroundColor: '#F59E0B',
      borderRadius: 4,
      schoolId: "school-nairobi-high",
    },
    {
      label: 'Below Average',
      data: [30, 24, 18, 13],
      backgroundColor: '#EF4444',
      borderRadius: 4,
      schoolId: "school-nairobi-high",
    },
  ],
};

const getTopPerformers = (level: string) => {
  const schoolId = "school-nairobi-high";
  const cls = level === "primary" ? "Grade 6" : level === "secondary" ? "Form 4" : "Grade 9";
  const mid = level === "primary" ? "Grade 4" : level === "secondary" ? "Form 2" : "Grade 8";
  const low = level === "primary" ? "Grade 2" : level === "secondary" ? "Form 1" : "Grade 7";
  return [
    { rank: 1, name: "Michael Park", class: cls, avg: 94.5, trend: "up", schoolId },
    { rank: 2, name: "Emma Wilson", class: cls, avg: 92.8, trend: "up", schoolId },
    { rank: 3, name: "David Chen", class: mid, avg: 91.5, trend: "same", schoolId },
    { rank: 4, name: "Sarah Johnson", class: low, avg: 90.2, trend: "up", schoolId },
    { rank: 5, name: "James Lee", class: mid, avg: 89.8, trend: "down", schoolId },
  ];
};

const getSubjectTrends = (level: string) => {
  const schoolId = "school-nairobi-high";
  const areas = LEARNING_AREAS_BY_LEVEL[level] || LEARNING_AREAS_BY_LEVEL.junior;
  return areas.slice(0, 6).map(learningArea => ({
    learningArea,
    current: 70 + Math.floor(Math.random() * 20),
    previous: 65 + Math.floor(Math.random() * 20),
    change: (Math.random() > 0.5 ? "+" : "-") + Math.floor(Math.random() * 8),
    positive: Math.random() > 0.4,
    schoolId,
  }));
};

export default function AnalyticsPage() {
  const { user, currentLevel } = useAuth();
  const schoolName = user?.school || "My School";
  const levelClasses = CLASSES_BY_LEVEL[currentLevel] || CLASSES_BY_LEVEL.junior;
  const levelLearningAreas = LEARNING_AREAS_BY_LEVEL[currentLevel] || LEARNING_AREAS_BY_LEVEL.junior;
  const [timeRange, setTimeRange] = useState("year");
  const [selectedClass, setSelectedClass] = useState("all");

  const topPerformers = getTopPerformers(currentLevel);
  const subjectTrends = getSubjectTrends(currentLevel);
  const filteredTopPerformers = topPerformers.filter(p => !user?.schoolId || p.schoolId === user.schoolId);
  const filteredSubjectTrends = subjectTrends.filter(t => !user?.schoolId || t.schoolId === user.schoolId);
  const dynamicSubjectComparison = subjectComparison(levelClasses, levelLearningAreas);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Analytics</h1>
          <p className="text-slate-500">Performance trends for {schoolName}</p>
        </div>
        <div className="flex gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="month">This Month</option>
            <option value="term">This Term</option>
            <option value="year">This Year</option>
          </select>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Classes</option>
              {levelClasses.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Overall Average", value: "81.4%", change: "+4.2%", positive: true },
          { label: "Pass Rate", value: "94.2%", change: "+2.1%", positive: true },
          { label: "Improvement", value: "12%", change: "+5%", positive: true },
          { label: "Top Performers", value: "156", change: "+23", positive: true },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">{stat.label}</div>
            <div className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</div>
            <div className={`text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
              {stat.positive ? <TrendingUp className="w-4 h-4 inline mr-1" /> : <TrendingDown className="w-4 h-4 inline mr-1" />}
              {stat.change} vs last period
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Performance Over Time</h3>
          <div className="h-72">
            <Line 
              data={monthlyData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                },
                scales: {
                  y: { min: 60, max: 100 },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Learning Area Comparison</h3>
          <div className="h-72">
            <Bar 
              data={dynamicSubjectComparison}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Performance Distribution by Term</h3>
          <div className="h-64">
            <Bar 
              data={performanceByTerm}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                },
                scales: {
                  x: { stacked: true },
                  y: { stacked: true },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Learning Area Trends</h3>
          <div className="space-y-4">
            {filteredSubjectTrends.map((subject, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                   <div className="font-medium text-slate-800">{subject.learningArea}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Prev: {subject.previous}%</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-800">{subject.current}%</div>
                  <div className={`text-sm font-medium ${subject.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {subject.positive ? <TrendingUp className="w-3 h-3 inline" /> : <TrendingDown className="w-3 h-3 inline" />}
                    {' '}{subject.change}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Top Performers</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Rank</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Student</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Class</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Average</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody>
              {filteredTopPerformers.map((student) => (
                <tr key={student.rank} className="border-b border-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                      student.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                      student.rank === 2 ? 'bg-slate-100 text-slate-600 dark:text-slate-400' :
                      student.rank === 3 ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-50 text-slate-600 dark:text-slate-400'
                    }`}>
                      {student.rank}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">{student.name}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{student.class}</td>
                  <td className="py-3 px-4 text-center font-mono font-semibold text-teal-700">{student.avg}%</td>
                  <td className="py-3 px-4 text-center">
                    {student.trend === 'up' && <TrendingUp className="w-5 h-5 text-green-600 inline" />}
                    {student.trend === 'down' && <TrendingDown className="w-5 h-5 text-red-600 inline" />}
                    {student.trend === 'same' && <span className="text-slate-400">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
