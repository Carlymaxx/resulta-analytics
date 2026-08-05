"use client";

import { useState } from "react";
import { MessageSquare, Smartphone, Mail, Bell, Megaphone, Send } from "lucide-react";

const messages = [
  { from: "Dr. Mary Wanjiku", role: "Principal", preview: "Please ensure all Form 4 teachers submit their...", time: "10:23 AM", unread: true, full: "Please ensure all Form 4 teachers submit their mid-term assessment reports by Friday. This is critical for the Board meeting next Monday." },
  { from: "James Otieno", role: "Accountant", preview: "The fee payment deadline has been extended to...", time: "9:45 AM", unread: true, full: "The fee payment deadline has been extended to January 15th. Please communicate this to all parents and guardians." },
  { from: "Sarah Wanjiku", role: "Teacher", preview: "I wanted to flag that 3 students in Form 2A...", time: "Yesterday", unread: false, full: "I wanted to flag that 3 students in Form 2A have been consistently absent on Mondays. We may need to follow up with their parents." },
  { from: "Transport Manager", role: "Transport", preview: "Route Kikuyu will be running 20 minutes late...", time: "Yesterday", unread: false, full: "Route Kikuyu will be running 20 minutes late this week due to road construction at Uthiru junction. Please inform affected students and parents." },
  { from: "Head Librarian", role: "Library", preview: "Reminder: 12 students have overdue books...", time: "2 days ago", unread: false, full: "Reminder: 12 students have overdue library books. Fines are accumulating daily. Please help us communicate this to the students listed in the attached report." },
  { from: "Nurse Alice", role: "Medical", preview: "We have a confirmed case of flu in Form 1B...", time: "2 days ago", unread: false, full: "We have a confirmed case of flu in Form 1B. Precautionary measures have been taken. Please ensure the classroom is sanitized and parents are informed." },
];

const notices = [
  { title: "End of Term Examination Schedule", date: "Dec 1, 2025", category: "Academic", content: "The Form 4 final examinations are scheduled for December 8-19. Timetables are available at the administration office." },
  { title: "Sports Day 2025", date: "Nov 25, 2025", category: "Sports", content: "Annual Sports Day will be held on December 5th. All students are encouraged to participate in at least one event." },
  { title: "School Fee Reminder", date: "Nov 20, 2025", category: "Finance", content: "Term 2 school fees are due by December 31st. Late payment attracts a 5% fine." },
  { title: "Parent-Teacher Conference", date: "Nov 15, 2025", category: "Administrative", content: "The annual Parent-Teacher Conference is scheduled for November 28th from 9 AM to 4 PM." },
];

const announcements = [
  { title: "School Closes December 20th", content: "The school will close for the Christmas holidays on December 20, 2025. Students are expected to report back on January 6, 2026.", pinned: true, date: "Nov 30, 2025" },
  { title: "New Computer Lab Opened", content: "We are pleased to announce the opening of our new Computer Lab with 40 workstations. All students will have access during school hours.", pinned: true, date: "Nov 22, 2025" },
  { title: "Water Supply Interruption", content: "Water supply will be interrupted on December 3rd from 8 AM to 2 PM for maintenance. Alternative arrangements have been made.", pinned: false, date: "Nov 28, 2025" },
  { title: "COVID-19 Health Guidelines Update", content: "Following Ministry of Health guidelines, masks are now optional but recommended in enclosed spaces.", pinned: false, date: "Nov 10, 2025" },
];

const smsSentHistory = [
  { recipient: "All Parents", message: "School fees reminder: Please ensure...", sent: "Nov 28, 2025", count: 480, status: "Delivered" },
  { recipient: "Form 4 Parents", message: "KCSE mock results are ready for collection...", sent: "Nov 20, 2025", count: 120, status: "Delivered" },
  { recipient: "All Students", message: "Reminder: Sports Day is tomorrow...", sent: "Dec 4, 2025", count: 550, status: "Delivered" },
  { recipient: "Form 1 Parents", message: "Welcome to MAXX School. Your ward has been...", sent: "Sep 3, 2025", count: 145, status: "Delivered" },
];

const stats = [
  { label: "Unread Messages", value: "24", icon: MessageSquare, color: "bg-teal-100 text-teal-600" },
  { label: "SMS Sent (Month)", value: "1,240", icon: Smartphone, color: "bg-blue-100 text-blue-600" },
  { label: "Unread Emails", value: "56", icon: Mail, color: "bg-purple-100 text-purple-600" },
  { label: "Active Notices", value: "8", icon: Bell, color: "bg-green-100 text-green-600" },
];

