"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { CLASSES_BY_LEVEL, LEVEL_LABELS } from "@/lib/grading";
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
  X,
  Calendar,
  MapPin,
  UserCheck,
  FileText
} from "lucide-react";

type Student = {
  id: number;
  admNo: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  class: string;
  guardianName: string;
  guardianPhone: string;
  address: string;
  status: "Active" | "Transferred" | "Graduated";
  joined: string;
  avgScore: number;
  attendance: number;
  schoolId?: string;
};

const initialStudents: Student[] = [];

const emptyForm = {
  admNo: "",
  firstName: "",
  lastName: "",
  gender: "Male",
  dob: "",
  class: "",
  guardianName: "",
  guardianPhone: "",
  address: "",
  status: "Active" as Student["status"],
  joined: new Date().toISOString().slice(0, 10),
};

export default function StudentsPage() {
  const { user, currentLevel } = useAuth();
  const schoolName = user?.school || "My School";
  const classes = CLASSES_BY_LEVEL[currentLevel] || CLASSES_BY_LEVEL.junior;
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("All Classes");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const itemsPerPage = 8;

  const filteredStudents = students.filter(student => {
    const matchesSearch = `${student.firstName} ${student.lastName} ${student.admNo}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === "All Grades" || student.class === selectedGrade;
    const matchesSchool = !user?.schoolId || student.schoolId === user.schoolId;
    return matchesSearch && matchesGrade && matchesSchool;
  });

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / itemsPerPage));
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const selectedStudent = showViewModal ? students.find(s => s.id === showViewModal) : null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 95) return "bg-green-500";
    if (attendance >= 85) return "bg-amber-500";
    return "bg-red-500";
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const name = `${form.firstName} ${form.lastName}`.trim();
    if (!name || !form.admNo.trim()) return;
    const newStudent: Student = {
      id: Date.now(),
      admNo: form.admNo.trim(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      gender: form.gender,
      dob: form.dob,
      class: form.class,
      guardianName: form.guardianName.trim(),
      guardianPhone: form.guardianPhone.trim(),
      address: form.address.trim(),
      status: form.status,
      joined: form.joined,
      avgScore: 0,
      attendance: 0,
      schoolId: user?.schoolId,
    };
    setStudents(prev => [newStudent, ...prev]);
    setForm(emptyForm);
    setShowAddModal(false);
    setCurrentPage(1);
  };

  const handleDelete = (id: number) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Student Management</h1>
          <p className="text-slate-500 dark:text-slate-400">{LEVEL_LABELS[currentLevel]?.description || "Manage student records"}</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-teal-700 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Student
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-sm text-slate-500 dark:text-slate-400">Total Students</div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">{students.length}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-sm text-slate-500 dark:text-slate-400">Active</div>
          <div className="text-2xl font-bold text-green-600">{students.filter(s => s.status === "Active").length}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-sm text-slate-500 dark:text-slate-400">Avg Attendance</div>
          <div className="text-2xl font-bold text-teal-600">
            {students.length ? `${(students.reduce((a, s) => a + s.attendance, 0) / students.length).toFixed(1)}%` : "—"}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-sm text-slate-500 dark:text-slate-400">Avg Score</div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">
            {students.length ? `${(students.reduce((a, s) => a + s.avgScore, 0) / students.length).toFixed(1)}%` : "—"}
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
              placeholder="Search by name or admission number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="flex gap-3">
            <select
               value={selectedGrade}
               onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
               <option value="All Classes">All Classes</option>
              {classes.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600 dark:text-slate-300">Student</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Adm No</th>
                 <th className="text-left py-4 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Class</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Gender</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Guardian</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Attendance</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    No students yet. Click <span className="font-medium text-teal-600">Add Student</span> to create one.
                  </td>
                </tr>
              )}
              {paginatedStudents.map((student) => (
                <tr key={student.id} className="border-t border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-600 dark:text-teal-400 font-semibold">
                        {student.firstName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-medium text-slate-800 dark:text-white">{student.firstName} {student.lastName}</span>
                        <div className="text-xs text-slate-400">{student.joined}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400 font-mono">{student.admNo}</td>
                  <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">{student.class}</td>
                  <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">{student.gender}</td>
                  <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">{student.guardianName}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${getAttendanceColor(student.attendance)}`}
                          style={{ width: `${student.attendance}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400 w-8">{student.attendance}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setShowViewModal(student.id)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                        title="View"
                      >
                        <Eye className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg" title="Edit">
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                        title="Delete"
                      >
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
        <div className="flex items-center justify-between py-4 px-6 border-t border-slate-200 dark:border-slate-700">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {filteredStudents.length === 0
              ? "No results"
              : `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filteredStudents.length)} of ${filteredStudents.length} results`}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
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
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Add New Student</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleAddStudent}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Admission Number</label>
                  <input type="text" required value={form.admNo} onChange={(e) => setForm({ ...form, admNo: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g. ADM001" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">First Name</label>
                  <input type="text" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Last Name</label>
                  <input type="text" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Gender</label>
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Date of Birth</label>
                  <input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Class</label>
                  <select value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    {classes.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Guardian / Parent Name</label>
                <input type="text" required value={form.guardianName} onChange={(e) => setForm({ ...form, guardianName: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Full name of parent or guardian" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Guardian Phone</label>
                <input type="tel" required value={form.guardianPhone} onChange={(e) => setForm({ ...form, guardianPhone: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="07XX-XXX-XXX" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Address</label>
                <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Residential address" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Student["status"] })} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Active</option>
                    <option>Transferred</option>
                    <option>Graduated</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Registration Date</label>
                  <input type="date" value={form.joined} onChange={(e) => setForm({ ...form, joined: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700">Add Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Student Modal */}
      {showViewModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Student Profile</h2>
              <button onClick={() => setShowViewModal(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-600 dark:text-teal-400 text-2xl font-bold">
                  {selectedStudent.firstName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{selectedStudent.firstName} {selectedStudent.lastName}</h3>
                  <p className="text-slate-500 dark:text-slate-400">{selectedStudent.class} · {selectedStudent.gender}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                    selectedStudent.status === "Active" ? "bg-green-100 text-green-700" :
                    selectedStudent.status === "Transferred" ? "bg-amber-100 text-amber-700" :
                    "bg-blue-100 text-blue-700"
                  }`}>{selectedStudent.status}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-400">Admission No: <span className="font-medium text-slate-800 dark:text-white">{selectedStudent.admNo}</span></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-400">DOB: <span className="font-medium text-slate-800 dark:text-white">{selectedStudent.dob || "—"}</span></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-400">Joined: <span className="font-medium text-slate-800 dark:text-white">{selectedStudent.joined}</span></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-400">{selectedStudent.address || "—"}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-400">Guardian: <span className="font-medium text-slate-800 dark:text-white">{selectedStudent.guardianName}</span></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-600 dark:text-slate-400">Guardian Phone: <span className="font-medium text-slate-800 dark:text-white">{selectedStudent.guardianPhone || "—"}</span></span>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="text-sm text-slate-500 dark:text-slate-400">Average Score</div>
                    <div className={`text-2xl font-bold ${getScoreColor(selectedStudent.avgScore)}`}>{selectedStudent.avgScore}%</div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="text-sm text-slate-500 dark:text-slate-400">Attendance</div>
                    <div className="text-2xl font-bold text-teal-600">{selectedStudent.attendance}%</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700">View Results</button>
                <button className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">Edit Profile</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
