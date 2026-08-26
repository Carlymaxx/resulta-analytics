"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Users,
  BookOpen,
  MoreVertical,
  CheckCircle,
  X,
  ChevronDown,
} from "lucide-react";
import { CLASSES_BY_LEVEL, LEVEL_LABELS, LEARNING_AREAS_BY_LEVEL } from "@/lib/grading";
import { useAuth } from "@/context/AuthContext";

const LEVEL_DROPDOWN = [
  { value: "primary", label: "Primary" },
  { value: "junior", label: "Junior School" },
  { value: "secondary", label: "Secondary" },
  { value: "other", label: "Other" },
] as const;

export default function ClassesPage() {
  const { user, currentLevel, setCurrentLevel } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);

  const levelClasses = CLASSES_BY_LEVEL[currentLevel] || [];
  const levelLearningAreas = LEARNING_AREAS_BY_LEVEL[currentLevel] || [];
  const levelLabels = LEVEL_LABELS[currentLevel];

  // Generate deterministic mock stats per class so totals stay consistent when switching levels
  const mockClasses = levelClasses.map((name, idx) => ({
    id: idx + 1,
    name,
    students: 35 + (idx * 7) + (currentLevel === "primary" ? 10 : currentLevel === "secondary" ? 25 : 0),
    learningAreas: levelLearningAreas.length,
    avgScore: 68 + idx * 3.5 + (currentLevel === "secondary" ? 5 : currentLevel === "junior" ? 8 : 0),
    status: "Active",
    schoolId: user?.schoolId || "school-nairobi-high",
  }));

  const filteredClasses = mockClasses.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Grade Management</h1>
          <p className="text-slate-500 dark:text-slate-400">{levelLabels.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLevelDropdown(!showLevelDropdown)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition-all"
            >
              {levelLabels.short}
              <ChevronDown className="w-4 h-4" />
            </button>
            {showLevelDropdown && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-20">
                <div className="py-1">
                  {LEVEL_DROPDOWN.map((lvl) => (
                    <button
                      key={lvl.value}
                      onClick={() => {
                        setCurrentLevel(lvl.value);
                        setShowLevelDropdown(false);
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 ${
                        currentLevel === lvl.value
                          ? "bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 font-medium"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {currentLevel === lvl.value && <CheckCircle className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
                      <span>{lvl.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all text-sm font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Grade
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
             <span className="text-slate-500 dark:text-slate-400">Total Grades</span>
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">{mockClasses.length}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-slate-500 dark:text-slate-400">Total Students</span>
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">{mockClasses.reduce((a, c) => a + c.students, 0)}</div>
        </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-slate-500 dark:text-slate-400">Learning Areas per Grade</span>
            </div>
             <div className="text-2xl font-bold text-slate-800 dark:text-white">{mockClasses[0]?.learningAreas || 9}</div>
          </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
             <span className="text-slate-500 dark:text-slate-400">Active Grades</span>
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">{mockClasses.length}</div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((cls) => (
          <div key={cls.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">{cls.name}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  {cls.status}
                </span>
              </div>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <MoreVertical className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                 <span className="text-slate-500 dark:text-slate-400 text-sm">Students</span>
                 <span className="text-2xl font-bold text-slate-800 dark:text-white">{cls.students}</span>
              </div>
              <div className="flex items-center justify-between">
                 <span className="text-slate-500 dark:text-slate-400 text-sm">Learning Areas</span>
                 <span className="text-2xl font-bold text-slate-800 dark:text-white">{cls.learningAreas}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 text-sm">Average Score</span>
                <span className="text-xl font-bold text-teal-600">{cls.avgScore.toFixed(1)}%</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex gap-2">
              <button onClick={() => { setSelectedClass(cls); setShowDetailsModal(true); }} className="flex-1 px-4 py-2 text-sm font-medium text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900">
                View Details
              </button>
              <button onClick={() => { setSelectedClass({...cls}); setShowEditModal(true); }} className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-400 border border-slate-200 rounded-lg">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Class Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
               <h2 className="text-xl font-bold text-slate-800 dark:text-white">Add New Grade</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Class Name</label>
                   <input
                    type="text" 
                    placeholder={levelClasses[0] || "e.g., Grade 7"}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Class Teacher</label>
                <select className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="">Select Teacher</option>
                  <option value="1">Mrs. Johnson</option>
                  <option value="2">Mr. Smith</option>
                  <option value="3">Ms. Davis</option>
                </select>
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Learning Areas</label>
                <div className="grid grid-cols-2 gap-2">
                    {levelLearningAreas.map(learningArea => (
                     <label key={learningArea} className="flex items-center gap-2 p-2 border border-slate-200 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700">

                       <span className="text-sm text-slate-700 dark:text-slate-300">{learningArea}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700"
                >
                   Create Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Class Modal */}
      {showEditModal && selectedClass && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
             <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
               <h2 className="text-xl font-bold text-slate-800 dark:text-white">Edit Grade: {selectedClass.name}</h2>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form className="p-6 space-y-6">
               <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Grade Name</label>
                 <input
                   type="text"
                   value={selectedClass.name}
                   onChange={e => setSelectedClass({ ...selectedClass, name: e.target.value })}
                   className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Grade Teacher</label>
                <select className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="">Select Teacher</option>
                  <option value="1">Mrs. Johnson</option>
                  <option value="2">Mr. Smith</option>
                  <option value="3">Ms. Davis</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Learning Areas</label>
                <div className="grid grid-cols-2 gap-2">
                   {levelLearningAreas.map(learningArea => (
                     <label key={learningArea} className="flex items-center gap-2 p-2 border border-slate-200 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700">
                       <input type="checkbox" defaultChecked className="rounded text-teal-600" />
                       <span className="text-sm text-slate-700 dark:text-slate-300">{learningArea}</span>
                     </label>
                   ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showDetailsModal && selectedClass && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
               <h2 className="text-xl font-bold text-slate-800 dark:text-white">Grade Details: {selectedClass.name}</h2>
              <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-slate-800 dark:text-white">{selectedClass.students}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Students</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 text-center">
                   <div className="text-3xl font-bold text-slate-800 dark:text-white">{selectedClass.learningAreas}</div>
                   <div className="text-sm text-slate-500 dark:text-slate-400">Learning Areas</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-teal-600">{selectedClass.avgScore.toFixed(1)}%</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Average Score</div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-3">Grade Learning Area List</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {levelLearningAreas.map(learningArea => (
                    <div key={learningArea} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <span className="text-sm text-slate-700 dark:text-slate-300">{learningArea}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-3">Quick Actions</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowDetailsModal(false); setShowEditModal(true); }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-all"
                  >
                     <Edit2 className="w-4 h-4" /> Edit Grade
                  </button>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}