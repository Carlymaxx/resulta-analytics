"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Users,
  BookOpen,
  MoreVertical,
  CheckCircle,
  X
} from "lucide-react";

const mockClasses = [
  { id: 1, name: "Class 10-A", students: 42, subjects: 8, avgScore: 78.5, status: "Active" },
  { id: 2, name: "Class 10-B", students: 38, subjects: 8, avgScore: 72.3, status: "Active" },
  { id: 3, name: "Class 9-A", students: 45, subjects: 7, avgScore: 81.2, status: "Active" },
  { id: 4, name: "Class 9-B", students: 40, subjects: 7, avgScore: 75.8, status: "Active" },
  { id: 5, name: "Class 11-A", students: 35, subjects: 10, avgScore: 82.1, status: "Active" },
  { id: 6, name: "Class 11-B", students: 32, subjects: 10, avgScore: 79.4, status: "Active" },
];

const subjectsList = [
  "Mathematics", "English", "Science", "History", "Geography", 
  "Physics", "Chemistry", "Biology", "Computer Science", "Physical Education"
];

export default function ClassesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);

  const filteredClasses = mockClasses.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Class Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage classes and enroll students</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-teal-700 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Class
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <span className="text-slate-500 dark:text-slate-400">Total Classes</span>
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">6</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-slate-500 dark:text-slate-400">Total Students</span>
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">232</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-slate-500 dark:text-slate-400">Subjects</span>
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">10</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-slate-500 dark:text-slate-400">Active Classes</span>
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">6</div>
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
                <span className="font-semibold text-slate-800 dark:text-white">{cls.students}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 text-sm">Subjects</span>
                <span className="font-semibold text-slate-800 dark:text-white">{cls.subjects}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 text-sm">Average Score</span>
                <span className="font-semibold text-teal-600">{cls.avgScore}%</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex gap-2">
              <button className="flex-1 px-4 py-2 text-sm font-medium text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900">
                View Details
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg">
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
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Add New Class</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Class Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Class 10-A"
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
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subjects</label>
                <div className="grid grid-cols-2 gap-2">
                  {subjectsList.map(subject => (
                    <label key={subject} className="flex items-center gap-2 p-2 border border-slate-200 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700">
                      <input type="checkbox" className="rounded text-teal-600" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{subject}</span>
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
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}