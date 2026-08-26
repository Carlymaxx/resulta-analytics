"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Clock, Printer, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { CLASSES_BY_LEVEL, LEARNING_AREAS_BY_LEVEL } from "@/lib/grading";

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

type SlotData = { subject: string; teacher: string };
type TimetableData = Record<string, SlotData>;

const TEACHERS = [
  "S. Wanjiku", "J. Otieno", "G. Muthoni", "P. Kamau", "F. Hassan",
  "D. Kipchoge", "R. Njoroge", "J. Auma", "M. Ochieng", "A. Njeri",
  "K. Mutiso", "L. Akinyi", "B. Odhiambo", "C. Wambui", "E. Kiprono",
];

function generateTimetableForLevel(level: string, className: string): TimetableData {
  const learningAreas = LEARNING_AREAS_BY_LEVEL[level] || LEARNING_AREAS_BY_LEVEL.junior;
  const timetable: TimetableData = {};
  const teachingPeriods = periods.filter(p => !p.isBreak);
  const totalSlots = days.length * teachingPeriods.length;

  const subjectCounts: Record<string, number> = {};
  learningAreas.forEach(subject => {
    subjectCounts[subject] = Math.max(2, Math.floor(totalSlots / learningAreas.length));
  });

  let teacherIdx = 0;
  const subjectTeachers: Record<string, string> = {};
  learningAreas.forEach(subject => {
    subjectTeachers[subject] = TEACHERS[teacherIdx % TEACHERS.length];
    teacherIdx++;
  });

  const seed = className.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) +
    level.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const shuffledSubjects: string[] = [];
  learningAreas.forEach(subject => {
    for (let i = 0; i < subjectCounts[subject]; i++) {
      shuffledSubjects.push(subject);
    }
  });

  while (shuffledSubjects.length < totalSlots) {
    shuffledSubjects.push(learningAreas[shuffledSubjects.length % learningAreas.length]);
  }

  const pseudoRandomShuffle = (arr: string[], seedVal: number) => {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const x = Math.sin(seedVal + i) * 10000;
      const j = Math.floor((x - Math.floor(x)) * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  const distributed = pseudoRandomShuffle(shuffledSubjects, seed);

  let slotIdx = 0;
  days.forEach(day => {
    teachingPeriods.forEach((_, periodIdx) => {
      const actualPeriodIdx = periodIdx < 3 ? periodIdx : periodIdx + 1;
      const subject = distributed[slotIdx % distributed.length];
      timetable[`${day}-${actualPeriodIdx}`] = {
        subject,
        teacher: subjectTeachers[subject],
      };
      slotIdx++;
    });
  });

  return timetable;
}

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
  "Wednesday-2": { subject: "English", teacher: "J. Otieno" },
  "Wednesday-4": { subject: "Kiswahili", teacher: "F. Hassan" },
  "Wednesday-5": { subject: "Mathematics", teacher: "S. Wanjiku" },
  "Wednesday-7": { subject: "Christian Religious Education", teacher: "J. Auma" },
  "Thursday-0": { subject: "Integrated Science", teacher: "G. Muthoni" },
  "Thursday-1": { subject: "Agriculture", teacher: "G. Muthoni" },
  "Thursday-2": { subject: "Social Studies", teacher: "P. Kamau" },
  "Thursday-4": { subject: "Mathematics", teacher: "S. Wanjiku" },
  "Thursday-5": { subject: "English", teacher: "J. Otieno" },
  "Thursday-7": { subject: "Kiswahili", teacher: "F. Hassan" },
  "Friday-0": { subject: "Kiswahili", teacher: "F. Hassan" },
  "Friday-1": { subject: "Integrated Science", teacher: "G. Muthoni" },
  "Friday-2": { subject: "Mathematics", teacher: "S. Wanjiku" },
  "Friday-4": { subject: "Social Studies", teacher: "D. Kipchoge" },
  "Friday-5": { subject: "Pre-Technical Studies", teacher: "R. Njoroge" },
  "Friday-7": { subject: "English", teacher: "J. Otieno" },
};

