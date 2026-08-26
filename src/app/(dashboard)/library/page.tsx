"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Library, Plus, X, AlertTriangle } from "lucide-react";

const books = [
  { id: 1, title: "Advanced Mathematics Grade 8", author: "K. M. Njagi", isbn: "978-9966-25-001-1", category: "Textbook", copies: 30, available: 22, schoolId: "school-nairobi-high" },
  { id: 2, title: "English Grammar in Use", author: "Raymond Murphy", isbn: "978-0-521-18906-4", category: "Reference", copies: 15, available: 10, schoolId: "school-nairobi-high" },
  { id: 3, title: "Biology — A New Approach", author: "G. Opaa", isbn: "978-9966-25-002-2", category: "Textbook", copies: 25, available: 18, schoolId: "school-nairobi-high" },
  { id: 4, title: "Chemistry Grade 8", author: "S. M. Mwangi", isbn: "978-9966-25-003-3", category: "Textbook", copies: 20, available: 14, schoolId: "school-nairobi-high" },
  { id: 5, title: "Things Fall Apart", author: "Chinua Achebe", isbn: "978-0-385-47454-2", category: "Literature", copies: 40, available: 35, schoolId: "school-nairobi-high" },
  { id: 6, title: "The River and The Source", author: "Margaret Ogola", isbn: "978-9966-888-01-9", category: "Literature", copies: 35, available: 28, schoolId: "school-nairobi-high" },
  { id: 7, title: "Kenya History & Government", author: "P. Nthiwa", isbn: "978-9966-25-004-4", category: "Textbook", copies: 18, available: 12, schoolId: "school-nairobi-high" },
  { id: 8, title: "Computer Studies for Schools", author: "J. Githinji", isbn: "978-9966-25-005-5", category: "Textbook", copies: 22, available: 17, schoolId: "school-nairobi-high" },
];

const borrowed = [
  { id: 1, student: "Alice Wanjiru", class: "Grade 8", book: "Advanced Mathematics Grade 8", borrowDate: "2025-01-05", dueDate: "2025-01-19", returned: false, daysOverdue: 0, schoolId: "school-nairobi-high" },
  { id: 2, student: "Brian Otieno", class: "Grade 7", book: "English Grammar in Use", borrowDate: "2024-12-20", dueDate: "2025-01-03", returned: false, daysOverdue: 12, schoolId: "school-nairobi-high" },
  { id: 3, student: "Christine Mwangi", class: "Grade 9", book: "Things Fall Apart", borrowDate: "2025-01-08", dueDate: "2025-01-22", returned: false, daysOverdue: 0, schoolId: "school-nairobi-high" },
  { id: 4, student: "Dennis Kamau", class: "Grade 7", book: "Kenya History & Government", borrowDate: "2024-12-18", dueDate: "2025-01-01", returned: false, daysOverdue: 14, schoolId: "school-nairobi-high" },
  { id: 5, student: "Esther Njeri", class: "Grade 8", book: "Biology — A New Approach", borrowDate: "2025-01-10", dueDate: "2025-01-24", returned: false, daysOverdue: 0, schoolId: "school-nairobi-high" },
  { id: 6, student: "Frank Odhiambo", class: "Grade 7", book: "Chemistry Grade 8", borrowDate: "2024-12-22", dueDate: "2025-01-05", returned: false, daysOverdue: 10, schoolId: "school-nairobi-high" },
];

const tabs = ["Books", "Borrowed", "Returns"];

export default function LibraryPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Books");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", author: "", isbn: "", category: "Textbook", copies: "" });

  const filteredBooks = books.filter(b => !user?.schoolId || b.schoolId === user.schoolId);
  const filteredBorrowed = borrowed.filter(b => !user?.schoolId || b.schoolId === user.schoolId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAdd(false);
    setForm({ title: "", author: "", isbn: "", category: "Textbook", copies: "" });
  };

  const PENALTY_PER_DAY = 10;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Library</h1>
          <p className="text-slate-500 text-sm mt-1">Book inventory and borrowing records</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Book
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Books", value: "1,240", color: "text-teal-600", bg: "bg-teal-50" },
          { label: "Borrowed", value: "89", color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Overdue", value: "12", color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Lost / Missing", value: "3", color: "text-red-600", bg: "bg-red-50" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
              <Library className={`w-5 h-5 ${s.color}`} />
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
          {activeTab === "Books" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    {["Title", "Author", "ISBN", "Category", "Copies", "Available"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBooks.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">{b.title}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{b.author}</td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-500">{b.isbn}</td>
                      <td className="px-4 py-3"><span className="px-2 py-1 bg-teal-50 text-teal-700 rounded-full text-xs">{b.category}</span></td>
                      <td className="px-4 py-3 text-sm text-slate-700">{b.copies}</td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold text-sm ${b.available < 5 ? "text-amber-600" : "text-green-600"}`}>{b.available}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "Borrowed" && (
            <div className="space-y-3">
              {filteredBorrowed.map(b => (
                <div key={b.id} className={`border rounded-lg p-4 ${b.daysOverdue > 0 ? "border-red-200 bg-red-50" : "border-slate-200"}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-800 text-sm">{b.student}</span>
                        <span className="text-xs text-slate-500">({b.class})</span>
                        {b.daysOverdue > 0 && (
                          <span className="flex items-center gap-1 text-xs text-red-600 font-medium">
                            <AlertTriangle className="w-3 h-3" /> Overdue {b.daysOverdue} days
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-slate-600 mt-1">{b.book}</div>
                      <div className="text-xs text-slate-400 mt-1">Borrowed: {b.borrowDate} | Due: {b.dueDate}</div>
                    </div>
                    {b.daysOverdue > 0 && (
                      <div className="text-right">
                        <div className="text-xs text-slate-500">Late Penalty</div>
                        <div className="text-sm font-bold text-red-600">KES {b.daysOverdue * PENALTY_PER_DAY}</div>
                        <div className="text-xs text-slate-400">@ KES {PENALTY_PER_DAY}/day</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Returns" && (
            <div className="space-y-4">
              <p className="text-sm text-slate-500">Process book returns. Search for borrowed books by student name or book title.</p>
              <div className="flex gap-3">
                <input className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" placeholder="Search student or book..." />
                <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium">Search</button>
              </div>
              <div className="text-center py-8 text-slate-400 text-sm border border-dashed border-slate-200 rounded-lg">
                Search for a borrowed book to process a return
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Book Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Add New Book</h2>
              <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Book Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" placeholder="Book title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
                <input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" placeholder="Author name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ISBN</label>
                <input value={form.isbn} onChange={e => setForm({ ...form, isbn: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" placeholder="ISBN number" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500">
                    <option>Textbook</option>
                    <option>Reference</option>
                    <option>Literature</option>
                    <option>Novel</option>
                    <option>Magazine</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Copies</label>
                  <input type="number" value={form.copies} onChange={e => setForm({ ...form, copies: e.target.value })} required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" placeholder="1" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex-1">Add Book</button>
                <button type="button" onClick={() => setShowAdd(false)} className="border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
