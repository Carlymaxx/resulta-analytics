"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { CLASSES_BY_LEVEL } from "@/lib/grading";
import { MessageSquare, Smartphone, Mail, Bell, Megaphone, Send, X } from "lucide-react";

export default function CommunicationPage() {
  const { user, currentLevel } = useAuth();
  const schoolName = user?.school || "My School";
  const levelClasses = CLASSES_BY_LEVEL[currentLevel] || CLASSES_BY_LEVEL.junior;
  const [activeTab, setActiveTab] = useState("messages");
  const [selectedMessage, setSelectedMessage] = useState(0);
  const [smsRecipient, setSmsRecipient] = useState("All Students");
  const [smsText, setSmsText] = useState("");
  const [showCompose, setShowCompose] = useState(false);

  const messages = [
    { from: "Dr. Mary Wanjiku", role: "Principal", preview: "Please ensure all Grade 9 teachers submit their...", time: "10:23 AM", unread: true, full: "Please ensure all Grade 9 teachers submit their mid-term assessment reports by Friday. This is critical for the Board meeting next Monday.", schoolId: "school-nairobi-high" },
    { from: "James Otieno", role: "Accountant", preview: "The fee payment deadline has been extended to...", time: "9:45 AM", unread: true, full: "The fee payment deadline has been extended to January 15th. Please communicate this to all parents and guardians.", schoolId: "school-nairobi-high" },
    { from: "Sarah Wanjiku", role: "Teacher", preview: "I wanted to flag that 3 students in Grade 8...", time: "Yesterday", unread: false, full: "I wanted to flag that 3 students in Grade 8 have been consistently absent on Mondays. We may need to follow up with their parents.", schoolId: "school-nairobi-high" },
    { from: "Transport Manager", role: "Transport", preview: "Route Kikuyu will be running 20 minutes late...", time: "Yesterday", unread: false, full: "Route Kikuyu will be running 20 minutes late this week due to road construction at Uthiru junction. Please inform affected students and parents.", schoolId: "school-nairobi-high" },
    { from: "Head Librarian", role: "Library", preview: "Reminder: 12 students have overdue books...", time: "2 days ago", unread: false, full: "Reminder: 12 students have overdue library books. Fines are accumulating daily. Please help us communicate this to the students listed in the attached report.", schoolId: "school-nairobi-high" },
    { from: "Nurse Alice", role: "Medical", preview: "We have a confirmed case of flu in Grade 7...", time: "2 days ago", unread: false, full: "We have a confirmed case of flu in Grade 7. Precautionary measures have been taken. Please ensure the classroom is sanitized and parents are informed.", schoolId: "school-nairobi-high" },
  ];

  const notices = [
    { title: "End of Term Examination Schedule", date: "Dec 1, 2025", category: "Academic", content: "The Grade 9 final examinations are scheduled for December 8-19. Timetables are available at the administration office.", schoolId: "school-nairobi-high" },
    { title: "Sports Day 2025", date: "Nov 25, 2025", category: "Sports", content: "Annual Sports Day will be held on December 5th. All students are encouraged to participate in at least one event.", schoolId: "school-nairobi-high" },
    { title: "School Fee Reminder", date: "Nov 20, 2025", category: "Finance", content: "Term 2 school fees are due by December 31st. Late payment attracts a 5% fine.", schoolId: "school-nairobi-high" },
    { title: "Parent-Teacher Conference", date: "Nov 15, 2025", category: "Administrative", content: "The annual Parent-Teacher Conference is scheduled for November 28th from 9 AM to 4 PM.", schoolId: "school-nairobi-high" },
  ];

  const announcements = [
    { title: "School Closes December 20th", content: "The school will close for the Christmas holidays on December 20, 2025. Students are expected to report back on January 6, 2026.", pinned: true, date: "Nov 30, 2025", schoolId: "school-nairobi-high" },
    { title: "New Computer Lab Opened", content: "We are pleased to announce the opening of our new Computer Lab with 40 workstations. All students will have access during school hours.", pinned: true, date: "Nov 22, 2025", schoolId: "school-nairobi-high" },
    { title: "Water Supply Interruption", content: "Water supply will be interrupted on December 3rd from 8 AM to 2 PM for maintenance. Alternative arrangements have been made.", pinned: false, date: "Nov 28, 2025", schoolId: "school-nairobi-high" },
    { title: "COVID-19 Health Guidelines Update", content: "Following Ministry of Health guidelines, masks are now optional but recommended in enclosed spaces.", pinned: false, date: "Nov 10, 2025", schoolId: "school-nairobi-high" },
  ];

  const smsSentHistory = [
    { recipient: "All Parents", message: "School fees reminder: Please ensure...", sent: "Nov 28, 2025", count: 480, status: "Delivered", schoolId: "school-nairobi-high" },
    { recipient: "Grade 9 Parents", message: "Mid-term results are ready for collection...", sent: "Nov 20, 2025", count: 120, status: "Delivered", schoolId: "school-nairobi-high" },
    { recipient: "All Students", message: "Reminder: Sports Day is tomorrow...", sent: "Dec 4, 2025", count: 550, status: "Delivered", schoolId: "school-nairobi-high" },
    { recipient: "Grade 7 Parents", message: `Welcome to ${schoolName}. Your ward has been...`, sent: "Sep 3, 2025", count: 145, status: "Delivered", schoolId: "school-nairobi-high" },
  ];

  const stats = [
    { label: "Unread Messages", value: "24", icon: MessageSquare, color: "bg-teal-100 text-teal-600" },
    { label: "SMS Sent (Month)", value: "1,240", icon: Smartphone, color: "bg-blue-100 text-blue-600" },
    { label: "Unread Emails", value: "56", icon: Mail, color: "bg-purple-100 text-purple-600" },
    { label: "Active Notices", value: "8", icon: Bell, color: "bg-green-100 text-green-600" },
  ];

  const [pinnedState, setPinnedState] = useState<Record<number, boolean>>(
    Object.fromEntries(announcements.map((a, i) => [i, a.pinned]))
  );

  const filteredMessages = messages.filter(m => !user?.schoolId || m.schoolId === user.schoolId);
  const filteredNotices = notices.filter(n => !user?.schoolId || n.schoolId === user.schoolId);
  const filteredAnnouncements = announcements.filter(a => !user?.schoolId || a.schoolId === user.schoolId);
  const filteredSmsHistory = smsSentHistory.filter(s => !user?.schoolId || s.schoolId === user.schoolId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Communication</h1>
          <p className="text-slate-500 text-sm mt-1">Messages, notices, and announcements</p>
        </div>
        <button onClick={() => setShowCompose(true)} className="inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700">
          <Megaphone className="w-4 h-4" /> Compose
        </button>
      </div>

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

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="border-b border-slate-200 px-6">
          <div className="flex gap-6">
            {["messages", "notices", "announcements", "sms"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? "border-teal-600 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6">
          {activeTab === "messages" && (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-2">
                {filteredMessages.map((msg, i) => (
                  <button key={i} onClick={() => setSelectedMessage(i)} className={`w-full text-left p-4 rounded-lg border transition-colors ${selectedMessage === i ? "border-teal-500 bg-teal-50" : "border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-800 text-sm">{msg.from}</span>
                      <span className="text-xs text-slate-400">{msg.time}</span>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 truncate">{msg.preview}</div>
                    <div className="text-xs text-slate-400 mt-1">{msg.role}</div>
                  </button>
                ))}
              </div>
              <div className="md:col-span-2 bg-slate-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-semibold text-slate-800">{messages[selectedMessage].from}</div>
                    <div className="text-xs text-slate-500">{messages[selectedMessage].role} · {messages[selectedMessage].time}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${messages[selectedMessage].unread ? "bg-teal-100 text-teal-700" : "bg-slate-200 text-slate-600 dark:text-slate-400"}`}>{messages[selectedMessage].unread ? "Unread" : "Read"}</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{messages[selectedMessage].full}</p>
                <div className="mt-6 flex gap-3">
                  <button className="inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700"><Mail className="w-4 h-4" /> Reply</button>
                  <button className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-100"><Send className="w-4 h-4" /> Forward</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notices" && (
            <div className="space-y-4">
              {filteredNotices.map((notice, i) => (
                <div key={i} className="border border-slate-200 rounded-lg p-5 hover:border-teal-400 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-800">{notice.title}</h3>
                    <span className="text-xs text-slate-400">{notice.date}</span>
                  </div>
                  <span className="inline-block px-2 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium mb-2">{notice.category}</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{notice.content}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "announcements" && (
            <div className="space-y-4">
              {filteredAnnouncements.map((ann, i) => (
                <div key={i} className={`border rounded-lg p-5 ${ann.pinned ? "border-amber-200 bg-amber-50" : "border-slate-200"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-800">{ann.title}</h3>
                      {ann.pinned && <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Pinned</span>}
                    </div>
                    <span className="text-xs text-slate-400">{ann.date}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{ann.content}</p>
                  <div className="mt-3 flex gap-2">
                    <button className="text-xs text-teal-600 font-medium hover:underline">Edit</button>
                    <button className="text-xs text-red-600 font-medium hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "sms" && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Recipient</label>
                   <select value={smsRecipient} onChange={e => setSmsRecipient(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm outline-none focus:border-teal-500">
                     <option>All Students</option>
                     <option>All Parents</option>
                     {levelClasses.map(c => (
                       <option key={c}>{c} Parents</option>
                     ))}
                     <option>All Staff</option>
                   </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                  <textarea value={smsText} onChange={e => setSmsText(e.target.value)} placeholder="Type your message..." className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm outline-none focus:border-teal-500 h-[38px]" />
                </div>
              </div>
              <div className="flex justify-end">
                <button className="inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700"><Send className="w-4 h-4" /> Send SMS</button>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">SMS History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        {["Recipient", "Message", "Sent", "Count", "Status"].map(h => (
                          <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredSmsHistory.map((sms, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                          <td className="py-3 px-4 text-sm text-slate-800">{sms.recipient}</td>
                          <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{sms.message}</td>
                          <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{sms.sent}</td>
                          <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{sms.count}</td>
                          <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">{sms.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCompose && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Compose Announcement</h2>
              <button onClick="$1" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><X className="w-5 h-5 text-slate-500 dark:text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title</label>
                <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-teal-500" placeholder="Announcement title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Content</label>
                <textarea className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-teal-500 h-24" placeholder="Write your announcement..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Audience</label>
                <select className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-teal-500 bg-white">
                  <option>All Students</option>
                  <option>All Parents</option>
                  <option>All Staff</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-slate-200">
              <button onClick={() => setShowCompose(false)} className="flex-1 border border-slate-200 text-slate-700 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 text-sm font-medium">Cancel</button>
              <button onClick={() => setShowCompose(false)} className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 text-sm font-medium">Publish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
