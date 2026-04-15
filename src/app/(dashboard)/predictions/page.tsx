"use client";

import { useState } from "react";
import { 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Filter,
  RefreshCw,
  Target,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const predictedStudents = [
  { id: 1, name: "Alex Johnson", class: "10-A", current: 45, predicted: 52, risk: "High", confidence: 85, trend: "down" },
  { id: 2, name: "Maria Garcia", class: "10-A", current: 52, predicted: 58, risk: "High", confidence: 78, trend: "down" },
  { id: 3, name: "James Wilson", class: "10-B", current: 58, predicted: 72, risk: "Medium", confidence: 82, trend: "up" },
  { id: 4, name: "Sarah Lee", class: "9-A", current: 61, predicted: 75, risk: "Medium", confidence: 88, trend: "up" },
  { id: 5, name: "David Brown", class: "11-B", current: 55, predicted: 61, risk: "High", confidence: 75, trend: "down" },
  { id: 6, name: "Emily Chen", class: "9-B", current: 82, predicted: 86, risk: "Low", confidence: 92, trend: "up" },
  { id: 7, name: "Michael Park", class: "11-A", current: 90, predicted: 92, risk: "Low", confidence: 95, trend: "up" },
  { id: 8, name: "Lisa Thompson", class: "10-C", current: 71, predicted: 74, risk: "Low", confidence: 80, trend: "up" },
];

const predictionChartData = {
  labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
  datasets: [
    {
      label: 'Actual Performance',
      data: [45, 48, 52, 50, 48, 45],
      borderColor: '#EF4444',
      backgroundColor: 'transparent',
      tension: 0.4,
    },
    {
      label: 'Predicted (No Intervention)',
      data: [45, 43, 40, 38, 35, 32],
      borderColor: '#F59E0B',
      borderDash: [5, 5],
      backgroundColor: 'transparent',
      tension: 0.4,
    },
    {
      label: 'Predicted (With Intervention)',
      data: [45, 50, 55, 60, 65, 70],
      borderColor: '#22C55E',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      fill: true,
      tension: 0.4,
    },
  ],
};

const interventionRecommendations = [
  { student: "Alex Johnson", issue: "Struggling in Math & Science", action: "Schedule tutoring sessions", timeline: "2 weeks", priority: "High" },
  { student: "Maria Garcia", issue: "Attendance issues + low scores", action: "Meet with parents + counseling", timeline: "1 week", priority: "High" },
  { student: "David Brown", issue: "Consistent decline trend", action: "Academic intervention program", timeline: "3 weeks", priority: "Medium" },
  { student: "James Wilson", issue: "Needs study support", action: "Peer tutoring + study group", timeline: "4 weeks", priority: "Low" },
];

const modelAccuracy = {
  accuracy: 87,
  precision: 84,
  recall: 89,
  f1Score: 86,
};

export default function PredictionsPage() {
  const [selectedRisk, setSelectedRisk] = useState("all");

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High": return "bg-red-100 text-red-700 border-red-200";
      case "Medium": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Low": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const filteredStudents = selectedRisk === "all" 
    ? predictedStudents 
    : predictedStudents.filter(s => s.risk === selectedRisk);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Predictions</h1>
          <p className="text-slate-500">AI-powered academic performance predictions</p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700">
            <RefreshCw className="w-4 h-4" />
            Run Prediction
          </button>
        </div>
      </div>

      {/* Model Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Model Accuracy", value: `${modelAccuracy.accuracy}%`, icon: Target, color: "text-teal-600" },
          { label: "Precision", value: `${modelAccuracy.precision}%`, icon: Brain, color: "text-blue-600" },
          { label: "Recall", value: `${modelAccuracy.recall}%`, icon: CheckCircle, color: "text-green-600" },
          { label: "F1 Score", value: `${modelAccuracy.f1Score}%`, icon: AlertCircle, color: "text-purple-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-sm text-slate-500">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Prediction Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">Performance Prediction - Alex Johnson (Sample)</h3>
          <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">Example</span>
        </div>
        <div className="h-72">
          <Line 
            data={predictionChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top' },
              },
              scales: {
                y: { min: 20, max: 100, title: { display: true, text: 'Score %' } },
              },
            }}
          />
        </div>
        <div className="mt-4 p-4 bg-slate-50 rounded-lg">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-teal-600 mt-0.5" />
            <div>
              <div className="font-medium text-slate-800">Prediction Insight</div>
              <p className="text-sm text-slate-600 mt-1">
                Without intervention, this student&apos;s performance is predicted to decline by 15% over the next 3 months. 
                With targeted tutoring, a 25% improvement is possible.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Student Predictions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Student Predictions</h3>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Risk Levels</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Student</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-600">Class</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-slate-600">Current</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-slate-600">Predicted</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-slate-600">Risk Level</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-slate-600">Confidence</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-slate-600">Trend</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold">
                        {student.name.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-800">{student.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-600">{student.class}</td>
                  <td className="py-4 px-4 text-center font-mono font-semibold text-slate-800">{student.current}%</td>
                  <td className="py-4 px-4 text-center font-mono font-bold text-teal-700">{student.predicted}%</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor(student.risk)}`}>
                      {student.risk}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-teal-500 rounded-full" 
                          style={{ width: `${student.confidence}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-600">{student.confidence}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {student.trend === 'up' && <TrendingUp className="w-5 h-5 text-green-600 inline" />}
                    {student.trend === 'down' && <TrendingDown className="w-5 h-5 text-red-600 inline" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Intervention Recommendations */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Intervention Recommendations</h3>
            <p className="text-sm text-slate-500">Prioritized actions based on prediction analysis</p>
          </div>
        </div>
        <div className="space-y-4">
          {interventionRecommendations.map((rec, i) => (
            <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  rec.priority === "High" ? "bg-red-100" : rec.priority === "Medium" ? "bg-amber-100" : "bg-green-100"
                }`}>
                  <AlertTriangle className={`w-5 h-5 ${
                    rec.priority === "High" ? "text-red-600" : rec.priority === "Medium" ? "text-amber-600" : "text-green-600"
                  }`} />
                </div>
                <div>
                  <div className="font-medium text-slate-800">{rec.student}</div>
                  <div className="text-sm text-slate-500">{rec.issue}</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-800">{rec.action}</div>
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <Clock className="w-4 h-4" />
                    {rec.timeline}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  rec.priority === "High" ? "bg-red-100 text-red-700" : 
                  rec.priority === "Medium" ? "bg-amber-100 text-amber-700" : 
                  "bg-green-100 text-green-700"
                }`}>
                  {rec.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}