export default function CommunicationPage() {
  const [activeTab, setActiveTab] = useState("messages");
  const [selectedMessage, setSelectedMessage] = useState(messages[0]);
  const [smsRecipient, setSmsRecipient] = useState("All Students");
  const [smsText, setSmsText] = useState("");
  const [pinnedState, setPinnedState] = useState<Record<number, boolean>>(
    Object.fromEntries(announcements.map((a, i) => [i, a.pinned]))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Communication</h1>
        <p className="text-sm text-slate-500 mt-1">Messages, SMS, notices, and announcements</p>
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

      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        {["messages", "sms", "noticeboard", "announcements"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === t ? "border-teal-600 text-teal-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
            {t === "messages" ? "Messages" : t === "sms" ? "SMS" : t === "noticeboard" ? "Notice Board" : "Announcements"}
          </button>
        ))}
      </div>

      {activeTab === "messages" && (
        <div className="grid lg:grid-cols-3 gap-4" style={{ height: "500px" }}>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-y-auto">
            {messages.map((m, i) => (
              <button key={i} onClick={() => setSelectedMessage(m)}
                className={`w-full text-left p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors ${selectedMessage.from === m.from && selectedMessage.time === m.time ? "bg-teal-50" : ""}`}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {m.from.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${m.unread ? "font-bold text-slate-800" : "font-medium text-slate-700"}`}>{m.from}</span>
                      <span className="text-xs text-slate-400">{m.time}</span>
                    </div>
                    <div className="text-xs text-slate-500 truncate">{m.preview}</div>
                  </div>
                  {m.unread && <div className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0 mt-1" />}
                </div>
              </button>
            ))}
          </div>
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-bold">
                  {selectedMessage.from.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div className="font-medium text-slate-800">{selectedMessage.from}</div>
                  <div className="text-xs text-slate-500">{selectedMessage.role} · {selectedMessage.time}</div>
                </div>
              </div>
            </div>
            <div className="flex-1 p-6 text-sm text-slate-700 leading-relaxed">{selectedMessage.full}</div>
            <div className="p-4 border-t border-slate-200 flex gap-2">
              <input type="text" placeholder="Reply..." className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 text-sm font-medium flex items-center gap-1"><Send className="w-4 h-4" /> Send</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "sms" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Compose SMS</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Recipient Group</label>
              <select value={smsRecipient} onChange={e => setSmsRecipient(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                {["All Students", "All Parents", "All Teachers", "Form 1 Students", "Form 2 Students", "Form 3 Students", "Form 4 Students", "Form 1 Parents", "Form 4 Parents"].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
              <textarea value={smsText} onChange={e => setSmsText(e.target.value)} rows={5} maxLength={160}
                placeholder="Type your message here..."
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" />
              <div className="text-right text-xs text-slate-400 mt-1">{smsText.length}/160 characters</div>
            </div>
            <button className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 text-sm font-medium flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> Send SMS
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200"><h3 className="font-bold text-slate-800">Sent History</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>{["Recipient", "Message", "Date", "Count", "Status"].map(h => <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-slate-600">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {smsSentHistory.map((s, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-xs text-slate-800 font-medium">{s.recipient}</td>
                      <td className="py-2 px-3 text-xs text-slate-500 max-w-32 truncate">{s.message}</td>
                      <td className="py-2 px-3 text-xs text-slate-500">{s.sent}</td>
                      <td className="py-2 px-3 text-xs text-slate-800">{s.count}</td>
                      <td className="py-2 px-3"><span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">{s.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "noticeboard" && (
        <div className="grid sm:grid-cols-2 gap-4">
          {notices.map((n, i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${n.category === "Academic" ? "bg-teal-100 text-teal-700" : n.category === "Finance" ? "bg-green-100 text-green-700" : n.category === "Sports" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>{n.category}</span>
                <span className="text-xs text-slate-400">{n.date}</span>
              </div>
              <h3 className="font-bold text-slate-800 mb-2">{n.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{n.content}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "announcements" && (
        <div className="space-y-4">
          {announcements.map((a, i) => (
            <div key={i} className={`bg-white rounded-xl p-5 shadow-sm border ${pinnedState[i] ? "border-teal-300 bg-teal-50/30" : "border-slate-200"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${pinnedState[i] ? "bg-teal-100" : "bg-slate-100"}`}>
                    <Megaphone className={`w-5 h-5 ${pinnedState[i] ? "text-teal-600" : "text-slate-500"}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{a.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{a.content}</p>
                    <span className="text-xs text-slate-400 mt-2 block">{a.date}</span>
                  </div>
                </div>
                <button onClick={() => setPinnedState(prev => ({ ...prev, [i]: !prev[i] }))}
                  className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${pinnedState[i] ? "bg-teal-600 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                  {pinnedState[i] ? "Pinned" : "Pin"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
