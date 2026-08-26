"use client";

import { useAuth } from "@/context/AuthContext";
import { 
  TrendingUp, 
  Users, 
  GraduationCap,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  FileText
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
import { loadRecords, CLASSES_BY_LEVEL, LEARNING_AREAS_BY_LEVEL } from '@/lib/grading';

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
  const schoolName = user?.school || "My School";
  
  const records = loadRecords(user?.schoolId);
  const levelClasses = CLASSES_BY_LEVEL[currentLevel] || CLASSES_BY_LEVEL.junior;
  const levelLearningAreas = LEARNING_AREAS_BY_LEVEL[currentLevel] || LEARNING_AREAS_BY_LEVEL.junior;

  const totalStudents = records.length;
  const avgScore = totalStudents > 0 
    ? Math.round(records.reduce((sum, r) => {
        const scores = r.marks.map(m => m.score);
        return sum + (scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0);
      }, 0) / totalStudents)
    : 0;
  
  const atRiskCount = records.filter(r => {
    const scores = r.marks.map(m => m.score);
    const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    return avg < 50;
  }).length;

  const stats = [
    { label: "Total Students", value: totalStudents.toLocaleString(), change: totalStudents > 0 ? "+100%" : "0%", positive: true, icon: Users },
    { label: "Average Score", value: `${avgScore}%`, change: avgScore >= 70 ? "+5%" : "-2%", positive: avgScore >= 70, icon: TrendingUp },
    { label: "At-Risk Learners", value: atRiskCount.toString(), change: atRiskCount > 0 ? "-8%" : "0%", positive: atRiskCount === 0, icon: AlertTriangle },
    { label: "Learning Areas", value: levelLearningAreas.length.toString(), change: "0", positive: true, icon: GraduationCap },
  ];

  const performanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Average Score',
        data: [72, 74, 75, 78, 80, 82],
        borderColor: '#0D9488',
        backgroundColor: 'rgba(13, 148, 136, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Class Average',
        data: [70, 71, 73, 74, 76, 78],
        borderColor: '#64748B',
        backgroundColor: 'rgba(100, 116, 139, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const subjectData = {
    labels: levelLearningAreas.slice(0, 6).map(s => s.length > 12 ? s.substring(0, 12) + '...' : s),
    datasets: [
      {
        label: 'Average Score',
        data: levelLearningAreas.slice(0, 6).map((_, i) => 65 + (i * 3) + Math.floor(Math.random() * 10)),
        backgroundColor: '#0D9488',
        borderRadius: 6,
      },
    ],
  };

  const riskDistribution = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
    datasets: [
      {
        data: atRiskCount > 0 ? [65, 25, 10] : [0, 0, 0],
        backgroundColor: ['#22C55E', '#F59E0B', '#EF4444'],
        borderWidth: 0,
      },
    ],
  };

  const atRiskStudents = records
    .map(r => {
      const scores = r.marks.map(m => m.score);
      const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      return { name: r.name, class: r.className, score: `${avg}%`, risk: avg < 40 ? 'High' : avg < 50 ? 'Medium' : 'Low', schoolId: r.schoolId };
    })
    .filter(s => s.risk !== 'Low' && (!user?.schoolId || s.schoolId === user.schoolId))
    .slice(0, 5);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'bg-red-100 text-red-700';
      case 'Medium': return 'bg-amber-100 text-amber-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-teal-600" />
              </div>
              <span className={`text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.positive ? <ArrowUpRight className="w-4 h-4 inline" /> : <ArrowDownRight className="w-4 h-4 inline" />}
                {' '}{stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
            <div className="text-sm text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Performance Trend</h3>
          <div className="h-64">
            <Line 
              data={performanceData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { min: 60, max: 100 },
                },
              }} 
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Learning Area Performance</h3>
          <div className="h-64">
            <Bar 
              data={subjectData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
              }} 
            />
          </div>
        </div>
      </div>

      {/* Risk Distribution & Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Risk Distribution</h3>
          <div className="h-48 flex items-center justify-center">
            <Doughnut 
              data={riskDistribution}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
              }}
            />
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', text: `Results uploaded for ${levelClasses[0] || 'Grade 7'}`, time: '2 hours ago' },
              { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100', text: `${atRiskCount} students flagged as at-risk`, time: '4 hours ago' },
              { icon: FileText, color: 'text-teal-600', bg: 'bg-teal-100', text: 'Quarterly report generated', time: 'Yesterday' },
              ...(totalStudents > 0 ? [{ icon: Users, color: 'text-blue-600', bg: 'bg-blue-100', text: `${totalStudents} students enrolled in ${schoolName}`, time: '2 days ago' }] : []),
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50">
                <div className={`w-10 h-10 ${activity.bg} rounded-lg flex items-center justify-center`}>
                  <activity.icon className={`w-5 h-5 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-800">{activity.text}</div>
                  <div className="text-xs text-slate-500">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* At-Risk Students */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">At-Risk Students</h3>
          <button className="text-sm text-teal-600 font-medium hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Student</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Class</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Avg Score</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Risk Level</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {atRiskStudents.length > 0 ? atRiskStudents.map((student, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-sm font-medium text-slate-800">{student.name}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{student.class}</td>
                  <td className="py-3 px-4 text-sm font-mono text-slate-800">{student.score}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(student.risk)}`}>
                      {student.risk}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-sm text-teal-600 font-medium hover:underline">View</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <p>No at-risk students. All learners are performing well!</p>
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
