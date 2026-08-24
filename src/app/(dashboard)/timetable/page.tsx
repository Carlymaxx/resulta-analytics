"use client";

import { useState } from "react";
import { Clock, Printer, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { CLASSES_BY_LEVEL, SUBJECTS_BY_LEVEL } from "@/lib/grading";

const periods = [
  { label: "Period 1", time: "8:00 – 8:40" },
  { label: "Period 2", time: "8:40 – 9:20" },
  { label: "Period 3", time: "9:20 – 10:00" },
  { label: "Break", time: "10:00 – 10:20", isBreak: true },
  { label: "Period 4", time: "10:20 – 11:00" },
  { label: "Period 5", time: "11:00 – 11:40" },
  { label: "Lunch", time: "12:00 – 1:00", isBreak: true },
  { label: "Period 6", time: "1:00 – 1:40" },
  { label: "Period 7", time: "1:40 – 2:20" },
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

type SlotKey = string;
type SlotData = { subject: string; teacher: string };
type TimetableData = Record<SlotKey, SlotData>;

const grade7Timetable: TimetableData = {
  "Monday-0": { subject: "Mathematics", teacher: "S. Wanjiku" },
  "Monday-1": { subject: "English", teacher: "J. Otieno" },
  "Monday-2": { subject: "Integrated Science", teacher: "G. Muthoni" },
  "Monday-4": { subject: "Social Studies", teacher: "P. Kamau" },
  "Monday-5": { subject: "Kiswahili", teacher: "F. Hassan" },
  "Monday-7": { subject: "Creative Arts and Sports", teacher: "D. Kipchoge" },
  "Tuesday-0": { subject: "English", teacher: "J. Otieno" },
  "Tuesday-1": { subject: "Mathematics", teacher: "S. Wanjiku" },
  "Tuesday-2": { subject: "Integrated Science", teacher: "G. Muthoni" },
  "Tuesday-4": { subject: "Kiswahili", teacher: "F. Hassan" },
  "Tuesday-5": { subject: "Pre-Technical Studies", teacher: "R. Njoroge" },
  "Tuesday-7": { subject: "Agriculture", teacher: "P. Kamau" },
  "Wednesday-0": { subject: "Mathematics", teacher: "S. Wanjiku" },
  "Wednesday-1": { subject: "Social Studies", teacher: "D. Kipchoge" },
  "Wednesday-2": { subject: "History", teacher: "J. Auma" },
  "Wednesday-4": { subject: "English", teacher: "J. Otieno" },
  "Wednesday-5": { subject: "Mathematics", teacher: "S. Wanjiku" },
  "Wednesday-7": { subject: "CRE", teacher: "J. Auma" },
  "Wednesday-8": { subject: "Pre-Technical Studies", teacher: "R. Njoroge" },
  "Thursday-0": { subject: "Integrated Science", teacher: "G. Muthoni" },
  "Thursday-1": { subject: "Agriculture", teacher: "G. Muthoni" },
  "Thursday-2": { subject: "Social Studies", teacher: "P. Kamau" },
  "Thursday-4": { subject: "Mathematics", teacher: "S. Wanjiku" },
  "Thursday-5": { subject: "English", teacher: "J. Otieno" },
  "Thursday-7": { subject: "Kiswahili", teacher: "F. Hassan" },
  "Thursday-8": { subject: "History", teacher: "J. Auma" },
  "Friday-0": { subject: "Kiswahili", teacher: "F. Hassan" },
  "Friday-1": { subject: "Integrated Science", teacher: "G. Muthoni" },
  "Friday-2": { subject: "Mathematics", teacher: "S. Wanjiku" },
  "Friday-4": { subject: "Social Studies", teacher: "D. Kipchoge" },
  "Friday-5": { subject: "Pre-Technical Studies", teacher: "R. Njoroge" },
  "Friday-7": { subject: "English", teacher: "J. Otieno" },
  "Friday-8": { subject: "Social Studies", teacher: "P. Kamau" },
};

export default function TimetablePage() {
  const { currentLevel } = useAuth();
  const levelClasses = CLASSES_BY_LEVEL[currentLevel] || CLASSES_BY_LEVEL.junior;
  const [selectedClass, setSelectedClass] = useState(levelClasses[0] || "Grade 7");

  const timetable = grade7Timetable;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Timetable</h1>
          <p className="text-slate-500 text-sm mt-1">Weekly class schedules</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500 text-slate-700"
          >
            {levelClasses.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Generate Timetable
          </button>
          <button onClick={() => window.print()} className="border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium flex items-center gap-2">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex items-center gap-2">
          <Clock className="w-5 h-5 text-teal-600" />
          <span className="font-semibold text-slate-800">Weekly Schedule — {selectedClass}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">Day</th>
                {periods.map((p, i) => (
                  <th key={i} className={`px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider ${p.isBreak ? "text-slate-400 bg-slate-100" : "text-slate-500"}`}>
                    <div>{p.label}</div>
                    <div className="font-normal normal-case text-slate-400 mt-0.5">{p.time}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {days.map(day => (
                <tr key={day} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-semibold text-slate-700">{day}</td>
                  {periods.map((p, i) => {
                    if (p.isBreak) {
                      return (
                        <td key={i} className="px-2 py-3 bg-slate-100 text-center">
                          <span className="text-xs text-slate-400">{p.label}</span>
                        </td>
                      );
                    }
                    const slot = timetable[`${day}-${i}`];
                    return (
                      <td key={i} className="px-2 py-2 text-center">
                        {slot ? (
                          <div className="bg-teal-50 border border-teal-200 rounded-lg px-2 py-1.5">
                            <div className="text-xs font-semibold text-teal-800">{slot.subject}</div>
                            <div className="text-xs text-teal-600 mt-0.5">{slot.teacher}</div>
                          </div>
                        ) : (
                          <div className="h-10 rounded-lg border border-dashed border-slate-200 flex items-center justify-center">
                            <span className="text-xs text-slate-300">Free</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {Object.keys(timetable).length === 0 && (
          <div className="p-8 text-center text-slate-400 text-sm">
            No timetable data available for {selectedClass}. Click Generate Timetable to create one.
          </div>
        )}
      </div>

      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-teal-100 border border-teal-200 rounded"></div>
          <span className="text-slate-600">Occupied slot</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border border-dashed border-slate-200 rounded"></div>
          <span className="text-slate-600">Free slot</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-100 rounded"></div>
          <span className="text-slate-600">Break / Lunch</span>
        </div>
      </div>
    </div>
  );
}
