"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { LEARNING_AREAS_BY_LEVEL } from "@/lib/grading";
import { Monitor, Users, ClipboardList, Video, BookOpen, Plus, X, Download } from "lucide-react";

const getCoursesForLevel = (level: string) => {
  const schoolId = "school-nairobi-high";
  const areas = LEARNING_AREAS_BY_LEVEL[level] || LEARNING_AREAS_BY_LEVEL.junior;
  const teachers = ["Sarah Wanjiku", "James Otieno", "Grace Muthoni", "Peter Kamau", "Joyce Auma", "David Kipchoge"];
  const colors = ["bg-teal-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-amber-500", "bg-rose-500"];
  return areas.slice(0, 6).map((learningArea, i) => ({
    learningArea,
    teacher: teachers[i % teachers.length],
    enrolled: 80 + i * 15,
    progress: 50 + i * 8,
    status: i < 5 ? "Active" : "Upcoming",
    color: colors[i % colors.length],
    schoolId,
  }));
};

const getAssignmentsForLevel = (level: string) => {
  const schoolId = "school-nairobi-high";
  const areas = LEARNING_AREAS_BY_LEVEL[level] || LEARNING_AREAS_BY_LEVEL.junior;
  return areas.slice(0, 6).map((learningArea, i) => ({
    title: `${learningArea} Assignment ${i + 1}`,
    learningArea,
    due: `Dec ${10 - i}, 2025`,
    submitted: 20 + i * 8,
    total: 40,
    status: i % 2 === 0 ? "Open" : "Closed",
    schoolId,
  }));
};

const getNotesForLevel = (level: string) => {
  const schoolId = "school-nairobi-high";
  const areas = LEARNING_AREAS_BY_LEVEL[level] || LEARNING_AREAS_BY_LEVEL.junior;
  const teachers = ["Sarah Wanjiku", "James Otieno", "Grace Muthoni", "Peter Kamau", "Joyce Auma"];
  return areas.slice(0, 5).map((learningArea, i) => ({
    title: `${learningArea} Notes - Term 2`,
    learningArea,
    uploadedBy: teachers[i % teachers.length],
    date: `Nov ${25 - i * 3}, 2025`,
    size: `${1 + i}.${i * 2} MB`,
    type: "PDF",
    schoolId,
  }));
};

const getVideosForLevel = (level: string) => {
  const schoolId = "school-nairobi-high";
  const areas = LEARNING_AREAS_BY_LEVEL[level] || LEARNING_AREAS_BY_LEVEL.junior;
  const teachers = ["Sarah Wanjiku", "James Otieno", "Grace Muthoni", "Peter Kamau"];
  return areas.slice(0, 4).map((learningArea, i) => ({
    title: `${learningArea} Introduction`,
    learningArea,
    duration: `${20 + i * 8} min`,
    views: 150 + i * 50,
    date: `Nov ${22 - i * 3}, 2025`,
    schoolId,
  }));
};

const stats = [
  { label: "Online Courses", value: "24", icon: Monitor, color: "bg-teal-100 text-teal-600" },
  { label: "Active Students", value: "380", icon: Users, color: "bg-blue-100 text-blue-600" },
  { label: "Assignments Due", value: "12", icon: ClipboardList, color: "bg-amber-100 text-amber-600" },
  { label: "Video Lessons", value: "86", icon: Video, color: "bg-purple-100 text-purple-600" },
];

export default function ELearningPage() {
  const { user, currentLevel } = useAuth();
  const courses = getCoursesForLevel(currentLevel);
  const assignments = getAssignmentsForLevel(currentLevel);
  const notes = getNotesForLevel(currentLevel);
  const videos = getVideosForLevel(currentLevel);
  const [activeTab, setActiveTab] = useState("courses");
  const [showUploadModal, setShowUploadModal] = useState(false);

  const filteredCourses = courses.filter(c => !user?.schoolId || c.schoolId === user.schoolId);
  const filteredAssignments = assignments.filter(a => !user?.schoolId || a.schoolId === user.schoolId);
  const filteredNotes = notes.filter(n => !user?.schoolId || n.schoolId === user.schoolId);
  const filteredVideos = videos.filter(v => !user?.schoolId || v.schoolId === user.schoolId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">E-Learning</h1>
          <p className="text-sm text-slate-500 mt-1">Online courses, assignments, notes, and video lessons</p>
        </div>
        <button onClick={() => setShowUploadModal(true)} className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> Upload Note
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{s.value}</div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {["courses", "assignments", "notes", "videos"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === t ? "border-teal-600 text-teal-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "courses" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((c, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200">
              <div className={`h-2 ${c.color}`} />
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                   <h3 className="font-bold text-slate-800">{c.learningArea}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${c.status === "Active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{c.status}</span>
                </div>
                <p className="text-sm text-slate-500 mb-4">{c.teacher}</p>
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                  <Users className="w-4 h-4" />
                  <span>{c.enrolled} enrolled</span>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Progress</span><span>{c.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${c.color}`} style={{ width: `${c.progress}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "assignments" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                 <tr>{["Assignment", "Learning Area", "Due Date", "Submitted", "Status"].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAssignments.map((a, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-3 px-4 text-sm font-medium text-slate-800">{a.title}</td>
                     <td className="py-3 px-4 text-sm text-slate-600">{a.learningArea}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{a.due}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-800 font-medium">{a.submitted}/{a.total}</span>
                        <div className="w-16 bg-slate-100 rounded-full h-1.5">
                          <div className="h-1.5 bg-teal-500 rounded-full" style={{ width: `${(a.submitted / a.total) * 100}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${a.status === "Open" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>{a.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "notes" && (
        <div className="space-y-3">
          {filteredNotes.map((n, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-800 text-sm">{n.title}</div>
                 <div className="text-xs text-slate-500 mt-0.5">{n.learningArea} · {n.uploadedBy} · {n.date} · {n.size}</div>
              </div>
              <button className="flex items-center gap-1 text-teal-600 hover:text-teal-700 text-sm font-medium flex-shrink-0">
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "videos" && (
        <div className="grid sm:grid-cols-2 gap-4">
          {filteredVideos.map((v, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200">
              <div className="bg-slate-800 h-36 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                  <Video className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-slate-800">{v.title}</h3>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                   <span>{v.learningArea}</span>
                  <span>{v.duration}</span>
                  <span>{v.views} views</span>
                </div>
                <button className="mt-3 w-full bg-teal-600 text-white py-1.5 rounded-lg hover:bg-teal-700 text-sm font-medium">Watch Now</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">Upload Note</h2>
              <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="p-6 space-y-4">
                  {[["Assignment Title", "text"], ["Learning Area", "select"], ["File", "file"]].map(([label, type]) => (
                <div key={label as string}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{label as string}</label>
                  {type === "select" ? (
                    <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                       {courses.map(c => <option key={c.learningArea}>{c.learningArea}</option>)}
                    </select>
                  ) : (
                    <input type={type as string} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 p-6 border-t border-slate-200">
              <button onClick={() => setShowUploadModal(false)} className="flex-1 border border-slate-200 text-slate-700 py-2 rounded-lg hover:bg-slate-50 text-sm font-medium">Cancel</button>
              <button onClick={() => setShowUploadModal(false)} className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 text-sm font-medium">Upload</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
