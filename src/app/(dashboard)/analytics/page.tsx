"use client";

import { useState } from "react";
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
    },
    {
      label: '2025',
      data: [75, 77, 79, 81, 83, 85, 87, 86, 88, 90, 92, 91],
      borderColor: '#0D9488',
      backgroundColor: 'transparent',
      tension: 0.4,
    },
  ],
};

const subjectComparison = {
  labels: ['Math', 'English', 'Science', 'History', 'Geography', 'Physics', 'Chemistry', 'Biology'],
  datasets: [
    {
      label: 'Class 10-A',
      data: [78, 85, 72, 88, 76, 73, 80, 82],
      backgroundColor: '#0D9488',
      borderRadius: 4,
    },
    {
      label: 'Class 10-B',
      data: [72, 80, 68, 82, 71, 69, 75, 78],
      backgroundColor: '#14B8A6',
      borderRadius: 4,
    },
    {
      label: 'School Avg',
      data: [75, 82, 70, 85, 74, 71, 77, 80],
      backgroundColor: '#E2E8F0',
      borderRadius: 4,
    },
  ],
};

const performanceByTerm = {
  labels: ['Term 1', 'Term 2', 'Term 3', 'Term 4'],
  datasets: [
    {
      label: 'Top Performers',
      data: [25, 28, 32, 35],
      backgroundColor: '#22C55E',
      borderRadius: 4,
    },
    {
      label: 'Average',
      data: [45, 48, 50, 52],
      backgroundColor: '#F59E0B',
      borderRadius: 4,
    },
    {
      label: 'Below Average',
      data: [30, 24, 18, 13],
      backgroundColor: '#EF4444',
      borderRadius: 4,
    },
  ],
};

const topPerformers = [
  { rank: 1, name: "Michael Park", class: "11-A", avg: 94.5, trend: "up" },
  { rank: 2, name: "Emma Wilson", class: "10-A", avg: 92.8, trend: "up" },
  { rank: 3, name: "David Chen", class: "12-B", avg: 91.5, trend: "same" },
  { rank: 4, name: "Sarah Johnson", class: "9-A", avg: 90.2, trend: "up" },
  { rank: 5, name: "James Lee", class: "11-B", avg: 89.8, trend: "down" },
];

const subjectTrends = [
  { subject: "Mathematics", current: 78, previous: 72, change: "+6", positive: true },
  { subject: "English", current: 82, previous: 80, change: "+2", positive: true },
  { subject: "Science", current: 71, previous: 75, change: "-4", positive: false },
  { subject: "History", current: 85, previous: 83, change: "+2", positive: true },
  { subject: "Geography", current: 76, previous: 74, change: "+2", positive: true },
  { subject: "Physics", current: 73, previous: 70, change: "+3", positive: true },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("year");
  const [selectedClass, setSelectedClass] = useState("all");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
          <p className="text-slate-500">Performance trends and detailed analysis</p>
        </div>
        <div className="flex gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          >
            <option value="month">This Month</option>
            <option value="term">This Term</option>
            <option value="year">This Year</option>
          </select>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          >
            <option value="all">All Classes</option>
            <option value="10-A">Class 10-A</option>
            <option value="10-B">Class 10-B</option>
            <option value="11-A">Class 11-A</option>
          </select>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50">
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
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <div className="text-sm text-slate-500 mb-1">{stat.label}</div>
            <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
            <div className={`text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
              {stat.positive ? <TrendingUp className="w-4 h-4 inline mr-1" /> : <TrendingDown className="w-4 h-4 inline mr-1" />}
              {stat.change} vs last period
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Performance Over Time</h3>
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

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Subject Comparison</h3>
          <div className="h-72">
            <Bar 
              data={subjectComparison}
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
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Performance Distribution by Term</h3>
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

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Subject Trends</h3>
          <div className="space-y-4">
            {subjectTrends.map((subject, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <div className="font-medium text-slate-800">{subject.subject}</div>
                  <div className="text-sm text-slate-500">Prev: {subject.previous}%</div>
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
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Top Performers</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Rank</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Student</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Class</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Average</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Trend</th>
              </tr>
            </thead>
            <tbody>
              {topPerformers.map((student) => (
                <tr key={student.rank} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                      student.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                      student.rank === 2 ? 'bg-slate-100 text-slate-600' :
                      student.rank === 3 ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-50 text-slate-600'
                    }`}>
                      {student.rank}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">{student.name}</td>
                  <td className="py-3 px-4 text-slate-600">{student.class}</td>
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