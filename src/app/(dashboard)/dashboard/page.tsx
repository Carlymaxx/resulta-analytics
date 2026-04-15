"use client";

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

const stats = [
  { label: "Total Students", value: "2,547", change: "+12%", positive: true, icon: Users },
  { label: "Average Score", value: "78.4%", change: "+3.2%", positive: true, icon: TrendingUp },
  { label: "At-Risk Learners", value: "156", change: "-8%", positive: true, icon: AlertTriangle },
  { label: "Subjects", value: "12", change: "0", positive: true, icon: GraduationCap },
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
  labels: ['Math', 'English', 'Science', 'History', 'Geography', 'Physics'],
  datasets: [
    {
      label: 'Average Score',
      data: [78, 82, 71, 85, 76, 73],
      backgroundColor: '#0D9488',
      borderRadius: 6,
    },
  ],
};

const riskDistribution = {
  labels: ['Low Risk', 'Medium Risk', 'High Risk'],
  datasets: [
    {
      data: [65, 25, 10],
      backgroundColor: ['#22C55E', '#F59E0B', '#EF4444'],
      borderWidth: 0,
    },
  ],
};

export default function DashboardPage() {
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
          <h3 className="text-lg font-bold text-slate-800 mb-4">Subject Performance</h3>
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
              { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', text: 'Math results uploaded for Class 10-A', time: '2 hours ago' },
              { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100', text: '5 students flagged as at-risk in Science', time: '4 hours ago' },
              { icon: FileText, color: 'text-teal-600', bg: 'bg-teal-100', text: 'Quarterly report generated', time: 'Yesterday' },
              { icon: Users, color: 'text-blue-600', bg: 'bg-blue-100', text: 'New student enrolled: John Smith', time: '2 days ago' },
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
              {[
                { name: 'Alex Johnson', class: '10-A', score: '45%', risk: 'High', color: 'bg-red-100 text-red-700' },
                { name: 'Maria Garcia', class: '9-B', score: '52%', risk: 'High', color: 'bg-red-100 text-red-700' },
                { name: 'James Wilson', class: '10-C', score: '58%', risk: 'Medium', color: 'bg-amber-100 text-amber-700' },
                { name: 'Sarah Lee', class: '8-A', score: '61%', risk: 'Medium', color: 'bg-amber-100 text-amber-700' },
                { name: 'David Brown', class: '11-B', score: '55%', risk: 'High', color: 'bg-red-100 text-red-700' },
              ].map((student, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-sm font-medium text-slate-800">{student.name}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{student.class}</td>
                  <td className="py-3 px-4 text-sm font-mono text-slate-800">{student.score}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${student.color}`}>
                      {student.risk}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-sm text-teal-600 font-medium hover:underline">View</button>
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