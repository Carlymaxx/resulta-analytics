"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Edit2,
  Users,
  BookOpen,
  CheckCircle,
  X,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { loadStudents, loadStaff, getStudentCount, logAudit, loadSettings, isOnboarded } from "@/lib/schoolStore";
import { useAuth } from "@/context/AuthContext";

type ClassInfo = {
  id: number;
  name: string;
  students: number;
  learningAreas: number;
  classTeacher: string;
};

export default function ClassesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalStaff, setTotalStaff] = useState(0);
  const [learningAreas, setLearningAreas] = useState(0);

  useEffect(() => {
    if (!user) return;
    if (!isOnboarded(user.schoolId)) {
      router.push("/onboarding");
      return;
    }
    const students = loadStudents(user.schoolId);
    const staff = loadStaff(user.schoolId);
    const settings = loadSettings(user.schoolId);
    setTotalStudents(getStudentCount(user.schoolId));
    setTotalStaff(staff.length);

    const classNames = Array.from(new Set(students.map(s => s.class).filter(Boolean)));
    const configuredClasses = settings ? Object.keys(settings).includes("schoolId") ? getConfiguredClasses(settings) : [] : [];
    const allClassNames = Array.from(new Set([...configuredClasses, ...classNames]));

    const list: ClassInfo[] = allClassNames.map((name, i) => ({
      id: i + 1,
      name,
      students: students.filter(s => s.class === name && s.status === "Active").length,
      learningAreas: settings ? (settings.curriculum === "CBC" ? 8 : settings.curriculum === "KCSE" ? 10 : 5) : 0,
      classTeacher: staff[0]?.name || "—",
    }));
    setClasses(list);
    setLearningAreas(settings?.curriculum === "CBC" ? 8 : settings?.curriculum === "KCSE" ? 10 : 5);
    setShowWelcome(students.length === 0);
  }, [user, router]);

  const filteredClasses = classes.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      {showWelcome && (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-slate-800 mb-1">No classes yet</h2>
              <p className="text-slate-600 text-sm mb-3">Classes will appear here automatically as soon as you add students. You can also configure them during onboarding.</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => router.push("/students")} className="inline-flex items-center gap-1.5 bg-teal-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-teal-700">
                  <Users className="w-3.5 h-3.5" /> Add Students <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => router.push("/onboarding")} className="inline-flex items-center gap-1.5 bg-white text-teal-700 border border-teal-200 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-teal-50">
                  Re-run Setup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Classes</h1>
          <p className="text-slate-500">Manage your school's grade levels and class assignments</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center mb-3">
            <GraduationCap className="w-5 h-5 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">{classes.length}</div>
          <div className="text-xs text-slate-500">Active Classes</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">{totalStudents}</div>
          <div className="text-xs text-slate-500">Total Students</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
            <BookOpen className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">{learningAreas}</div>
          <div className="text-xs text-slate-500">Learning Areas</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">{totalStaff}</div>
          <div className="text-xs text-slate-500">Total Staff</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input type="text" placeholder="Search classes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white" />
        </div>
      </div>

      {filteredClasses.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 shadow-sm border border-slate-200 dark:border-slate-700 text-center">
          <GraduationCap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">No classes yet</h3>
          <p className="text-slate-500 text-sm mb-4">Add your first student or re-run setup to create classes.</p>
          <button onClick={() => router.push("/students")} className="inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700">
            <Plus className="w-4 h-4" /> Add Students
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClasses.map((cls) => (
            <div key={cls.id} className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white">
                  <GraduationCap className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">{cls.name}</h3>
              <p className="text-sm text-slate-500 mb-3">Class Teacher: {cls.classTeacher}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-2 text-center">
                  <div className="font-bold text-slate-800 dark:text-white">{cls.students}</div>
                  <div className="text-xs text-slate-500">Students</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-2 text-center">
                  <div className="font-bold text-slate-800 dark:text-white">{cls.learningAreas}</div>
                  <div className="text-xs text-slate-500">Subjects</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getConfiguredClasses(settings: any): string[] {
  if (!settings) return [];
  if (settings.schoolType === "primary") return ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"];
  if (settings.schoolType === "junior") return ["Grade 7", "Grade 8", "Grade 9"];
  if (settings.schoolType === "secondary") return ["Grade 10", "Grade 11", "Grade 12"];
  if (settings.schoolType === "tvet") return ["Year 1", "Year 2", "Year 3"];
  if (settings.schoolType === "college") return ["Year 1", "Year 2", "Year 3", "Year 4"];
  return ["Class A", "Class B"];
}
