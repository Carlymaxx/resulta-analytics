"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { CLASSES_BY_LEVEL } from "@/lib/grading";
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

const getAttendanceDataForLevel = (level: string) => {
  const schoolId = "school-nairobi-high";
  const make = (id: number, name: string, cls: string) => ({
    id, name, class: cls, present: 18 + (id % 4), absent: 2 - (id % 3), late: 1 + (id % 2),
    percentage: 85 + (id % 10), trend: id % 3 === 0 ? "down" : id % 3 === 1 ? "up" : "same", schoolId
  });
  if (level === "primary") {
    return [
      make(1, "Alex Johnson", "Grade 1"),
      make(2, "Maria Garcia", "Grade 2"),
      make(3, "James Wilson", "Grade 3"),
      make(4, "Sarah Lee", "Grade 4"),
      make(5, "David Brown", "Grade 5"),
      make(6, "Emily Chen", "Grade 6"),
    ];
  }
  if (level === "secondary") {
    return [
      make(1, "Alex Johnson", "Form 4"),
      make(2, "Maria Garcia", "Form 4"),
      make(3, "James Wilson", "Form 3"),
      make(4, "Sarah Lee", "Form 3"),
      make(5, "David Brown", "Form 4"),
      make(6, "Emily Chen", "Form 1"),
    ];
  }
  return [
    make(1, "Alex Johnson", "Grade 9"),
    make(2, "Maria Garcia", "Grade 9"),
    make(3, "James Wilson", "Grade 8"),
    make(4, "Sarah Lee", "Grade 8"),
    make(5, "David Brown", "Grade 9"),
    make(6, "Emily Chen", "Grade 7"),
  ];
};

const dailyAttendance = [
  { day: "Mon", present: 245, absent: 12, late: 8, schoolId: "school-nairobi-high" },
  { day: "Tue", present: 248, absent: 8, late: 5, schoolId: "school-nairobi-high" },
  { day: "Wed", present: 252, absent: 5, late: 3, schoolId: "school-nairobi-high" },
  { day: "Thu", present: 240, absent: 15, late: 10, schoolId: "school-nairobi-high" },
  { day: "Fri", present: 238, absent: 18, late: 12, schoolId: "school-nairobi-high" },
];

export default function AttendancePage() {
  const { user, currentLevel } = useAuth();
  const schoolName = user?.school || "My School";
  const levelClasses = CLASSES_BY_LEVEL[currentLevel] || CLASSES_BY_LEVEL.junior;
  const attendanceData = getAttendanceDataForLevel(currentLevel);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");

  const filtered = attendanceData.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === "all" || s.class === selectedClass;
    const matchesSchool = !user?.schoolId || s.schoolId === user.schoolId;
    return matchesSearch && matchesClass && matchesSchool;
  });

  const avgAttendance = Math.round(filtered.reduce((acc, s) => acc + s.percentage, 0) / (filtered.length || 1));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Attendance Tracking</h1>
          <p className="text-slate-500 dark:text-slate-400">Monitor student attendance and punctuality for {schoolName}</p>
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
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
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
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
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
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
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
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
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
             {levelClasses.map(c => (
               <option key={c} value={c}>{c}</option>
             ))}
          </select>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Student</th>
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
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
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