const grade8Timetable: TimetableData = {
  "Monday-0": { subject: "English", teacher: "J. Otieno" },
  "Monday-1": { subject: "Mathematics", teacher: "S. Wanjiku" },
  "Monday-2": { subject: "Integrated Science", teacher: "G. Muthoni" },
  "Monday-4": { subject: "Kiswahili", teacher: "F. Hassan" },
  "Monday-5": { subject: "Social Studies", teacher: "P. Kamau" },
  "Monday-7": { subject: "Agriculture", teacher: "P. Kamau" },
  "Tuesday-0": { subject: "Mathematics", teacher: "S. Wanjiku" },
  "Tuesday-1": { subject: "English", teacher: "J. Otieno" },
  "Tuesday-2": { subject: "Pre-Technical Studies", teacher: "R. Njoroge" },
  "Tuesday-4": { subject: "Integrated Science", teacher: "G. Muthoni" },
  "Tuesday-5": { subject: "Creative Arts and Sports", teacher: "D. Kipchoge" },
  "Tuesday-7": { subject: "Christian Religious Education", teacher: "J. Auma" },
  "Wednesday-0": { subject: "Kiswahili", teacher: "F. Hassan" },
  "Wednesday-1": { subject: "Mathematics", teacher: "S. Wanjiku" },
  "Wednesday-2": { subject: "English", teacher: "J. Otieno" },
  "Wednesday-4": { subject: "Social Studies", teacher: "D. Kipchoge" },
  "Wednesday-5": { subject: "Integrated Science", teacher: "G. Muthoni" },
  "Wednesday-7": { subject: "Pre-Technical Studies", teacher: "R. Njoroge" },
  "Thursday-0": { subject: "Mathematics", teacher: "S. Wanjiku" },
  "Thursday-1": { subject: "Agriculture", teacher: "G. Muthoni" },
  "Thursday-2": { subject: "English", teacher: "J. Otieno" },
  "Thursday-4": { subject: "Kiswahili", teacher: "F. Hassan" },
  "Thursday-5": { subject: "Creative Arts and Sports", teacher: "D. Kipchoge" },
  "Thursday-7": { subject: "Christian Religious Education", teacher: "J. Auma" },
  "Friday-0": { subject: "Integrated Science", teacher: "G. Muthoni" },
  "Friday-1": { subject: "Social Studies", teacher: "P. Kamau" },
  "Friday-2": { subject: "Mathematics", teacher: "S. Wanjiku" },
  "Friday-4": { subject: "English", teacher: "J. Otieno" },
  "Friday-5": { subject: "Pre-Technical Studies", teacher: "R. Njoroge" },
  "Friday-7": { subject: "Kiswahili", teacher: "F. Hassan" },
};

