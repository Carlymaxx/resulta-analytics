"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Search, 
  Plus, 
  Filter, 
  Download,
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import { 
  CLASSES_BY_LEVEL,
  LEARNING_AREAS_BY_LEVEL,
} from "@/lib/grading";

const getMockStudentsForLevel = (level: string) => {
  const schoolId = "school-nairobi-high";
  const make = (id: number, name: string, cls: string, marks: { subject: string; score: number }[]) => {
    const total = marks.reduce((s, m) => s + m.score, 0);
    const avg = total / marks.length;
    return { id, name, class: cls, marks, total, avg, schoolId };
  };
  const primaryMarks = [
    { subject: "Mathematics", score: 78 }, { subject: "English", score: 85 },
    { subject: "Kiswahili", score: 72 }, { subject: "Science", score: 88 },
  ];
  const juniorMarks = [
    { subject: "Mathematics", score: 78 }, { subject: "English", score: 85 },
    { subject: "Integrated Science", score: 72 }, { subject: "Social Studies", score: 88 },
  ];
  const secondaryMarks = [
    { subject: "Mathematics", score: 78 }, { subject: "English", score: 85 },
    { subject: "Biology", score: 72 }, { subject: "History", score: 88 },
  ];
  const primary = [
    make(1, "Alex Johnson", "Grade 1", primaryMarks),
    make(2, "Maria Garcia", "Grade 2", primaryMarks.map(m => ({ ...m, score: m.score + 5 }))),
    make(3, "James Wilson", "Grade 3", primaryMarks.map(m => ({ ...m, score: m.score - 5 }))),
    make(4, "Sarah Lee", "Grade 4", primaryMarks.map(m => ({ ...m, score: m.score + 10 }))),
    make(5, "David Brown", "Grade 5", primaryMarks.map(m => ({ ...m, score: m.score - 10 }))),
    make(6, "Emily Chen", "Grade 6", primaryMarks.map(m => ({ ...m, score: m.score + 2 }))),
  ];
  const junior = [
    make(1, "Alex Johnson", "Grade 9", juniorMarks),
    make(2, "Maria Garcia", "Grade 9", juniorMarks.map(m => ({ ...m, score: m.score + 5 }))),
    make(3, "James Wilson", "Grade 8", juniorMarks.map(m => ({ ...m, score: m.score - 5 }))),
    make(4, "Sarah Lee", "Grade 8", juniorMarks.map(m => ({ ...m, score: m.score + 10 }))),
    make(5, "David Brown", "Grade 9", juniorMarks.map(m => ({ ...m, score: m.score - 10 }))),
    make(6, "Emily Chen", "Grade 7", juniorMarks.map(m => ({ ...m, score: m.score + 2 }))),
    make(7, "Michael Park", "Grade 8", juniorMarks.map(m => ({ ...m, score: m.score + 8 }))),
    make(8, "Lisa Thompson", "Grade 7", juniorMarks.map(m => ({ ...m, score: m.score - 3 }))),
  ];
  const secondary = [
    make(1, "Alex Johnson", "Form 4", secondaryMarks),
    make(2, "Maria Garcia", "Form 4", secondaryMarks.map(m => ({ ...m, score: m.score + 5 }))),
    make(3, "James Wilson", "Form 3", secondaryMarks.map(m => ({ ...m, score: m.score - 5 }))),
    make(4, "Sarah Lee", "Form 3", secondaryMarks.map(m => ({ ...m, score: m.score + 10 }))),
    make(5, "David Brown", "Form 4", secondaryMarks.map(m => ({ ...m, score: m.score - 10 }))),
    make(6, "Emily Chen", "Form 1", secondaryMarks.map(m => ({ ...m, score: m.score + 2 }))),
    make(7, "Michael Park", "Form 2", secondaryMarks.map(m => ({ ...m, score: m.score + 8 }))),
    make(8, "Lisa Thompson", "Form 1", secondaryMarks.map(m => ({ ...m, score: m.score - 3 }))),
  ];
  if (level === "primary") return primary;
  if (level === "secondary") return secondary;
  return junior;
};

export default function ResultsPage() {
  const { user, currentLevel } = useAuth();
  const schoolName = user?.school || "My School";
  const levelClasses = CLASSES_BY_LEVEL[currentLevel] || CLASSES_BY_LEVEL.junior;
  const classOptions = ["All Grades", ...levelClasses];
  const levelLearningAreas = LEARNING_AREAS_BY_LEVEL[currentLevel] || LEARNING_AREAS_BY_LEVEL.junior;
  const mockStudents = getMockStudentsForLevel(currentLevel);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("All Grades");
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === "All Grades" || student.class === selectedGrade;
    const matchesSchool = !user?.schoolId || student.schoolId === user.schoolId;
    return matchesSearch && matchesGrade && matchesSchool;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Results Management</h1>
          <p className="text-slate-500">View and manage student academic records for {schoolName}</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-teal-700 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Result
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="flex gap-3">
            <select
               value={selectedGrade}
               onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {classOptions.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Student</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-600">Grade</th>
                 {levelLearningAreas.slice(0, 4).map(area => (
                   <th key={area} className="text-center py-4 px-4 text-sm font-semibold text-slate-600">{area}</th>
                 ))}
                <th className="text-center py-4 px-4 text-sm font-semibold text-slate-600">Average</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((student) => (
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
                  {levelLearningAreas.slice(0, 4).map(area => {
                    const mark = student.marks.find(m => m.subject === area);
                    return (
                      <td key={area} className="py-4 px-4 text-center font-mono text-slate-800">{mark ? mark.score : "—"}</td>
                    );
                  })}
                  <td className={`py-4 px-4 text-center font-mono font-semibold ${getGradeColor(student.avg)}`}>
                    {student.avg.toFixed(1)}%
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 hover:bg-slate-100 rounded-lg" title="View">
                        <Eye className="w-4 h-4 text-slate-600" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg" title="Edit">
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg" title="Delete">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between py-4 px-6 border-t border-slate-200">
          <div className="text-sm text-slate-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg font-medium ${
                  currentPage === page 
                    ? 'bg-teal-600 text-white' 
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Result Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800">Add New Result</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Student Name</label>
                  <select className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="">Select Student</option>
                    {mockStudents.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Grade</label>
                  <select className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="">Select Grade</option>
                    {levelClasses.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              
               <div className="border-t border-slate-200 pt-6">
                 <h3 className="text-sm font-semibold text-slate-800 mb-4">Learning Area Scores</h3>
                 <div className="grid md:grid-cols-3 gap-4">
                   {levelLearningAreas.slice(0, 4).map(learningArea => (
                      <div key={learningArea}>
                        <label className="block text-sm font-medium text-slate-700 mb-2">{learningArea}</label>
                       <input 
                         type="number" 
                         min="0" 
                         max="100"
                         placeholder="0-100"
                         className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                       />
                     </div>
                   ))}
                 </div>
               </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Exam Date</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2.5 border border-slate-200 rounded-lg font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700"
                >
                  Save Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
