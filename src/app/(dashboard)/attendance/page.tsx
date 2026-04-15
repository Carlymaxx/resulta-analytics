"use client";

import { useState } from "react";
import { 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  Search,
  Filter,
  Download,
  TrendingUp,
  TrendingDown
} from "lucide-react";

const attendanceData = [
  { id: 1, name: "Alex Johnson", class: "10-A", present: 18, absent: 2, late: 1, percentage: 90, trend: "up" },
  { id: 2, name: "Maria Garcia", class: "10-A", present: 20, absent: 0, late: 1, percentage: 95, trend: "up" },
  { id: 3, name: "James Wilson", class: "10-B", present: 15, absent: 4, late: 2, percentage: 71, trend: "down" },
  { id: 4, name: "Sarah Lee", class: "9-A", present: 19, absent: 1, late: 0, percentage: 95, trend: "same" },
  { id: 5, name: "David Brown", class: "10-A", present: 14, absent: 5, late: 2, percentage: 67, trend: "down" },
  { id: 6, name: "Emily Chen", class: "9-B", present: 20, absent: 0, late: 0, percentage: 100, trend: "up" },
];

const dailyAttendance = [
  { day: "Mon", present: 245, absent: 12, late: 8 },
  { day: "Tue", present: 248, absent: 8, late: 5 },
  { day: "Wed", present: 252, absent: 5, late: 3 },
  { day: "Thu", present: 240, absent: 15, late: 10 },
  { day: "Fri", present: 238, absent: 18, late: 12 },
];

export default function AttendancePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");

  const filtered = attendanceData.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedClass === "all" || s.class === selectedClass)
  );

  const avgAttendance = Math.round(attendanceData.reduce((acc, s) => acc + s.percentage, 0) / attendanceData.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Attendance Tracking</h1>
          <p className="text-slate-500 dark:text-slate-400">Monitor student attendance and punctuality</p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="inline-flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-teal-700">
            <CheckCircle className="w-5 h-5" />
            Mark Attendance
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800 dark:text-white">265</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Total Students</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800 dark:text-white">{avgAttendance}%</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Avg Attendance</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800 dark:text-white">58</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Total Absences</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800 dark:text-white">40</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Late Arrivals</div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Overview */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Weekly Overview</h2>
        <div className="flex items-end gap-2 h-32">
          {dailyAttendance.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col gap-1">
                <div className="bg-green-500 rounded-t" style={{ height: `${day.present * 0.4}px` }}></div>
                <div className="bg-amber-400" style={{ height: `${day.late * 3}px` }}></div>
                <div className="bg-red-500 rounded-b" style={{ height: `${day.absent * 3}px` }}></div>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">{day.day}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-slate-600 dark:text-slate-400">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-400 rounded"></div>
            <span className="text-slate-600 dark:text-slate-400">Late</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-slate-600 dark:text-slate-400">Absent</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white"
            />
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white"
          >
            <option value="all">All Classes</option>
            <option value="10-A">Class 10-A</option>
            <option value="10-B">Class 10-B</option>
            <option value="9-A">Class 9-A</option>
            <option value="9-B">Class 9-B</option>
          </select>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600 dark:text-slate-300">Student</th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Class</th>
              <th className="text-center py-4 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Present</th>
              <th className="text-center py-4 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Absent</th>
              <th className="text-center py-4 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Late</th>
              <th className="text-center py-4 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300">%</th>
              <th className="text-center py-4 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Trend</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((student) => (
              <tr key={student.id} className="border-t border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-600 dark:text-teal-400 font-semibold">
                      {student.name.charAt(0)}
                    </div>
                    <span className="font-medium text-slate-800 dark:text-white">{student.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-slate-600 dark:text-slate-400">{student.class}</td>
                <td className="py-4 px-4 text-center font-mono text-green-600">{student.present}</td>
                <td className="py-4 px-4 text-center font-mono text-red-600">{student.absent}</td>
                <td className="py-4 px-4 text-center font-mono text-amber-600">{student.late}</td>
                <td className="py-4 px-4 text-center">
                  <span className={`font-mono font-semibold ${
                    student.percentage >= 90 ? 'text-green-600' :
                    student.percentage >= 75 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {student.percentage}%
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  {student.trend === 'up' && <TrendingUp className="w-5 h-5 text-green-500 inline" />}
                  {student.trend === 'down' && <TrendingDown className="w-5 h-5 text-red-500 inline" />}
                  {student.trend === 'same' && <span className="text-slate-400">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}