const grade9Timetable: TimetableData = {
  "Monday-0": { subject: "Mathematics", teacher: "S. Wanjiku" },
  "Monday-1": { subject: "English", teacher: "J. Otieno" },
  "Monday-2": { subject: "Integrated Science", teacher: "G. Muthoni" },
  "Monday-4": { subject: "Kiswahili", teacher: "F. Hassan" },
  "Monday-5": { subject: "Social Studies", teacher: "P. Kamau" },
  "Monday-7": { subject: "Pre-Technical Studies", teacher: "R. Njoroge" },
  "Tuesday-0": { subject: "English", teacher: "J. Otieno" },
  "Tuesday-1": { subject: "Mathematics", teacher: "S. Wanjiku" },
  "Tuesday-2": { subject: "Agriculture", teacher: "G. Muthoni" },
  "Tuesday-4": { subject: "Christian Religious Education", teacher: "J. Auma" },
  "Tuesday-5": { subject: "Integrated Science", teacher: "G. Muthoni" },
  "Tuesday-7": { subject: "Creative Arts and Sports", teacher: "D. Kipchoge" },
  "Wednesday-0": { subject: "Kiswahili", teacher: "F. Hassan" },
  "Wednesday-1": { subject: "Social Studies", teacher: "D. Kipchoge" },
  "Wednesday-2": { subject: "Mathematics", teacher: "S. Wanjiku" },
  "Wednesday-4": { subject: "English", teacher: "J. Otieno" },
  "Wednesday-5": { subject: "Pre-Technical Studies", teacher: "R. Njoroge" },
  "Wednesday-7": { subject: "Agriculture", teacher: "P. Kamau" },
  "Thursday-0": { subject: "Integrated Science", teacher: "G. Muthoni" },
  "Thursday-1": { subject: "Mathematics", teacher: "S. Wanjiku" },
  "Thursday-2": { subject: "Kiswahili", teacher: "F. Hassan" },
  "Thursday-4": { subject: "Christian Religious Education", teacher: "J. Auma" },
  "Thursday-5": { subject: "English", teacher: "J. Otieno" },
  "Thursday-7": { subject: "Creative Arts and Sports", teacher: "D. Kipchoge" },
  "Friday-0": { subject: "Social Studies", teacher: "P. Kamau" },
  "Friday-1": { subject: "Mathematics", teacher: "S. Wanjiku" },
  "Friday-2": { subject: "Integrated Science", teacher: "G. Muthoni" },
  "Friday-4": { subject: "English", teacher: "J. Otieno" },
  "Friday-5": { subject: "Kiswahili", teacher: "F. Hassan" },
  "Friday-7": { subject: "Pre-Technical Studies", teacher: "R. Njoroge" },
};

export default function TimetablePage() {
  const { currentLevel } = useAuth();
  const levelClasses = CLASSES_BY_LEVEL[currentLevel] || CLASSES_BY_LEVEL.junior;
  const [selectedClass, setSelectedClass] = useState(levelClasses[0] || "Grade 7");
  const [generatedTimetables, setGeneratedTimetables] = useState<Record<string, TimetableData>>({});

  const validSelectedClass = levelClasses.includes(selectedClass) ? selectedClass : levelClasses[0] || "Grade 7";

  const timetable = useMemo(() => {
    const cacheKey = `${currentLevel}-${selectedClass}`;
    if (generatedTimetables[cacheKey]) {
      return generatedTimetables[cacheKey];
    }
    if (currentLevel === "junior") {
      if (selectedClass.includes("Grade 8")) return grade8Timetable;
      if (selectedClass.includes("Grade 9")) return grade9Timetable;
      return grade7Timetable;
    }
    return {};
  }, [selectedClass, currentLevel, generatedTimetables]);

  const generateTimetable = useCallback(() => {
    const cacheKey = `${currentLevel}-${selectedClass}`;
    const newTimetable = generateTimetableForLevel(currentLevel, selectedClass);
    setGeneratedTimetables(prev => ({
      ...prev,
      [cacheKey]: newTimetable,
    }));
  }, [currentLevel, selectedClass]);

  const hasTimetable = Object.keys(timetable).length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Timetable</h1>
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
          <button onClick={generateTimetable} className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all text-sm font-medium flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Generate Timetable
          </button>
          <button onClick={() => window.print()} className="border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm font-medium flex items-center gap-2">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="p-4 border-b border-slate-200 flex items-center gap-2">
          <Clock className="w-5 h-5 text-teal-600" />
          <span className="font-semibold text-slate-800">Weekly Schedule — {selectedClass}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider w-24">Day</th>
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
                <tr key={day} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
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
        {!hasTimetable && (
          <div className="p-8 text-center text-slate-400 text-sm">
            No timetable data available for {selectedClass}. Click Generate Timetable to create one.
          </div>
        )}
      </div>

      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-teal-100 border border-teal-200 rounded"></div>
          <span className="text-slate-600 dark:text-slate-400">Occupied slot</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border border-dashed border-slate-200 rounded"></div>
          <span className="text-slate-600 dark:text-slate-400">Free slot</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-100 rounded"></div>
          <span className="text-slate-600 dark:text-slate-400">Break / Lunch</span>
        </div>
      </div>
    </div>
  );
}
