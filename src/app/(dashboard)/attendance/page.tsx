"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { CLASSES_BY_LEVEL } from "@/lib/grading";
import { loadStudents, logAudit } from "@/lib/schoolStore";
import { 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  Search,
  Filter,
  Download
} from "lucide-react";

const ATTENDANCE_KEY = "attendance_records";

type AttendanceRecord = {
  id: number;
  studentId: number;
  studentName: string;
  class: string;
  date: string;
  status: "Present" | "Absent" | "Late";
  schoolId?: string;
};

function loadAttendance(schoolId?: string): AttendanceRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`resulta_${ATTENDANCE_KEY}${schoolId ? `_${schoolId}` : ""}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export default function AttendancePage() {
  const { user, currentLevel } = useAuth();
  const schoolName = user?.school || "My School";
  const levelClasses = CLASSES_BY_LEVEL[currentLevel] || CLASSES_BY_LEVEL.junior;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [realStudents, setRealStudents] = useState<ReturnType<typeof loadStudents>>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [showMarkModal, setShowMarkModal] = useState(false);

  useEffect(() => {
    setRealStudents(loadStudents(user?.schoolId));
    setAttendance(loadAttendance(user?.schoolId));
  }, [user?.schoolId]);

  const filtered = realStudents.filter(s => {
    const matchesSearch = `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === "all" || s.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const totalStudents = realStudents.length;
  const todayStr = new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Nairobi" });
  const todayRecords = attendance.filter(a => a.date === todayStr);
  const presentToday = todayRecords.filter(a => a.status === "Present").length;
  const absentToday = todayRecords.filter(a => a.status === "Absent").length;
  const lateToday = todayRecords.filter(a => a.status === "Late").length;
  const avgAttendance = totalStudents > 0 && todayRecords.length > 0
    ? Math.round((presentToday + (lateToday * 0.5)) / totalStudents * 100)
    : 0;

  const handleMarkAttendance = (studentId: number, studentName: string, status: "Present" | "Absent" | "Late") => {
    if (!user) return;
    const record: AttendanceRecord = {
      id: Date.now(),
      studentId,
      studentName,
      class: realStudents.find(s => s.id === studentId)?.class || "Unknown",
      date: todayStr,
      status,
      schoolId: user.schoolId,
    };
    const updated = [record, ...attendance.filter(a => !(a.studentId === studentId && a.date === todayStr))];
    setAttendance(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(`resulta_${ATTENDANCE_KEY}${user.schoolId ? `_${user.schoolId}` : ""}`, JSON.stringify(updated));
    }
    logAudit(
      { userId: user.id, userName: user.name, userRole: user.role, action: "MARK_ATTENDANCE", module: "attendance", details: `${studentName}: ${status}` },
      user.schoolId
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Attendance Tracking</h1>
          <p className="text-slate-500 dark:text-slate-400">Monitor student attendance for {schoolName}</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800 dark:text-white">{totalStudents}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Enrolled Students</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800 dark:text-white">{avgAttendance}%</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Today&apos;s Attendance</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800 dark:text-white">{absentToday}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Absent Today</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800 dark:text-white">{lateToday}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Late Today</div>
            </div>
          </div>
        </div>
      </div>

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
            {levelClasses.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-600">
            <Calendar className="w-4 h-4" />
            {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Nairobi" })}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-700">
            <tr>
              {["Student", "Class", "Today's Status", "Action"].map(h => (
                <th key={h} className="text-left py-4 px-6 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-500">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="font-medium">No students enrolled</p>
                  <p className="text-sm">Add students in the Students page to start tracking attendance</p>
                </td>
              </tr>
            ) : filtered.map((s) => {
              const today = attendance.find(a => a.studentId === s.id && a.date === todayStr);
              return (
                <tr key={s.id} className="border-t border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-600 dark:text-teal-400 font-semibold">
                        {s.firstName.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-800 dark:text-white">{s.firstName} {s.lastName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-400">{s.class}</td>
                  <td className="py-4 px-4">
                    {today ? (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        today.status === "Present" ? "bg-green-100 text-green-700" :
                        today.status === "Late" ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      }`}>{today.status}</span>
                    ) : (
                      <span className="text-slate-400 text-xs">Not marked</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleMarkAttendance(s.id, `${s.firstName} ${s.lastName}`, "Present")} className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100">Present</button>
                      <button onClick={() => handleMarkAttendance(s.id, `${s.firstName} ${s.lastName}`, "Late")} className="px-2 py-1 text-xs bg-amber-50 text-amber-700 rounded hover:bg-amber-100">Late</button>
                      <button onClick={() => handleMarkAttendance(s.id, `${s.firstName} ${s.lastName}`, "Absent")} className="px-2 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100">Absent</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
