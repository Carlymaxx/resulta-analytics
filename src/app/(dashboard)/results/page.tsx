"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Search, 
  Plus, 
  Download,
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  FileText
} from "lucide-react";
import { 
  CLASSES_BY_LEVEL,
  LEARNING_AREAS_BY_LEVEL,
  loadRecords,
  StudentRecord,
  averageScore,
  getGrade,
} from "@/lib/grading";

export default function ResultsPage() {
  const { user, currentLevel } = useAuth();
  const schoolName = user?.school || "My School";
  const levelClasses = CLASSES_BY_LEVEL[currentLevel] || CLASSES_BY_LEVEL.junior;
  const classOptions = ["All Classes", ...levelClasses];
  const levelLearningAreas = LEARNING_AREAS_BY_LEVEL[currentLevel] || LEARNING_AREAS_BY_LEVEL.junior;
  const [records, setRecords] = useState<StudentRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("All Classes");
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setRecords(loadRecords(user?.schoolId));
  }, [user?.schoolId]);

  const filteredStudents = records.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === "All Classes" || student.className === selectedGrade;
    const matchesSchool = !user?.schoolId || student.schoolId === user.schoolId;
    return matchesSearch && matchesGrade && matchesSchool;
  });

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / itemsPerPage));
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getGradeColor = (avg: number) => {
    if (avg >= 80) return "text-green-600";
    if (avg >= 60) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Results</h1>
          <p className="text-slate-500">Student academic records for {schoolName}</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-teal-700 transition-all">
          <Plus className="w-5 h-5" /> Add Result
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <select value={selectedGrade} onChange={(e) => { setSelectedGrade(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
            {classOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Student</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-600">Class</th>
                {levelLearningAreas.map(area => (
                  <th key={area} className="text-center py-4 px-4 text-sm font-semibold text-slate-600 whitespace-nowrap">{area.length > 8 ? area.substring(0, 8) + '…' : area}</th>
                ))}
                <th className="text-center py-4 px-4 text-sm font-semibold text-slate-600">Average</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={levelLearningAreas.length + 4} className="py-12 text-center text-slate-500">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium">No results yet</p>
                    <p className="text-sm">Go to the Marks page to enter marks. Results feed Analytics, Predictions, and Reports.</p>
                  </td>
                </tr>
              ) : paginatedStudents.map((student) => {
                const avg = averageScore(student.marks);
                const grade = getGrade(avg);
                return (
                  <tr key={student.id} className="border-t border-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold">
                          {student.name.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-800">{student.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600">{student.className}</td>
                    {levelLearningAreas.map(area => {
                      const mark = student.marks.find(m => m.subject === area);
                      return (
                        <td key={area} className="py-4 px-4 text-center font-mono text-slate-800">
                          {mark ? mark.score : "—"}
                        </td>
                      );
                    })}
                    <td className={`py-4 px-4 text-center font-mono font-semibold ${getGradeColor(avg)}`}>
                      {avg.toFixed(1)}% ({grade.grade})
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 hover:bg-slate-100 rounded-lg" title="View"><Eye className="w-4 h-4 text-slate-600" /></button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg" title="Edit"><Edit2 className="w-4 h-4 text-blue-600" /></button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg" title="Delete"><Trash2 className="w-4 h-4 text-red-600" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between py-4 px-6 border-t border-slate-200 dark:border-slate-700">
            <div className="text-sm text-slate-500">Page {currentPage} of {totalPages}</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-2 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
