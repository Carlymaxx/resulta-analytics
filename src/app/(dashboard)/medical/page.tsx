"use client";

import { useState } from "react";
import { Heart, Plus, X } from "lucide-react";

const allergyColors: Record<string, string> = {
  "Penicillin": "bg-red-100 text-red-700",
  "Peanuts": "bg-orange-100 text-orange-700",
  "Dust": "bg-yellow-100 text-yellow-700",
  "None": "bg-green-100 text-green-700",
  "Pollen": "bg-lime-100 text-lime-700",
  "Latex": "bg-purple-100 text-purple-700",
  "Shellfish": "bg-blue-100 text-blue-700",
  "Eggs": "bg-amber-100 text-amber-700",
};

const healthRecords = [
  { id: 1, name: "Alice Wanjiru", class: "Grade 8", bloodGroup: "A+", allergies: ["None"], conditions: "None", lastCheckup: "2025-01-10" },
  { id: 2, name: "Brian Otieno", class: "Grade 7", bloodGroup: "O+", allergies: ["Penicillin"], conditions: "Mild asthma", lastCheckup: "2025-01-08" },
  { id: 3, name: "Christine Mwangi", class: "Grade 9", bloodGroup: "B+", allergies: ["Peanuts"], conditions: "None", lastCheckup: "2025-01-05" },
  { id: 4, name: "Dennis Kamau", class: "Grade 7", bloodGroup: "AB+", allergies: ["Dust", "Pollen"], conditions: "Allergic rhinitis", lastCheckup: "2025-01-12" },
  { id: 5, name: "Esther Njeri", class: "Grade 8", bloodGroup: "A-", allergies: ["None"], conditions: "None", lastCheckup: "2025-01-07" },
  { id: 6, name: "Frank Odhiambo", class: "Grade 7", bloodGroup: "O-", allergies: ["Latex"], conditions: "Eczema", lastCheckup: "2024-12-20" },
  { id: 7, name: "Gloria Adhiambo", class: "Grade 8", bloodGroup: "B-", allergies: ["None"], conditions: "None", lastCheckup: "2025-01-14" },
  { id: 8, name: "Hassan Abdi", class: "Grade 9", bloodGroup: "A+", allergies: ["Shellfish"], conditions: "None", lastCheckup: "2025-01-09" },
];

const clinicVisits = [
  { id: 1, student: "Brian Otieno", date: "2025-01-14", complaint: "Chest tightness", diagnosis: "Asthma episode", treatment: "Nebulization + Salbutamol", nurse: "Agnes Wambui" },
  { id: 2, student: "Dennis Kamau", date: "2025-01-13", complaint: "Runny nose, sneezing", diagnosis: "Allergic rhinitis", treatment: "Antihistamine prescribed", nurse: "Agnes Wambui" },
  { id: 3, student: "Grace Muthoni", date: "2025-01-12", complaint: "Headache, fever 38.2°C", diagnosis: "Mild fever (viral)", treatment: "Paracetamol, rest, fluids", nurse: "Agnes Wambui" },
  { id: 4, student: "Alice Wanjiru", date: "2025-01-11", complaint: "Stomach ache", diagnosis: "Gastritis", treatment: "Antacid, dietary advice", nurse: "Agnes Wambui" },
  { id: 5, student: "Frank Odhiambo", date: "2025-01-10", complaint: "Skin rash on arms", diagnosis: "Eczema flare-up", treatment: "Topical hydrocortisone", nurse: "Agnes Wambui" },
  { id: 6, student: "Hassan Abdi", date: "2025-01-08", complaint: "Eye irritation", diagnosis: "Conjunctivitis", treatment: "Eye drops prescribed", nurse: "Agnes Wambui" },
];

