"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Building2, Users, BedDouble, CheckCircle, X, Plus } from "lucide-react";

const rooms = [
  { number: "A-101", block: "Boys Block A", capacity: 4, occupied: 4, schoolId: "school-nairobi-high" },
  { number: "A-102", block: "Boys Block A", capacity: 4, occupied: 3, schoolId: "school-nairobi-high" },
  { number: "A-103", block: "Boys Block A", capacity: 4, occupied: 4, schoolId: "school-nairobi-high" },
  { number: "A-104", block: "Boys Block A", capacity: 4, occupied: 2, schoolId: "school-nairobi-high" },
  { number: "B-101", block: "Girls Block B", capacity: 4, occupied: 4, schoolId: "school-nairobi-high" },
  { number: "B-102", block: "Girls Block B", capacity: 4, occupied: 4, schoolId: "school-nairobi-high" },
  { number: "B-103", block: "Girls Block B", capacity: 4, occupied: 3, schoolId: "school-nairobi-high" },
  { number: "B-104", block: "Girls Block B", capacity: 4, occupied: 4, schoolId: "school-nairobi-high" },
];

const students = [
  { name: "Alice Mwangi", admission: "ADM2201", room: "B-101", bed: 1, block: "Girls Block B", parent: "0712 345678", status: "Active", schoolId: "school-nairobi-high" },
  { name: "Brian Ochieng", admission: "ADM2202", room: "A-101", bed: 2, block: "Boys Block A", parent: "0723 456789", status: "Active", schoolId: "school-nairobi-high" },
  { name: "Carol Wanjiku", admission: "ADM2203", room: "B-102", bed: 1, block: "Girls Block B", parent: "0734 567890", status: "Active", schoolId: "school-nairobi-high" },
  { name: "Daniel Kamau", admission: "ADM2204", room: "A-102", bed: 1, block: "Boys Block A", parent: "0745 678901", status: "Active", schoolId: "school-nairobi-high" },
  { name: "Esther Auma", admission: "ADM2205", room: "B-103", bed: 3, block: "Girls Block B", parent: "0756 789012", status: "Active", schoolId: "school-nairobi-high" },
  { name: "Frank Njoroge", admission: "ADM2206", room: "A-103", bed: 4, block: "Boys Block A", parent: "0767 890123", status: "Active", schoolId: "school-nairobi-high" },
  { name: "Grace Otieno", admission: "ADM2207", room: "B-101", bed: 2, block: "Girls Block B", parent: "0778 901234", status: "Active", schoolId: "school-nairobi-high" },
  { name: "Henry Kipchoge", admission: "ADM2208", room: "A-104", bed: 1, block: "Boys Block A", parent: "0789 012345", status: "On Leave", schoolId: "school-nairobi-high" },
];

const stats = [
  { label: "Total Rooms", value: "40", icon: Building2, color: "bg-teal-100 text-teal-600" },
  { label: "Occupied", value: "35", icon: BedDouble, color: "bg-blue-100 text-blue-600" },
  { label: "Available", value: "5", icon: CheckCircle, color: "bg-green-100 text-green-600" },
  { label: "Total Students", value: "140", icon: Users, color: "bg-purple-100 text-purple-600" },
];

export default function HostelPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("rooms");
  const [showModal, setShowModal] = useState(false);
  const tabs = ["rooms", "students", "visitors"];

  const filteredRooms = rooms.filter(r => !user?.schoolId || r.schoolId === user.schoolId);
  const filteredStudents = students.filter(s => !user?.schoolId || s.schoolId === user.schoolId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Hostel Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage student boarding and room allocation</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all text-sm font-medium">
          <Plus className="w-4 h-4" /> Allocate Bed
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-white">{s.value}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === t ? "border-teal-600 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
            {t === "rooms" ? "Rooms" : t === "students" ? "Students" : "Visitors Log"}
          </button>
        ))}
      </div>

      {/* Rooms Tab */}
      {activeTab === "rooms" && (
        <div>
          <div className="flex gap-4 mb-4 text-sm">
            <span className="px-3 py-1 bg-slate-100 rounded-full text-slate-600 dark:text-slate-400 font-medium">Boys Block A</span>
            <span className="px-3 py-1 bg-pink-100 rounded-full text-pink-600 font-medium">Girls Block B</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredRooms.map((room, i) => {
              const pct = Math.round((room.occupied / room.capacity) * 100);
              const isGirls = room.block.includes("Girls");
              return (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-slate-800 dark:text-white">Room {room.number}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${isGirls ? "bg-pink-100 text-pink-600" : "bg-blue-100 text-blue-600"}`}>
                      {isGirls ? "Girls" : "Boys"}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mb-2">{room.block}</div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-600 dark:text-slate-400">{room.occupied}/{room.capacity} beds</span>
                    <span className={`font-medium ${room.occupied === room.capacity ? "text-red-600" : "text-green-600"}`}>
                      {room.capacity - room.occupied} free
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all ${pct === 100 ? "bg-red-500" : pct >= 75 ? "bg-amber-500" : "bg-green-500"}`}
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Students Tab */}
      {activeTab === "students" && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200">
                <tr>
                  {["Student", "Admission No.", "Room", "Bed", "Block", "Parent Contact", "Status"].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider uppercase tracking-wider uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((s, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="py-3 px-4 text-sm font-medium text-slate-800">{s.name}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400 font-mono">{s.admission}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{s.room}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Bed {s.bed}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{s.block}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400 font-mono">{s.parent}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.status === "Active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{s.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Visitors Tab */}
      {activeTab === "visitors" && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-center py-12 text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No visitor records for today</p>
            <button className="mt-4 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 text-sm font-medium">Record Visitor</button>
          </div>
        </div>
      )}

      {/* Allocate Bed Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Allocate Bed</h2>
              <button onClick="$1" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><X className="w-5 h-5 text-slate-500 dark:text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              {[["Student Name", "text"], ["Admission Number", "text"], ["Block", "select"], ["Room Number", "text"], ["Bed Number", "number"]].map(([label, type]) => (
                <div key={label as string}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label as string}</label>
                  {type === "select" ? (
                    <select className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                      <option>Boys Block A</option>
                      <option>Girls Block B</option>
                    </select>
                  ) : (
                    <input type={type as string} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 p-6 border-t border-slate-200">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-slate-200 text-slate-700 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 text-sm font-medium">Cancel</button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 text-sm font-medium">Allocate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
