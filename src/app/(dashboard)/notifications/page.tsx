"use client";

import { useState } from "react";
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Trash2, 
  Filter,
  Check,
  X
} from "lucide-react";

const mockNotifications = [
  { id: 1, type: "alert", title: "At-Risk Student Detected", message: "Alex Johnson from Class 10-A has dropped below passing grade in Mathematics", time: "5 min ago", read: false },
  { id: 2, type: "success", title: "Results Imported Successfully", message: "245 student results have been imported from the spreadsheet", time: "1 hour ago", read: false },
  { id: 3, type: "info", title: "Weekly Report Ready", message: "Your weekly performance report is ready to view", time: "2 hours ago", read: true },
  { id: 4, type: "alert", title: "Low Attendance Alert", message: "Maria Garcia has below 75% attendance this month", time: "3 hours ago", read: true },
  { id: 5, type: "success", title: "Prediction Model Updated", message: "Our AI model has been retrained with new data - accuracy improved to 96%", time: "Yesterday", read: true },
  { id: 6, type: "info", title: "System Maintenance", message: "Scheduled maintenance on Saturday 2am-4am EST", time: "Yesterday", read: true },
  { id: 7, type: "alert", title: "New Enrollment", message: "New student John Smith added to Class 9-B", time: "2 days ago", read: true },
  { id: 8, type: "success", title: "Report Generated", message: "Q1 2025 Performance Report has been generated", time: "3 days ago", read: true },
];

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState(mockNotifications);

  const filtered = filter === "all" 
    ? notifications 
    : filter === "unread" 
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.type === filter);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "alert": return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "success": return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "alert": return "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800";
      case "success": return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      default: return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Notifications</h1>
          <p className="text-slate-500 dark:text-slate-400">Stay updated with important alerts and events</p>
        </div>
        <button 
          onClick={markAllRead}
          className="inline-flex items-center gap-2 px-4 py-2 text-teal-600 border border-teal-600 rounded-lg font-medium hover:bg-teal-50 dark:hover:bg-teal-900"
        >
          <Check className="w-4 h-4" />
          Mark all as read
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800 dark:text-white">{notifications.length}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Total</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800 dark:text-white">{notifications.filter(n => n.type === 'alert').length}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Alerts</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800 dark:text-white">{notifications.filter(n => n.type === 'success').length}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Success</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800 dark:text-white">{unreadCount}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Unread</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: "all", label: "All" },
          { id: "unread", label: "Unread" },
          { id: "alert", label: "Alerts" },
          { id: "success", label: "Success" },
          { id: "info", label: "Info" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === f.id 
                ? 'bg-teal-600 text-white' 
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            No notifications found
          </div>
        ) : (
          filtered.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-4 rounded-xl border ${getBgColor(notification.type)} ${notification.read ? 'opacity-70' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-800 dark:text-white">{notification.title}</h3>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">{notification.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-500">{notification.time}</span>
                    <button 
                      onClick={() => deleteNotification(notification.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}