const medications = [
  { id: 1, student: "Brian Otieno", medication: "Salbutamol inhaler", dose: "2 puffs PRN", frequency: "As needed", startDate: "2025-01-14", endDate: "Ongoing" },
  { id: 2, student: "Dennis Kamau", medication: "Cetirizine 10mg", dose: "1 tablet", frequency: "Once daily", startDate: "2025-01-13", endDate: "2025-02-13" },
  { id: 3, student: "Frank Odhiambo", medication: "Hydrocortisone cream 1%", dose: "Thin layer", frequency: "Twice daily", startDate: "2025-01-10", endDate: "2025-01-24" },
  { id: 4, student: "Alice Wanjiru", medication: "Omeprazole 20mg", dose: "1 capsule", frequency: "Before breakfast", startDate: "2025-01-11", endDate: "2025-01-25" },
];

const tabs = ["Health Records", "Clinic Visits", "Medications"];

export default function MedicalPage() {
  const [activeTab, setActiveTab] = useState("Health Records");
  const [showVisit, setShowVisit] = useState(false);
  const [visitForm, setVisitForm] = useState({ student: "", complaint: "", diagnosis: "", treatment: "" });

  const handleVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowVisit(false);
    setVisitForm({ student: "", complaint: "", diagnosis: "", treatment: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Medical</h1>
          <p className="text-slate-500 text-sm mt-1">Student health records and clinic visits</p>
        </div>
        <button onClick={() => setShowVisit(true)} className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" /> Record Visit
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Health Records", value: "580", color: "text-teal-600", bg: "bg-teal-50" },
          { label: "Visits This Month", value: "34", color: "text-blue-600", bg: "bg-blue-50" },
          { label: "On Medication", value: "12", color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Known Allergies", value: "8", color: "text-red-600", bg: "bg-red-50" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
              <Heart className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className="text-2xl font-bold text-slate-800">{s.value}</div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200 px-6">
          <div className="flex gap-6">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? "border-teal-600 text-teal-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6">
          {activeTab === "Health Records" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    {["Student", "Class", "Blood Group", "Allergies", "Conditions", "Last Checkup"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {healthRecords.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">{r.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{r.class}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-bold">{r.bloodGroup}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {r.allergies.map(a => (
                            <span key={a} className={`px-2 py-0.5 rounded-full text-xs font-medium ${allergyColors[a] || "bg-slate-100 text-slate-600"}`}>{a}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{r.conditions}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{r.lastCheckup}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "Clinic Visits" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    {["Student", "Date", "Complaint", "Diagnosis", "Treatment", "Nurse"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clinicVisits.map(v => (
                    <tr key={v.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">{v.student}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{v.date}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{v.complaint}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 font-medium">{v.diagnosis}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{v.treatment}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{v.nurse}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "Medications" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    {["Student", "Medication", "Dose", "Frequency", "Start Date", "End Date"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {medications.map(m => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">{m.student}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{m.medication}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{m.dose}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{m.frequency}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{m.startDate}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-medium ${m.endDate === "Ongoing" ? "text-amber-600" : "text-slate-600"}`}>{m.endDate}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Record Visit Modal */}
      {showVisit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Record Clinic Visit</h2>
              <button onClick={() => setShowVisit(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleVisitSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Student Name</label>
                <input value={visitForm.student} onChange={e => setVisitForm({ ...visitForm, student: e.target.value })} required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" placeholder="Student name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Complaint</label>
                <input value={visitForm.complaint} onChange={e => setVisitForm({ ...visitForm, complaint: e.target.value })} required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" placeholder="Patient complaint" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Diagnosis</label>
                <input value={visitForm.diagnosis} onChange={e => setVisitForm({ ...visitForm, diagnosis: e.target.value })} required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" placeholder="Diagnosis" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Treatment</label>
                <textarea value={visitForm.treatment} onChange={e => setVisitForm({ ...visitForm, treatment: e.target.value })} rows={3} required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500 resize-none" placeholder="Treatment given" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex-1">Record Visit</button>
                <button type="button" onClick={() => setShowVisit(false)} className="border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
