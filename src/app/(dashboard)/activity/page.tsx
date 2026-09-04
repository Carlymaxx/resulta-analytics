"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Activity, 
  Search,
  Download,
  User,
  FileText,
  Settings,
  LogIn,
  LogOut,
  Upload,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Shield,
  Lock
} from "lucide-react";
import { loadAuditLog, clearAuditLog, AuditLogEntry } from "@/lib/schoolStore";

export default function ActivityLogPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    setLogs(loadAuditLog(user?.schoolId));
  }, [user?.schoolId]);

  if (!user) return null;

  if (user.role !== "superadmin" && user.role !== "admin" && user.role !== "principal") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Restricted</h2>
          <p className="text-slate-500">Only administrators can view the activity log.</p>
        </div>
      </div>
    );
  }

  const filtered = logs
    .filter(a => !user?.schoolId || a.schoolId === user.schoolId)
    .filter(a =>
      (a.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.details || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.userName || "").toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(a => filterType === "all" || a.module === filterType);

  const getActionIcon = (action: string) => {
    if (action.includes("CREATE") || action.includes("ADD")) return User;
    if (action.includes("DELETE") || action.includes("REMOVE")) return Trash2;
    if (action.includes("UPDATE")) return Settings;
    if (action.includes("LOGIN")) return LogIn;
    if (action.includes("LOGOUT")) return LogOut;
    if (action.includes("VIEW")) return FileText;
    if (action.includes("DENIED")) return Shield;
    if (action.includes("MARK")) return CheckCircle;
    return Activity;
  };

  const getIconColor = (action: string) => {
    if (action.includes("DENIED")) return "text-red-600 bg-red-100";
    if (action.includes("DELETE")) return "text-red-500 bg-red-100";
    if (action.includes("CREATE") || action.includes("MARK")) return "text-green-500 bg-green-100";
    if (action.includes("UPDATE")) return "text-blue-500 bg-blue-100";
    if (action.includes("LOGIN") || action.includes("LOGOUT")) return "text-teal-500 bg-teal-100";
    if (action.includes("VIEW")) return "text-purple-500 bg-purple-100";
    return "text-slate-500 bg-slate-100";
  };

  const timeAgo = (ts: string) => {
    const seconds = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const handleClear = () => {
    if (user.role !== "superadmin" && user.role !== "admin") return;
    if (!confirm("Clear all audit log entries? This cannot be undone.")) return;
    clearAuditLog(user.schoolId);
    setLogs([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Activity Log</h1>
          <p className="text-slate-500 dark:text-slate-400">Append-only audit trail · {logs.length} entries</p>
        </div>
        <div className="flex gap-2">
          {(user.role === "superadmin" || user.role === "admin") && (
            <button onClick={handleClear} className="inline-flex items-center gap-2 px-4 py-2 border border-red-200 text-red-700 rounded-lg hover:bg-red-50 text-sm">
              <Trash2 className="w-4 h-4" /> Clear Log
            </button>
          )}
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-sm text-slate-500 dark:text-slate-400">Total Entries</div>
          <div className="text-xl font-bold text-slate-800 dark:text-white">{logs.length}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-sm text-slate-500 dark:text-slate-400">User Actions</div>
          <div className="text-xl font-bold text-slate-800 dark:text-white">{logs.filter(l => l.userId).length}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-sm text-slate-500 dark:text-slate-400">Access Denied</div>
          <div className="text-xl font-bold text-red-600">{logs.filter(l => l.action === "ACCESS_DENIED").length}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-sm text-slate-500 dark:text-slate-400">Latest</div>
          <div className="text-sm font-mono text-slate-800 dark:text-white">{logs[0] ? new Date(logs[0].timestamp).toLocaleString("en-GB", { timeZone: "Africa/Nairobi" }) : "—"}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Search activities..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { id: "all", label: "All Modules" },
              { id: "students", label: "Students" },
              { id: "marks", label: "Marks" },
              { id: "finance", label: "Finance" },
              { id: "medical", label: "Medical" },
            ].map((f) => (
              <button key={f.id} onClick={() => setFilterType(f.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${filterType === f.id ? "bg-teal-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Activity className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="font-medium">No activity recorded</p>
              <p className="text-sm">As users interact with the system, their actions will be logged here.</p>
            </div>
          ) : filtered.map((activity) => {
            const Icon = getActionIcon(activity.action);
            return (
              <div key={activity.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconColor(activity.action)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-slate-800 dark:text-white">{activity.action}</span>
                      <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-100 text-slate-600">{activity.module}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{activity.details}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="font-medium">{activity.userName}</span>
                      <span>·</span>
                      <span className="capitalize">{activity.userRole}</span>
                      <span>·</span>
                      <span>{timeAgo(activity.timestamp)}</span>
                      <span>·</span>
                      <span className="font-mono">{activity.ip}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
