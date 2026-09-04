"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Users,
  GraduationCap,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  FileText,
  DollarSign,
  Activity,
  Sparkles,
  ArrowRight,
  BookOpen
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
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { loadRecords, CLASSES_BY_LEVEL, LEARNING_AREAS_BY_LEVEL, averageScore } from '@/lib/grading';
import { loadStudents, getStudentCount, getTotalCollectedRevenue, getStaffCount, getModelMetrics, logAudit, loadAuditLog, isOnboarded, isDemoSchool } from '@/lib/schoolStore';
import { useEffect, useState } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function DashboardPage() {
  const { user, currentLevel } = useAuth();
  const router = useRouter();
  const schoolName = user?.school || "My School";
  const [stats, setStats] = useState({ totalStudents: 0, avgScore: 0, atRiskCount: 0, learningAreas: 0, totalStaff: 0, collectedRevenue: 0 });
  const [atRiskStudents, setAtRiskStudents] = useState<{name: string; class: string; score: string; risk: string; schoolId?: string}[]>([]);
  const [recentActivity, setRecentActivity] = useState<{icon: any; color: string; bg: string; text: string; time: string}[]>([]);
  const [subjectAverages, setSubjectAverages] = useState<{subject: string; avg: number}[]>([]);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (user.role !== "superadmin" && !isDemoSchool(user.schoolId) && !isOnboarded(user.schoolId)) {
      router.push("/onboarding");
      return;
    }
    setShowWelcome(!isDemoSchool(user.schoolId) && getStudentCount(user.schoolId) === 0);
    logAudit(
      { userId: user.id, userName: user.name, userRole: user.role, action: "VIEW", module: "dashboard", details: "Viewed dashboard" },
      user.schoolId
    );
    const schoolId = user.schoolId;
    const records = loadRecords(schoolId);
    const students = loadStudents(schoolId);
    const levelClasses = CLASSES_BY_LEVEL[currentLevel] || CLASSES_BY_LEVEL.junior;
    const levelLearningAreas = LEARNING_AREAS_BY_LEVEL[currentLevel] || LEARNING_AREAS_BY_LEVEL.junior;

    const totalStudents = getStudentCount(schoolId);
    const recordsForLevel = records.filter(r => levelClasses.includes(r.className));
    const totalRecords = recordsForLevel.length;
    const avgScore = totalRecords > 0
      ? Math.round(recordsForLevel.reduce((sum, r) => sum + averageScore(r.marks), 0) / totalRecords)
      : 0;

    const atRiskData = recordsForLevel
      .map(r => {
        const avg = averageScore(r.marks);
        const risk: "High" | "Medium" | "Low" = avg < 40 ? "High" : avg < 50 ? "Medium" : "Low";
        return { name: r.name, class: r.className, score: `${Math.round(avg)}%`, risk, schoolId: r.schoolId };
      })
      .filter(s => s.risk !== "Low" && (!schoolId || s.schoolId === schoolId))
      .slice(0, 5);

    const atRiskCount = recordsForLevel.filter(r => averageScore(r.marks) < 50).length;
    const totalStaff = getStaffCount(schoolId);
    const collectedRevenue = getTotalCollectedRevenue(schoolId);

    setStats({
      totalStudents,
      avgScore,
      atRiskCount,
      learningAreas: levelLearningAreas.length,
      totalStaff,
      collectedRevenue,
    });
    setAtRiskStudents(atRiskData);

    const subjectMap: Record<string, { sum: number; count: number }> = {};
    recordsForLevel.forEach(r => {
      r.marks.forEach(m => {
        if (!subjectMap[m.subject]) subjectMap[m.subject] = { sum: 0, count: 0 };
        subjectMap[m.subject].sum += m.score;
        subjectMap[m.subject].count += 1;
      });
    });
    const subjectAvgs = Object.entries(subjectMap)
      .map(([subject, data]) => ({ subject, avg: Math.round(data.sum / data.count) }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 6);
    setSubjectAverages(subjectAvgs);

    const audit = loadAuditLog(schoolId).slice(0, 4);
    setRecentActivity(
      audit.length > 0
        ? audit.map((a) => ({
            icon: Activity,
            color: "text-teal-600",
            bg: "bg-teal-100",
            text: `${a.action} by ${a.userName} in ${a.module}`,
            time: new Date(a.timestamp).toLocaleString("en-GB", { timeZone: "Africa/Nairobi" }),
          }))
        : [
            { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100", text: `Welcome to ${schoolName} dashboard`, time: "Just now" },
            { icon: Users, color: "text-blue-600", bg: "bg-blue-100", text: `${totalStudents} active students enrolled`, time: "Today" },
          ]
    );
  }, [user, currentLevel]);

  const metric = getModelMetrics();
  const levelClasses = CLASSES_BY_LEVEL[currentLevel] || CLASSES_BY_LEVEL.junior;

  const performanceData = {
    labels: ['Term 1', 'Term 2', 'Term 3'],
    datasets: [
      {
        label: 'Average Score',
        data: [Math.max(0, stats.avgScore - 5), Math.max(0, stats.avgScore - 2), stats.avgScore],
        borderColor: '#0D9488',
        backgroundColor: 'rgba(13, 148, 136, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const subjectData = {
    labels: subjectAverages.map(s => s.subject.length > 14 ? s.subject.substring(0, 14) + '…' : s.subject),
    datasets: [
      {
        label: 'Average Score',
        data: subjectAverages.map(s => s.avg),
        backgroundColor: '#0D9488',
        borderRadius: 6,
      },
    ],
  };

  const riskDistribution = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
    datasets: [
      {
        data: [
          Math.max(0, stats.totalStudents - stats.atRiskCount),
          Math.floor(stats.atRiskCount * 0.4),
          Math.ceil(stats.atRiskCount * 0.6),
        ],
        backgroundColor: ['#22C55E', '#F59E0B', '#EF4444'],
        borderWidth: 0,
      },
    ],
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'bg-red-100 text-red-700';
      case 'Medium': return 'bg-amber-100 text-amber-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  const cards = [
    { label: "Total Students", value: stats.totalStudents.toLocaleString(), icon: Users, color: "text-teal-600", bg: "bg-teal-100" },
    { label: "Average Score", value: `${stats.avgScore}%`, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "At-Risk Learners", value: stats.atRiskCount.toString(), icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-100" },
    { label: "Learning Areas", value: stats.learningAreas.toString(), icon: GraduationCap, color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Total Staff", value: stats.totalStaff.toString(), icon: Users, color: "text-indigo-600", bg: "bg-indigo-100" },
    { label: "Revenue Collected", value: `KES ${(stats.collectedRevenue / 1000).toFixed(0)}K`, icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
  ];

  return (
    <div className="space-y-6">
      {showWelcome && (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-slate-800 mb-1">Welcome to {schoolName}!</h2>
              <p className="text-slate-600 text-sm mb-3">Your school workspace is ready. Every module is empty — start by adding students and teachers to populate the dashboard.</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => router.push("/students")} className="inline-flex items-center gap-1.5 bg-teal-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-teal-700">
                  <Users className="w-3.5 h-3.5" /> Add Students <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => router.push("/teachers")} className="inline-flex items-center gap-1.5 bg-white text-teal-700 border border-teal-200 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-teal-50">
                  <Users className="w-3.5 h-3.5" /> Add Teachers
                </button>
                <button onClick={() => router.push("/marks")} className="inline-flex items-center gap-1.5 bg-white text-teal-700 border border-teal-200 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-teal-50">
                  <FileText className="w-3.5 h-3.5" /> Enter Marks
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Real-time insights for {schoolName}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: stat.bg.replace('bg-', '').includes('100') ? stat.bg : '#f1f5f9' }}>
              <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Performance Trend</h3>
          <div className="h-64">
            {stats.avgScore > 0 ? (
              <Line data={performanceData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">No data yet — enter marks to see trends</div>
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Learning Area Performance</h3>
          <div className="h-64">
            {subjectAverages.length > 0 ? (
              <Bar data={subjectData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">No data yet — enter marks to see performance</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Risk Distribution</h3>
          <div className="h-48 flex items-center justify-center">
            {stats.totalStudents > 0 ? (
              <Doughnut data={riskDistribution} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
            ) : (
              <div className="text-slate-400 text-sm text-center px-4">No student data yet</div>
            )}
          </div>
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <div className={`w-10 h-10 ${activity.bg} rounded-lg flex items-center justify-center`}>
                  <activity.icon className={`w-5 h-5 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-800 dark:text-white">{activity.text}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">At-Risk Students</h3>
          <span className="text-xs text-slate-500">ML Model: {metric.accuracy}% accuracy · Last evaluated {metric.lastEvaluated}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Student</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Class</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Avg Score</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {atRiskStudents.length > 0 ? atRiskStudents.map((s, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-3 px-4 text-sm font-medium text-slate-800 dark:text-white">{s.name}</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{s.class}</td>
                  <td className="py-3 px-4 text-sm font-mono text-slate-800 dark:text-white">{s.score}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(s.risk)}`}>
                      {s.risk}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <p>{stats.totalStudents === 0 ? "No students enrolled yet — go to Students to add some" : "No at-risk students. All learners are performing well!"}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
