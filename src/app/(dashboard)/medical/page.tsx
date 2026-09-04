"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Heart, Plus, X, Lock, AlertTriangle } from "lucide-react";
import { loadStudents, logAudit, MedicalRecord, canAccessMedical, saveMedicalRecord, encryptMedicalData } from "@/lib/schoolStore";

type ClinicVisit = {
  id: number;
  studentName: string;
  class: string;
  date: string;
  complaint: string;
  diagnosis: string;
  treatment: string;
  nurse: string;
  schoolId?: string;
};

const VISITS_KEY = "clinic_visits";
const HEALTH_KEY = "health_records";

function loadVisits(schoolId?: string): ClinicVisit[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`resulta_${VISITS_KEY}${schoolId ? `_${schoolId}` : ""}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function loadHealthRecords(schoolId?: string): any[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`resulta_${HEALTH_KEY}${schoolId ? `_${schoolId}` : ""}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export default function MedicalPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Clinic Visits");
  const [showVisit, setShowVisit] = useState(false);
  const [visitForm, setVisitForm] = useState({ studentId: "", complaint: "", diagnosis: "", treatment: "" });
  const [students, setStudents] = useState<ReturnType<typeof loadStudents>>([]);
  const [visits, setVisits] = useState<ClinicVisit[]>([]);
  const [healthRecords, setHealthRecords] = useState<any[]>([]);

  useEffect(() => {
    setStudents(loadStudents(user?.schoolId));
    setVisits(loadVisits(user?.schoolId));
    setHealthRecords(loadHealthRecords(user?.schoolId));
  }, [user?.schoolId]);

  if (!user) return null;

  if (!canAccessMedical(user.role)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Restricted Access</h2>
          <p className="text-slate-500 mb-2">Medical records are highly sensitive and protected.</p>
          <p className="text-sm text-slate-400">Only nurses, principals, and administrators can access this module. All access is logged.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    logAudit(
      { userId: user.id, userName: user.name, userRole: user.role, action: "VIEW", module: "medical", details: `Viewed medical records (encrypted)` },
      user.schoolId
    );
  }, [user]);

  const handleVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const student = students.find(s => s.id === Number(visitForm.studentId));
    if (!student) return;
    const newVisit: ClinicVisit = {
      id: Date.now(),
      studentName: `${student.firstName} ${student.lastName}`,
      class: student.class,
      date: new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Nairobi" }),
      complaint: encryptMedicalData(visitForm.complaint),
      diagnosis: encryptMedicalData(visitForm.diagnosis),
      treatment: encryptMedicalData(visitForm.treatment),
      nurse: user.name,
      schoolId: user.schoolId,
    };
    const updated = [newVisit, ...visits];
    setVisits(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(`resulta_${VISITS_KEY}${user.schoolId ? `_${user.schoolId}` : ""}`, JSON.stringify(updated));
    }
    logAudit(
      { userId: user.id, userName: user.name, userRole: user.role, action: "CREATE", module: "medical", details: `Recorded clinic visit for ${newVisit.studentName}` },
      user.schoolId
    );
    setShowVisit(false);
    setVisitForm({ studentId: "", complaint: "", diagnosis: "", treatment: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Medical</h1>
          <p className="text-slate-500 text-sm mt-1">Encrypted health records and clinic visits</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">
            <Lock className="w-3 h-3" /> Encrypted & Role-Restricted
          </span>
          <button onClick={() => setShowVisit(true)} className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" /> Record Visit
          </button>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <strong>Confidential:</strong> All medical data is encrypted and access is restricted to authorized personnel only.
          Every view and modification is recorded in the audit log.
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="border-b border-slate-200 px-6">
          <div className="flex gap-6">
            {["Clinic Visits"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? "border-teal-600 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6">
          {activeTab === "Clinic Visits" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    {["Student", "Class", "Date", "Complaint", "Diagnosis", "Treatment", "Nurse"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visits.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        <Heart className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                        <p className="font-medium">No clinic visits recorded</p>
                        <p className="text-sm">Click "Record Visit" to log the first visit. All records are encrypted.</p>
                      </td>
                    </tr>
                  ) : visits.map(v => (
                    <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">{v.studentName}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{v.class}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{v.date}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 font-mono text-xs">{v.complaint.substring(0, 20)}…</td>
                      <td className="px-4 py-3 text-sm text-slate-700 font-medium">{v.diagnosis.substring(0, 20)}…</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{v.treatment.substring(0, 20)}…</td>
                      <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{v.nurse}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showVisit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Record Clinic Visit</h2>
              <button onClick={() => setShowVisit(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleVisitSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Student *</label>
                <select value={visitForm.studentId} onChange={e => setVisitForm({ ...visitForm, studentId: e.target.value })} required className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="">Select student</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.class})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Complaint *</label>
                <input value={visitForm.complaint} onChange={e => setVisitForm({ ...visitForm, complaint: e.target.value })} required className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Patient complaint" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Diagnosis *</label>
                <input value={visitForm.diagnosis} onChange={e => setVisitForm({ ...visitForm, diagnosis: e.target.value })} required className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Diagnosis" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Treatment *</label>
                <textarea value={visitForm.treatment} onChange={e => setVisitForm({ ...visitForm, treatment: e.target.value })} rows={3} required className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" placeholder="Treatment given" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all text-sm font-medium flex-1">Record Visit (Encrypted)</button>
                <button type="button" onClick={() => setShowVisit(false)} className="border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm font-medium">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
