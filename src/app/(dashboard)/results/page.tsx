"use client";

import { useState } from "react";
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

const mockStudents = [
  { id: 1, name: "Alex Johnson", class: "10-A", math: 78, english: 85, science: 72, history: 88, total: 323, avg: 80.75 },
  { id: 2, name: "Maria Garcia", class: "10-A", math: 92, english: 88, science: 85, history: 90, total: 355, avg: 88.75 },
  { id: 3, name: "James Wilson", class: "10-B", math: 65, english: 72, science: 58, history: 70, total: 265, avg: 66.25 },
  { id: 4, name: "Sarah Lee", class: "9-A", math: 88, english: 91, science: 84, history: 86, total: 349, avg: 87.25 },
  { id: 5, name: "David Brown", class: "10-A", math: 55, english: 62, science: 48, history: 58, total: 223, avg: 55.75 },
  { id: 6, name: "Emily Chen", class: "9-B", math: 81, english: 86, science: 79, history: 83, total: 329, avg: 82.25 },
  { id: 7, name: "Michael Park", class: "11-A", math: 94, english: 90, science: 91, history: 87, total: 362, avg: 90.5 },
  { id: 8, name: "Lisa Thompson", class: "10-C", math: 70, english: 75, science: 68, history: 72, total: 285, avg: 71.25 },
];

const classes = ["All Classes", "10-A", "10-B", "10-C", "9-A", "9-B", "11-A"];
const subjects = ["Math", "English", "Science", "History", "Geography", "Physics"];

export default function ResultsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === "All Classes" || student.class === selectedClass;
    return matchesSearch && matchesClass;
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
          <p className="text-slate-500">View and manage student academic records</p>
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
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {classes.map(c => (
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
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-600">Class</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-slate-600">Math</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-slate-600">English</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-slate-600">Science</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-slate-600">History</th>
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
                  <td className="py-4 px-4 text-center font-mono text-slate-800">{student.math}</td>
                  <td className="py-4 px-4 text-center font-mono text-slate-800">{student.english}</td>
                  <td className="py-4 px-4 text-center font-mono text-slate-800">{student.science}</td>
                  <td className="py-4 px-4 text-center font-mono text-slate-800">{student.history}</td>
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">Class</label>
                  <select className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="">Select Class</option>
                    {classes.filter(c => c !== "All Classes").map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-sm font-semibold text-slate-800 mb-4">Subject Scores</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {subjects.slice(0, 4).map(subject => (
                    <div key={subject}>
                      <label className="block text-sm font-medium text-slate-700 mb-2">{subject}</label>
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