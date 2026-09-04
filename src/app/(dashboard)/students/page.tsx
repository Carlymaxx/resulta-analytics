"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { CLASSES_BY_LEVEL, LEVEL_LABELS } from "@/lib/grading";
import { Student, loadStudents, saveStudent, deleteStudent, getStudentCount, logAudit } from "@/lib/schoolStore";
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

const emptyForm = {
  admNo: "",
  firstName: "",
  lastName: "",
  gender: "Male" as "Male" | "Female",
  dob: "",
  class: "",
  guardianName: "",
  guardianPhone: "",
  address: "",
  status: "Active" as Student["status"],
  joined: new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Nairobi" }),
};

export default function StudentsPage() {
  const { user, currentLevel } = useAuth();
  const schoolName = user?.school || "My School";
  const classes = CLASSES_BY_LEVEL[currentLevel] || CLASSES_BY_LEVEL.junior;
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("All Classes");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const itemsPerPage = 8;

  useEffect(() => {
    setStudents(loadStudents(user?.schoolId));
  }, [user?.schoolId]);

  const filteredStudents = students.filter(student => {
    const matchesSearch = `${student.firstName} ${student.lastName} ${student.admNo}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === "All Classes" || student.class === selectedGrade;
    const matchesSchool = !user?.schoolId || student.schoolId === user.schoolId;
    return matchesSearch && matchesGrade && matchesSchool;
  });

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / itemsPerPage));
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim() || !form.admNo.trim()) return;
    const newStudent: Student = {
      id: Date.now(),
      admNo: form.admNo.trim(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      gender: form.gender,
      dob: form.dob,
      class: form.class || classes[0] || "Grade 1",
      guardianName: form.guardianName.trim(),
      guardianPhone: form.guardianPhone.trim(),
      address: form.address.trim(),
      status: form.status,
      joined: form.joined,
      level: currentLevel,
    };
    const saved = saveStudent(newStudent, user?.schoolId);
    setStudents(prev => [saved, ...prev]);
    if (user) {
      logAudit({ userId: user.id, userName: user.name, userRole: user.role, action: "CREATE", module: "students", details: `Added student ${saved.firstName} ${saved.lastName}` }, user.schoolId);
    }
    setShowAddModal(false);
    setForm(emptyForm);
  };

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`Delete ${name}? This action cannot be undone.`)) return;
    deleteStudent(id, user?.schoolId);
    setStudents(prev => prev.filter(s => s.id !== id));
    if (user) {
      logAudit({ userId: user.id, userName: user.name, userRole: user.role, action: "DELETE", module: "students", details: `Deleted student ${name}` }, user.schoolId);
    }
  };

  const viewedStudent = showViewModal !== null ? students.find(s => s.id === showViewModal) : null;
  const activeCount = students.filter(s => s.status === "Active" && (!user?.schoolId || s.schoolId === user.schoolId)).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Students</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage student records for {schoolName}</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-teal-700 transition-all">
          <Plus className="w-5 h-5" /> Add Student
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-9 h-9 rounded-lg bg-teal-100 dark:bg-teal-900 flex items-center justify-center mb-2">
            <UserCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">{activeCount}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Active Students</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-2">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">{classes.length}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Grade Levels</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mb-2">
            <UserCheck className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">
            {students.filter(s => s.status === "Active" && s.gender === "Male" && (!user?.schoolId || s.schoolId === user.schoolId)).length}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Male</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-9 h-9 rounded-lg bg-pink-100 dark:bg-pink-900 flex items-center justify-center mb-2">
            <UserCheck className="w-4 h-4 text-pink-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">
            {students.filter(s => s.status === "Active" && s.gender === "Female" && (!user?.schoolId || s.schoolId === user.schoolId)).length}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Female</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or admission number..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <select
            value={selectedGrade}
            onChange={(e) => { setSelectedGrade(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option>All Classes</option>
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
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
                {["Adm No", "Name", "Class", "Gender", "Guardian", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium">No students yet</p>
                    <p className="text-sm">Click "Add Student" to enroll your first student at {schoolName}</p>
                  </td>
                </tr>
              ) : paginatedStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-3 px-4 text-sm font-mono text-slate-800 dark:text-white">{s.admNo}</td>
                  <td className="py-3 px-4 text-sm font-medium text-slate-800 dark:text-white">{s.firstName} {s.lastName}</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{s.class}</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{s.gender}</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{s.guardianName || "—"}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${s.status === "Active" ? "bg-green-100 text-green-700" : s.status === "Transferred" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setShowViewModal(s.id)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg" title="View">
                        <Eye className="w-4 h-4 text-slate-600" />
                      </button>
                      <button onClick={() => handleDelete(s.id, `${s.firstName} ${s.lastName}`)} className="p-1.5 hover:bg-red-50 rounded-lg" title="Delete">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Add New Student</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Admission No *</label>
                  <input value={form.admNo} onChange={(e) => setForm({ ...form, admNo: e.target.value })} required className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Class *</label>
                  <select value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">First Name *</label>
                  <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Last Name *</label>
                  <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Gender</label>
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value as "Male" | "Female" })} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Male</option><option>Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Date of Birth</label>
                  <input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Guardian Name</label>
                  <input value={form.guardianName} onChange={(e) => setForm({ ...form, guardianName: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Guardian Phone</label>
                  <input value={form.guardianPhone} onChange={(e) => setForm({ ...form, guardianPhone: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Address</label>
                  <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700">Save Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Student Details</h2>
              <button onClick={() => setShowViewModal(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500">Name:</span> <span className="font-semibold text-slate-800 dark:text-white">{viewedStudent.firstName} {viewedStudent.lastName}</span></div>
                <div><span className="text-slate-500">Admission No:</span> <span className="font-mono font-semibold text-slate-800 dark:text-white">{viewedStudent.admNo}</span></div>
                <div><span className="text-slate-500">Class:</span> <span className="font-semibold text-slate-800 dark:text-white">{viewedStudent.class}</span></div>
                <div><span className="text-slate-500">Gender:</span> <span className="font-semibold text-slate-800 dark:text-white">{viewedStudent.gender}</span></div>
                <div><span className="text-slate-500">Date of Birth:</span> <span className="font-semibold text-slate-800 dark:text-white">{viewedStudent.dob || "—"}</span></div>
                <div><span className="text-slate-500">Joined:</span> <span className="font-semibold text-slate-800 dark:text-white">{viewedStudent.joined}</span></div>
                <div><span className="text-slate-500">Guardian:</span> <span className="font-semibold text-slate-800 dark:text-white">{viewedStudent.guardianName || "—"}</span></div>
                <div><span className="text-slate-500">Phone:</span> <span className="font-semibold text-slate-800 dark:text-white">{viewedStudent.guardianPhone || "—"}</span></div>
                <div className="col-span-2"><span className="text-slate-500">Address:</span> <span className="font-semibold text-slate-800 dark:text-white">{viewedStudent.address || "—"}</span></div>
                <div><span className="text-slate-500">Status:</span> <span className="font-semibold text-slate-800 dark:text-white">{viewedStudent.status}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
