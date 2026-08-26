"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { CLASSES_BY_LEVEL, LEVEL_LABELS } from "@/lib/grading";
import { Award, X, Printer, Download } from "lucide-react";

const certTypes = [
  { id: "leaving", label: "Leaving Certificate", desc: "Issued to students leaving the school" },
  { id: "completion", label: "Completion Certificate", desc: "Awarded upon completing a course or form" },
  { id: "achievement", label: "Achievement Certificate", desc: "For academic or co-curricular excellence" },
  { id: "character", label: "Character Certificate", desc: "Certifying good conduct and behavior" },
];

const history = [
  { id: "CERT001", student: "John Mwangi", class: "Grade 9", type: "Leaving Certificate", date: "2025-01-10", issuedBy: "Dr. Mary Wanjiku", schoolId: "school-nairobi-high" },
  { id: "CERT002", student: "Grace Kamau", class: "Grade 9", type: "Achievement Certificate", date: "2025-01-10", issuedBy: "Dr. Mary Wanjiku", schoolId: "school-nairobi-high" },
  { id: "CERT003", student: "Peter Otieno", class: "Grade 8", type: "Character Certificate", date: "2025-01-08", issuedBy: "Dr. Mary Wanjiku", schoolId: "school-nairobi-high" },
  { id: "CERT004", student: "Alice Njeri", class: "Grade 9", type: "Leaving Certificate", date: "2024-12-20", issuedBy: "Dr. Mary Wanjiku", schoolId: "school-nairobi-high" },
  { id: "CERT005", student: "Brian Auma", class: "Grade 7", type: "Completion Certificate", date: "2024-12-18", issuedBy: "Dr. Mary Wanjiku", schoolId: "school-nairobi-high" },
  { id: "CERT006", student: "Linda Odhiambo", class: "Grade 9", type: "Achievement Certificate", date: "2024-12-15", issuedBy: "Dr. Mary Wanjiku", schoolId: "school-nairobi-high" },
];

const templates = [
  { id: 1, name: "Standard Leaving Certificate", lastUpdated: "2024-09-01", preview: "Classic" },
  { id: 2, name: "Achievement Award Template", lastUpdated: "2024-09-01", preview: "Gold Border" },
  { id: 3, name: "Completion Certificate", lastUpdated: "2024-09-01", preview: "Modern" },
  { id: 4, name: "Character Certificate", lastUpdated: "2024-09-01", preview: "Formal" },
];

const tabs = ["Generate", "History", "Templates"];

const certBodyText: Record<string, string> = {
  leaving: "This is to certify that the above-named student was a bona fide student of this institution and has been duly enrolled. The student has conducted themselves with distinction and leaves with our best wishes.",
  completion: "This is to certify that the above-named student has successfully completed the required course of study and has fulfilled all the academic requirements as prescribed by the school curriculum.",
  achievement: "This is to certify that the above-named student has demonstrated exceptional performance and achievement in their academic and co-curricular activities, reflecting credit on themselves and the institution.",
  character: "This is to certify that the above-named student has been of good conduct, demonstrated integrity, respect, and responsibility during their time at this institution.",
};

