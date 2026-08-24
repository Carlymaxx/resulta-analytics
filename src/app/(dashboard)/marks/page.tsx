"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Plus, Trash2, X, Printer, FileText, Award, ClipboardList, Save,
} from "lucide-react";
import {
  StudentRecord, SubjectMark, loadRecords, saveRecords,
  totalScore, averageScore, meanGrade, getGrade, computePositions,
  CLASSES_BY_LEVEL, SUBJECTS_BY_LEVEL, ASSESSMENT_BY_LEVEL,
} from "@/lib/grading";

const TERMS = ["Term 1", "Term 2", "Term 3"];

type ViewDoc =
  | { kind: "report"; record: StudentRecord }
  | { kind: "certificate"; record: StudentRecord }
  | null;

export default function MarksPage() {
  const { user, currentLevel } = useAuth();
  const schoolName = user?.school || "School";
  const [records, setRecords] = useState<StudentRecord[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [viewDoc, setViewDoc] = useState<ViewDoc>(null);

  // form state
  const [name, setName] = useState("");
  const [admNo, setAdmNo] = useState("");
  const levelClasses = CLASSES_BY_LEVEL[currentLevel] || CLASSES_BY_LEVEL.junior;
  const [className, setClassName] = useState(levelClasses[0] || "Grade 7");
  const [term, setTerm] = useState("Term 1");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const levelSubjects = SUBJECTS_BY_LEVEL[currentLevel] || SUBJECTS_BY_LEVEL.junior;
  const [marks, setMarks] = useState<SubjectMark[]>(
    levelSubjects.map((s) => ({ subject: s, score: 0 }))
  );
  const [selectedClass, setSelectedClass] = useState<string>("All Classes");

  const CLASS_OPTIONS = ["All Classes", ...levelClasses];

  useEffect(() => {
    setRecords(loadRecords());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveRecords(records);
  }, [records, loaded]);

  const positions = useMemo(() => {
    // positions are computed per class + term + year group
    const map: Record<number, number> = {};
    const groups: Record<string, StudentRecord[]> = {};
    records.forEach((r) => {
      const key = `${r.className}|${r.term}|${r.year}`;
      (groups[key] ||= []).push(r);
    });
    Object.values(groups).forEach((group) => {
      Object.assign(map, computePositions(group));
    });
    return map;
  }, [records]);

  const classSize = (r: StudentRecord) =>
    records.filter((x) => x.className === r.className && x.term === r.term && x.year === r.year).length;

  const filteredRecords = selectedClass === "All Classes"
    ? records
    : records.filter((r) => r.className === selectedClass);

  const resetForm = () => {
    setName(""); setAdmNo(""); setClassName(levelClasses[0] || "Grade 7"); setTerm("Term 1");
    setYear(String(new Date().getFullYear()));
    setMarks(levelSubjects.map((s) => ({ subject: s, score: 0 })));
  };

  const handleAddSubjectRow = () => setMarks((m) => [...m, { subject: "", score: 0 }]);
  const handleRemoveSubjectRow = (i: number) => setMarks((m) => m.filter((_, idx) => idx !== i));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const cleanMarks = marks
      .filter((m) => m.subject.trim())
      .map((m) => ({ subject: m.subject.trim(), score: Math.min(100, Math.max(0, Number(m.score) || 0)) }));
    const rec: StudentRecord = {
      id: Date.now(),
      name: name.trim(),
      admNo: admNo.trim() || "—",
      className: className.trim() || "—",
      term, year,
      level: currentLevel,
      marks: cleanMarks,
    };
    setRecords((prev) => [rec, ...prev]);
    resetForm();
    setShowAdd(false);
  };

  const handleDelete = (id: number) => setRecords((prev) => prev.filter((r) => r.id !== id));

  const doPrint = () => window.print();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Marks & Reports</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Enter student marks and generate printable report cards & certificates.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-teal-700 transition-all"
        >
          <Plus className="w-5 h-5" /> Enter Marks
        </button>
      </div>

      {/* Class Filter */}
      <div className="flex items-center gap-3 no-print">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Filter by Class:</label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {CLASS_OPTIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 no-print">
        {[
          { label: "Records", value: String(filteredRecords.length), icon: ClipboardList },
          { label: "Classes", value: String(new Set(filteredRecords.map((r) => r.className)).size), icon: FileText },
          {
            label: "Avg Score",
            value: filteredRecords.length
              ? `${(filteredRecords.reduce((a, r) => a + averageScore(r.marks), 0) / filteredRecords.length).toFixed(1)}%`
              : "—",
            icon: FileText,
          },
          {
            label: "Top Score",
            value: filteredRecords.length
              ? `${Math.max(...filteredRecords.map((r) => averageScore(r.marks))).toFixed(1)}%`
              : "—",
            icon: Award,
          },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="w-9 h-9 rounded-lg bg-teal-100 dark:bg-teal-900 flex items-center justify-center mb-2">
              <s.icon className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-white">{s.value}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Records table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden no-print">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                {["Student", "Adm No", "Class", "Term", "Total", "Average", "Grade", "Pos", "Documents"].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No marks yet. Click <span className="font-medium text-teal-600">Enter Marks</span> to add a student&apos;s results.
                  </td>
                </tr>
              )}
              {filteredRecords.map((r) => {
                const avg = averageScore(r.marks);
                const mg = meanGrade(r.marks);
                return (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-white">{r.name}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{r.admNo}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{r.className}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{r.term} {r.year}</td>
                    <td className="py-3 px-4 font-mono text-sm text-slate-800 dark:text-white">{totalScore(r.marks)}</td>
                    <td className="py-3 px-4 font-mono text-sm text-slate-800 dark:text-white">{avg.toFixed(1)}%</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">{mg.grade}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{positions[r.id]}/{classSize(r)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setViewDoc({ kind: "report", record: r })} className="inline-flex items-center gap-1 border border-slate-200 dark:border-slate-600 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700" title="Report Card">
                          <FileText className="w-3.5 h-3.5" /> Report
                        </button>
                        <button onClick={() => setViewDoc({ kind: "certificate", record: r })} className="inline-flex items-center gap-1 border border-amber-200 px-2.5 py-1 rounded-lg text-xs font-medium text-amber-700 hover:bg-amber-50" title="Certificate">
                          <Award className="w-3.5 h-3.5" /> Certificate
                        </button>
                        <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enter Marks Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 no-print">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Enter Student Marks</h2>
              <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form className="p-6 space-y-5" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Student Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Admission No</label>
                  <input value={admNo} onChange={(e) => setAdmNo(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Class</label>
                  <select value={className} onChange={(e) => setClassName(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    {levelClasses.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Term</label>
                    <select value={term} onChange={(e) => setTerm(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                      {TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Year</label>
                    <input value={year} onChange={(e) => setYear(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Subjects & Scores (0–100)</label>
                  <button type="button" onClick={handleAddSubjectRow} className="text-sm text-teal-600 font-medium hover:underline inline-flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Add subject
                  </button>
                </div>
                <div className="space-y-2">
                  {marks.map((m, i) => {
                    const g = getGrade(Number(m.score) || 0);
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          value={m.subject}
                          onChange={(e) => setMarks((arr) => arr.map((x, idx) => idx === i ? { ...x, subject: e.target.value } : x))}
                          placeholder="Subject"
                          className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <input
                          type="number" min={0} max={100}
                          value={m.score}
                          onChange={(e) => setMarks((arr) => arr.map((x, idx) => idx === i ? { ...x, score: Number(e.target.value) } : x))}
                          className="w-24 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <span className="w-10 text-center text-xs font-semibold text-teal-700">{g.grade}</span>
                        <button type="button" onClick={() => handleRemoveSubjectRow(i)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="px-5 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
                <button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700">
                  <Save className="w-4 h-4" /> Save Marks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document viewer (report card / certificate) */}
      {viewDoc && (
        <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="w-full max-w-3xl my-6">
            <div className="flex items-center justify-between mb-3 no-print">
              <h2 className="text-white font-semibold">
                {viewDoc.kind === "report" ? "Report Card Preview" : "Certificate Preview"}
              </h2>
              <div className="flex gap-2">
                <button onClick={doPrint} className="inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700">
                  <Printer className="w-4 h-4" /> Print / Save as PDF
                </button>
                <button onClick={() => setViewDoc(null)} className="inline-flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-100">
                  <X className="w-4 h-4" /> Close
                </button>
              </div>
            </div>

            {viewDoc.kind === "report" ? (
               <ReportCard record={viewDoc.record} position={positions[viewDoc.record.id]} classSize={classSize(viewDoc.record)} user={user} />
            ) : (
               <Certificate record={viewDoc.record} user={user} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ReportCard({ record, position, classSize, user }: { record: StudentRecord; position: number; classSize: number; user: any }) {
  const total = totalScore(record.marks);
  const avg = averageScore(record.marks);
  const mg = meanGrade(record.marks);
  const schoolName = user?.school || "School";
  const schoolAddress = user?.schoolAddress || "";
  const schoolBox = user?.schoolBox || "";
  const schoolMotto = user?.schoolMotto || "";
  const schoolPhone = user?.schoolPhone || "";
  const schoolContact = [schoolBox || schoolAddress, schoolPhone].filter(Boolean).join(" · ");
  return (
    <div className="print-area bg-white text-slate-900 rounded-lg p-8 shadow-2xl">
    <div className="text-center border-b-2 border-teal-600 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-teal-700">{schoolName}</h1>
          {schoolContact && <p className="text-sm text-slate-500">{schoolContact}</p>}
          {schoolMotto && <p className="text-xs italic text-slate-400 mt-1">{schoolMotto}</p>}
          <h2 className="mt-3 text-lg font-semibold uppercase tracking-wide">{ASSESSMENT_BY_LEVEL[record.level || "junior"]} — Termly Report Card</h2>
        </div>

      <div className="grid grid-cols-2 gap-2 text-sm mb-6">
        <div><span className="text-slate-500">Name:</span> <span className="font-semibold">{record.name}</span></div>
        <div><span className="text-slate-500">Adm No:</span> <span className="font-semibold">{record.admNo}</span></div>
        <div><span className="text-slate-500">Class:</span> <span className="font-semibold">{record.className}</span></div>
        <div><span className="text-slate-500">Term:</span> <span className="font-semibold">{record.term} {record.year}</span></div>
      </div>

      <table className="w-full text-sm border-collapse mb-6">
        <thead>
          <tr className="bg-teal-50">
            <th className="border border-slate-300 px-3 py-2 text-left">Subject</th>
            <th className="border border-slate-300 px-3 py-2 text-center">Score (%)</th>
            <th className="border border-slate-300 px-3 py-2 text-center">Grade</th>
            <th className="border border-slate-300 px-3 py-2 text-left">Remark</th>
          </tr>
        </thead>
        <tbody>
          {record.marks.map((m, i) => {
            const g = getGrade(m.score);
            return (
              <tr key={i}>
                <td className="border border-slate-300 px-3 py-2">{m.subject}</td>
                <td className="border border-slate-300 px-3 py-2 text-center font-mono">{m.score}</td>
                <td className="border border-slate-300 px-3 py-2 text-center font-semibold">{g.grade}</td>
                <td className="border border-slate-300 px-3 py-2">{g.remark}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="grid grid-cols-4 gap-3 text-center mb-6">
        <div className="bg-slate-50 rounded-lg p-3"><div className="text-xs text-slate-500">Total</div><div className="font-bold">{total}</div></div>
        <div className="bg-slate-50 rounded-lg p-3"><div className="text-xs text-slate-500">Average</div><div className="font-bold">{avg.toFixed(1)}%</div></div>
        <div className="bg-slate-50 rounded-lg p-3"><div className="text-xs text-slate-500">Mean Grade</div><div className="font-bold">{mg.grade}</div></div>
        <div className="bg-slate-50 rounded-lg p-3"><div className="text-xs text-slate-500">Position</div><div className="font-bold">{position}/{classSize}</div></div>
      </div>

      <div className="text-sm space-y-1 mb-8">
        <p><span className="text-slate-500">Class Teacher&apos;s Remark:</span> {mg.remark}. {avg >= 50 ? "Keep up the good work." : "Needs improvement and closer support."}</p>
        <p><span className="text-slate-500">Principal&apos;s Remark:</span> {avg >= 70 ? "An excellent result." : avg >= 50 ? "A satisfactory performance." : "More effort is required next term."}</p>
      </div>

      <div className="grid grid-cols-2 gap-8 text-sm mt-10">
        <div className="border-t border-slate-400 pt-1 text-center">Class Teacher</div>
        <div className="border-t border-slate-400 pt-1 text-center">Principal</div>
      </div>
    </div>
  );
}

function Certificate({ record, user }: { record: StudentRecord; user: any }) {
  const avg = averageScore(record.marks);
  const mg = meanGrade(record.marks);
  const schoolName = user?.school || "School";
  const schoolBadge = user?.schoolBadge;
  const schoolMotto = user?.schoolMotto;
  return (
    <div className="print-area bg-white text-slate-900 rounded-lg p-10 shadow-2xl">
      <div className="border-8 border-double border-teal-600 p-10 text-center">
        {schoolBadge && (
          <img src={schoolBadge} alt="School badge" className="w-20 h-20 mx-auto rounded-full object-cover mb-4" onError={(e) => (e.target as HTMLImageElement).style.display = "none"} />
        )}
        <p className="uppercase tracking-[0.3em] text-teal-700 text-sm font-semibold">{schoolName}</p>
        {schoolMotto && <p className="text-xs italic text-slate-400 mt-1">{schoolMotto}</p>}
        <h1 className="text-4xl font-bold mt-6 mb-2" style={{ fontFamily: "'DM Sans', serif" }}>Certificate of Achievement</h1>
        <p className="text-slate-500 mb-8">This certificate is proudly presented to</p>
        <p className="text-3xl font-bold text-teal-700 mb-2">{record.name}</p>
        <p className="text-slate-500 mb-8">Admission No: {record.admNo} · {record.className}</p>
        <p className="max-w-xl mx-auto text-slate-700 mb-8">
          for outstanding performance during <span className="font-semibold">{record.term} {record.year}</span>,
          attaining a mean grade of <span className="font-semibold">{mg.grade}</span> with an average score of{" "}
          <span className="font-semibold">{avg.toFixed(1)}%</span>.
        </p>
        <div className="grid grid-cols-2 gap-16 text-sm mt-14 max-w-lg mx-auto">
          <div className="border-t border-slate-400 pt-1">Date: {new Date().toLocaleDateString()}</div>
          <div className="border-t border-slate-400 pt-1">Principal</div>
        </div>
      </div>
    </div>
  );
}
