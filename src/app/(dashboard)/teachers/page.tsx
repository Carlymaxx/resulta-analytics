"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { CLASSES } from "@/lib/grading";
import { UserCheck, Plus, Search, X, Eye, Trash2, Phone, Mail, BookOpen } from "lucide-react";

type Teacher = {
  id: number;
  name: string;
  empId: string;
  subject: string;
  classAssigned: string;
  email: string;
  phone: string;
  type: string;
  status: string;
  joined: string;
  qualification: string;
};

const initialTeachers: Teacher[] = [];

export default function TeachersPage() {
  const { user } = useAuth();
  const schoolName = user?.school || "My School";
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [viewTeacher, setViewTeacher] = useState<Teacher | null>(null);
  const [form, setForm] = useState({ name: "", empId: "", email: "", phone: "", subject: "", classAssigned: "", type: "Full-time", qualification: "" });

  const filtered = teachers.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.empId.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase())
  );

  const total = teachers.length;
  const fullTime = teachers.filter(t => t.type === "Full-time").length;
  const partTime = teachers.filter(t => t.type === "Part-time").length;
  const onLeave = teachers.filter(t => t.status === "On Leave").length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.empId.trim()) return;
    const newTeacher: Teacher = {
      id: Date.now(),
      name: form.name,
      empId: form.empId,
      subject: form.subject,
      classAssigned: form.classAssigned,
      email: form.email,
      phone: form.phone,
      type: form.type,
      status: "Active",
      joined: new Date().toISOString().slice(0, 10),
      qualification: form.qualification,
    };
    setTeachers(prev => [newTeacher, ...prev]);
    setShowAdd(false);
    setForm({ name: "", empId: "", email: "", phone: "", subject: "", classAssigned: "", type: "Full-time", qualification: "" });
  };

  const handleDelete = (id: number) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Teachers</h1>
          <p className="text-slate-500 text-sm mt-1">Manage teaching staff at {schoolName}</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Teacher
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Teachers", value: String(total), color: "text-teal-600", bg: "bg-teal-50" },
          { label: "Full-time", value: String(fullTime), color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Part-time", value: String(partTime), color: "text-purple-600", bg: "bg-purple-50" },
          { label: "On Leave", value: String(onLeave), color: "text-amber-600", bg: "bg-amber-50" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
              <UserCheck className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className="text-2xl font-bold text-slate-800">{s.value}</div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <div className="flex items-center bg-slate-100 rounded-lg px-3 py-2 flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search teachers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-sm ml-2 text-slate-800 placeholder-slate-400 w-full"
            />
          </div>
          <span className="text-sm text-slate-500">{filtered.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {["Name", "Employee ID", "Subject", "Class", "Type", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    No teachers yet. Click <span className="font-medium text-teal-600">Add Teacher</span> to create one.
                  </td>
                </tr>
              )}
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold text-xs">
                        {t.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="font-medium text-slate-800 text-sm">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{t.empId}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{t.subject}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{t.classAssigned}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.type === "Full-time" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.status === "Active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setViewTeacher(t)} className="border border-slate-200 text-slate-700 px-3 py-1 rounded-lg hover:bg-slate-50 transition-colors text-xs font-medium flex items-center gap-1">
                        <Eye className="w-3 h-3" /> View
                      </button>
                      <button onClick={() => handleDelete(t.id)} className="border border-slate-200 text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors text-xs font-medium flex items-center gap-1" title="Delete">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Teacher Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Add New Teacher</h2>
              <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" placeholder="Full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Employee ID</label>
                  <input value={form.empId} onChange={e => setForm({ ...form, empId: e.target.value })} required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" placeholder="EMP009" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" placeholder="email@school.edu" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" placeholder="07XX-XXX-XXX" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                  <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" placeholder="Mathematics" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Class Assigned</label>
                  <select value={form.classAssigned} onChange={e => setForm({ ...form, classAssigned: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500">
                    <option value="">Select class</option>
                    {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Qualification</label>
                  <input value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" placeholder="e.g. B.Ed, B.Sc, M.Sc" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Employment Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500">
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex-1">Add Teacher</button>
                <button type="button" onClick={() => setShowAdd(false)} className="border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Profile Modal */}
      {viewTeacher && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Teacher Profile</h2>
              <button onClick={() => setViewTeacher(null)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xl">
                  {viewTeacher.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-800">{viewTeacher.name}</div>
                  <div className="text-sm text-slate-500">{viewTeacher.empId}</div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${viewTeacher.status === "Active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{viewTeacher.status}</span>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { icon: BookOpen, label: "Subject", value: viewTeacher.subject },
                  { icon: BookOpen, label: "Class", value: viewTeacher.classAssigned },
                  { icon: Mail, label: "Email", value: viewTeacher.email },
                  { icon: Phone, label: "Phone", value: viewTeacher.phone },
                  { icon: UserCheck, label: "Type", value: viewTeacher.type },
                  { icon: UserCheck, label: "Qualification", value: viewTeacher.qualification || "—" },
                  { icon: UserCheck, label: "Joined", value: viewTeacher.joined },
                ].map(row => (
                  <div key={row.label} className="flex items-center gap-3 text-sm">
                    <row.icon className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-500 w-24">{row.label}:</span>
                    <span className="text-slate-800 font-medium">{row.value || "—"}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setViewTeacher(null)} className="mt-6 w-full border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