export default function CertificatesPage() {
  const { user, currentLevel } = useAuth();
  const schoolName = user?.school || "School";
  const levelClasses = CLASSES_BY_LEVEL[currentLevel] || CLASSES_BY_LEVEL.junior;
  const [activeTab, setActiveTab] = useState("Generate");
  const [selectedType, setSelectedType] = useState("leaving");
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState(levelClasses[levelClasses.length - 1] || "Grade 9");
  const [showPreview, setShowPreview] = useState(false);

  const filteredHistory = history.filter(h => !user?.schoolId || h.schoolId === user.schoolId);

  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const selectedTypeLabel = certTypes.find(c => c.id === selectedType)?.label || "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Certificates</h1>
        <p className="text-slate-500 text-sm mt-1">Generate and manage student certificates</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Generated", value: "124", color: "text-teal-600", bg: "bg-teal-50" },
          { label: "Leaving Certs", value: "45", color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Achievement", value: "52", color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Completion", value: "27", color: "text-purple-600", bg: "bg-purple-50" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
              <Award className={`w-5 h-5 ${s.color}`} />
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
          {activeTab === "Generate" && (
            <div className="max-w-xl">
              <form onSubmit={handlePreview} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Certificate Type</label>
                  <div className="space-y-3">
                    {certTypes.map(ct => (
                      <label key={ct.id} className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${selectedType === ct.id ? "border-teal-500 bg-teal-50" : "border-slate-200 hover:bg-slate-50"}`}>
                        <input type="radio" name="certType" value={ct.id} checked={selectedType === ct.id} onChange={() => setSelectedType(ct.id)} className="mt-0.5 accent-teal-600" />
                        <div>
                          <div className="font-medium text-slate-800 text-sm">{ct.label}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{ct.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Student Name</label>
                  <input
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    required
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500"
                    placeholder="Enter full student name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Class</label>
                  <select value={studentClass} onChange={e => setStudentClass(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500">
                      {levelClasses.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <button type="submit" className="bg-teal-600 text-white px-6 py-2.5 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex items-center gap-2">
                  <Award className="w-4 h-4" /> Preview Certificate
                </button>
              </form>
            </div>
          )}

          {activeTab === "History" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                      {["Cert ID", "Student", "Class", "Type", "Date Issued", "Issued By", "Actions"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredHistory.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-mono text-slate-500">{c.id}</td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">{c.student}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{c.class}</td>
                      <td className="px-4 py-3"><span className="px-2 py-1 bg-teal-50 text-teal-700 rounded-full text-xs">{c.type}</span></td>
                      <td className="px-4 py-3 text-sm text-slate-600">{c.date}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{c.issuedBy}</td>
                      <td className="px-4 py-3 flex gap-2">
                        <button onClick={() => alert("PDF export coming soon")} className="border border-slate-200 text-slate-700 px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors text-xs font-medium flex items-center gap-1">
                          <Printer className="w-3 h-3" /> Print
                        </button>
                        <button onClick={() => alert("PDF export coming soon")} className="border border-slate-200 text-slate-700 px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors text-xs font-medium flex items-center gap-1">
                          <Download className="w-3 h-3" /> PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "Templates" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {templates.map(t => (
                <div key={t.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
                  <div className="bg-slate-100 rounded-lg h-24 flex items-center justify-center mb-4">
                    <Award className="w-10 h-10 text-slate-400" />
                  </div>
                  <div className="font-medium text-slate-800 mb-1">{t.name}</div>
                  <div className="text-xs text-slate-500 mb-3">Style: {t.preview} · Updated: {t.lastUpdated}</div>
                  <div className="flex gap-2">
                    <button className="border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors text-xs font-medium">Preview</button>
                    <button className="border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors text-xs font-medium">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Certificate Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Certificate Preview</h2>
              <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-8">
              {/* Certificate Design */}
              <div className="border-4 border-teal-600 rounded-xl p-8 text-center relative">
                <div className="border-2 border-teal-200 rounded-lg p-6">
                  {/* Header */}
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="w-14 h-14 bg-teal-600 rounded-full flex items-center justify-center">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                  </div>
                   <div className="text-2xl font-bold text-teal-700 mb-1 uppercase tracking-widest">{schoolName}</div>
                   {(user?.schoolBox || user?.schoolAddress) && <div className="text-xs text-slate-500 mb-6 uppercase tracking-wider">{user.schoolBox || user.schoolAddress}</div>}

                  <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">This is to Certify That</div>
                  <div className="text-3xl font-bold text-slate-800 border-b-2 border-teal-300 pb-2 mb-4 px-8">{studentName}</div>
                   <div className="text-sm text-slate-600 mb-1">of grade <span className="font-semibold">{studentClass}</span></div>
                  <div className="text-xl font-bold text-teal-600 my-4">{selectedTypeLabel}</div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6 max-w-md mx-auto">{certBodyText[selectedType]}</p>

                  <div className="flex justify-between items-end mt-8 pt-6 border-t border-slate-200">
                    <div className="text-center">
                      <div className="border-t-2 border-slate-400 w-32 mb-1"></div>
                      <div className="text-xs text-slate-500">Grade Teacher</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-400">Date: {new Date().toLocaleDateString("en-GB")}</div>
                    </div>
                    <div className="text-center">
                      <div className="border-t-2 border-slate-400 w-32 mb-1"></div>
                      <div className="text-xs text-slate-500">Principal</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-8 pb-6">
              <button onClick={() => alert("PDF export coming soon")} className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex items-center gap-2 flex-1 justify-center">
                <Printer className="w-4 h-4" /> Print Certificate
              </button>
              <button onClick={() => alert("PDF export coming soon")} className="border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium flex items-center gap-2">
                <Download className="w-4 h-4" /> Download PDF
              </button>
              <button onClick={() => setShowPreview(false)} className="border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
