"use client";

import { useState } from "react";
import { 
  Activity, 
  Search, 
  Filter,
  Download,
  User,
  FileText,
  Settings,
  LogIn,
  LogOut,
  Upload,
  AlertTriangle,
  CheckCircle,
  Trash2
} from "lucide-react";

const activities = [
  { id: 1, action: "Added new student", details: "John Smith added to Class 9-B", user: "Teacher Lenn", time: "2 minutes ago", icon: User, type: "create" },
  { id: 2, action: "Updated results", details: "Mathematics scores for Class 10-A", user: "Teacher Lenn", time: "15 minutes ago", icon: FileText, type: "update" },
  { id: 3, action: "Generated report", details: "Q1 2025 Performance Report", user: "Teacher Lenn", time: "1 hour ago", icon: FileText, type: "export" },
  { id: 4, action: "Logged in", details: "Successful login from Chrome on Windows", user: "Teacher Lenn", time: "2 hours ago", icon: LogIn, type: "login" },
  { id: 5, action: "Modified settings", details: "Updated notification preferences", user: "Teacher Lenn", time: "3 hours ago", icon: Settings, type: "update" },
  { id: 6, action: "Imported data", details: "45 student records from spreadsheet", user: "Admin", time: "Yesterday", icon: Upload, type: "import" },
  { id: 7, action: "Deleted student", details: "Removed Michael Brown from system", user: "Teacher Lenn", time: "Yesterday", icon: Trash2, type: "delete" },
  { id: 8, action: "At-risk alert", details: "5 students flagged in Science", user: "System", time: "2 days ago", icon: AlertTriangle, type: "alert" },
  { id: 9, action: "Prediction completed", details: "Monthly performance predictions updated", user: "System", time: "3 days ago", icon: CheckCircle, type: "success" },
  { id: 10, action: "Logged out", details: "Session ended", user: "Teacher Lenn", time: "3 days ago", icon: LogOut, type: "logout" },
];

export default function ActivityLogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filtered = activities.filter(a => 
    (a.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
     a.details.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterType === "all" || a.type === filterType)
  );

  const getIconColor = (type: string) => {
    switch (type) {
      case "create": return "text-green-500 bg-green-100 dark:bg-green-900";
      case "update": return "text-blue-500 bg-blue-100 dark:bg-blue-900";
      case "delete": return "text-red-500 bg-red-100 dark:bg-red-900";
      case "export": return "text-purple-500 bg-purple-100 dark:bg-purple-900";
      case "login": return "text-teal-500 bg-teal-100 dark:bg-teal-900";
      case "alert": return "text-amber-500 bg-amber-100 dark:bg-amber-900";
      case "success": return "text-green-500 bg-green-100 dark:bg-green-900";
      default: return "text-slate-500 bg-slate-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Activity Log</h1>
          <p className="text-slate-500 dark:text-slate-400">Track all system activities and changes</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
          <Download className="w-4 h-4" />
          Export Log
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: "Today's Activities", value: "24", icon: Activity },
          { label: "This Week", value: "156", icon: Activity },
          { label: "This Month", value: "642", icon: Activity },
          { label: "User Actions", value: "520", icon: User },
          { label: "System Events", value: "122", icon: Settings },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
            <div className="text-xl font-bold text-slate-800 dark:text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { id: "all", label: "All" },
              { id: "create", label: "Created" },
              { id: "update", label: "Updated" },
              { id: "delete", label: "Deleted" },
              { id: "login", label: "Login/Logout" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterType === f.id 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {filtered.map((activity) => (
            <div key={activity.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconColor(activity.type)}`}>
                  <activity.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-800 dark:text-white">{activity.action}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{activity.details}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
                    <span>{activity.user}</span>
                    <span>•</span>
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}