"use client";

import { useState } from "react";
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  Printer,
  Mail,
  ChevronDown,
  BarChart3,
  TrendingUp,
  Users,
  GraduationCap
} from "lucide-react";

const reportTypes = [
  { id: "performance", name: "Performance Report", icon: BarChart3, description: "Overall student performance analysis" },
  { id: "individual", name: "Individual Student Report", icon: Users, description: "Detailed report for single student" },
  { id: "class", name: "Class Performance Report", icon: GraduationCap, description: "Class-wide performance summary" },
  { id: "trend", name: "Trend Analysis Report", icon: TrendingUp, description: "Performance trends over time" },
  { id: "at-risk", name: "At-Risk Students Report", icon: Users, description: "Students needing intervention" },
  { id: "subject", name: "Subject Analysis Report", icon: BarChart3, description: "Detailed subject performance" },
];

const generatedReports = [
  { id: 1, name: "Q1 2025 Performance Report", type: "Performance Report", date: "2025-04-10", status: "Ready", size: "2.4 MB" },
  { id: 2, name: "Class 10-A Mid-Term Report", type: "Class Report", date: "2025-04-08", status: "Ready", size: "1.8 MB" },
  { id: 3, name: "At-Risk Students - April", type: "At-Risk Report", date: "2025-04-05", status: "Ready", size: "856 KB" },
  { id: 4, name: "Subject Analysis - Mathematics", type: "Subject Report", date: "2025-04-01", status: "Ready", size: "1.2 MB" },
  { id: 5, name: "Annual Trend Analysis 2024", type: "Trend Report", date: "2025-03-28", status: "Ready", size: "3.1 MB" },
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState("month");
  const [reportFormat, setReportFormat] = useState("pdf");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
          <p className="text-slate-500">Generate and download academic reports</p>
        </div>
      </div>

      {/* Generate New Report */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Generate New Report</h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {reportTypes.map((report) => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                selectedReport === report.id 
                  ? "border-teal-500 bg-teal-50" 
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                selectedReport === report.id ? "bg-teal-100" : "bg-slate-100"
              }`}>
                <report.icon className={`w-5 h-5 ${
                  selectedReport === report.id ? "text-teal-600" : "text-slate-600"
                }`} />
              </div>
              <div className="font-medium text-slate-800">{report.name}</div>
              <div className="text-sm text-slate-500 mt-1">{report.description}</div>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 p-4 bg-slate-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="term">This Term</option>
              <option value="year">This Year</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Class</label>
            <select className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
              <option value="">All Classes</option>
              <option value="10-A">Class 10-A</option>
              <option value="10-B">Class 10-B</option>
              <option value="11-A">Class 11-A</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Format</label>
            <select
              value={reportFormat}
              onChange={(e) => setReportFormat(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>

          <button 
            disabled={!selectedReport}
            className="mt-auto px-6 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Report Preview */}
      {selectedReport && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Report Preview</h3>
              <p className="text-sm text-slate-500">Sample data from {reportTypes.find(r => r.id === selectedReport)?.name}</p>
            </div>
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50">
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50">
                <Mail className="w-4 h-4" />
                Email
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
          
          <div className="p-8">
            <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-lg p-8">
              {/* Report Header */}
              <div className="text-center border-b border-slate-200 pb-6 mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center">
                    <BarChart3 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-slate-800">Resulta Analytics</div>
                    <div className="text-sm text-slate-500">Academic Results Analysis System</div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-800">{reportTypes.find(r => r.id === selectedReport)?.name}</h2>
                <p className="text-slate-500 mt-2">Academic Year 2025-2026 | Term 2</p>
              </div>

              {/* Report Content */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">Summary Statistics</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <div className="text-2xl font-bold text-teal-600">2,547</div>
                      <div className="text-sm text-slate-500">Total Students</div>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <div className="text-2xl font-bold text-teal-600">78.4%</div>
                      <div className="text-sm text-slate-500">Average Score</div>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <div className="text-2xl font-bold text-teal-600">94.2%</div>
                      <div className="text-sm text-slate-500">Pass Rate</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">Top Performing Subjects</h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2">Subject</th>
                        <th className="text-right py-2">Average</th>
                        <th className="text-right py-2">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-100">
                        <td className="py-2">History</td>
                        <td className="text-right font-mono">85.2%</td>
                        <td className="text-right text-green-600">+2.1%</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-2">English</td>
                        <td className="text-right font-mono">82.1%</td>
                        <td className="text-right text-green-600">+1.5%</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-2">Mathematics</td>
                        <td className="text-right font-mono">78.4%</td>
                        <td className="text-right text-green-600">+3.2%</td>
                      </tr>
                      <tr>
                        <td className="py-2">Science</td>
                        <td className="text-right font-mono">71.2%</td>
                        <td className="text-right text-red-600">-1.8%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">At-Risk Students Summary</h4>
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-amber-800">156 Students Identified</div>
                        <div className="text-sm text-amber-600">Requiring intervention and support</div>
                      </div>
                      <div className="text-3xl font-bold text-amber-600">6.1%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Footer */}
              <div className="mt-8 pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
                <p>Generated on {new Date().toLocaleDateString()} | Page 1 of 1</p>
                <p className="mt-1">Resulta Analytics - Confidential Report</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Previously Generated Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">Previously Generated Reports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Report Name</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-600">Type</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-600">Date</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-600">Size</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {generatedReports.map((report) => (
                <tr key={report.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-slate-400" />
                      <span className="font-medium text-slate-800">{report.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-600">{report.type}</td>
                  <td className="py-4 px-4 text-slate-600">{report.date}</td>
                  <td className="py-4 px-4 text-slate-600 font-mono text-sm">{report.size}</td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {report.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 hover:bg-slate-100 rounded-lg" title="View">
                        <FileText className="w-4 h-4 text-slate-600" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg" title="Download">
                        <Download className="w-4 h-4 text-teal-600" />
                      </button>
                    </div>
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