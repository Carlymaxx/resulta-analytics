"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  GraduationCap,
  FileText,
  Brain,
  Settings,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  Bell,
  Search,
  BookOpen,
  Contact,
  Info,
  Tag,
  BellRing,
  Calendar,
  Activity
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/results", label: "Results", icon: FileText },
  { href: "/analytics", label: "Analytics", icon: TrendingUp },
  { href: "/predictions", label: "Predictions", icon: Brain },
  { href: "/reports", label: "Reports", icon: GraduationCap },
  { href: "/classes", label: "Classes", icon: BookOpen },
  { href: "/students", label: "Students", icon: Users },
  { href: "/attendance", label: "Attendance", icon: Calendar },
  { href: "/notifications", label: "Notifications", icon: BellRing },
  { href: "/activity", label: "Activity Log", icon: Activity },
  { href: "/about", label: "About", icon: Info },
  { href: "/pricing", label: "Pricing", icon: Tag },
  { href: "/contact", label: "Contact", icon: Contact },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
        {/* Top Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 h-16">
          <div className="flex items-center justify-between h-full px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
              >
                {sidebarOpen ? <X className="w-6 h-6 dark:text-white" /> : <Menu className="w-6 h-6 dark:text-white" />}
              </button>
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-800 dark:text-white hidden sm:block">Resulta Analytics</span>
              </Link>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search students, results..."
                  className="bg-transparent border-none outline-none text-sm ml-2 text-slate-800 dark:text-white placeholder-slate-400 w-48"
                />
              </div>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                title={darkMode ? "Light Mode" : "Dark Mode"}
              >
                {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300" />}
              </button>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg relative">
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white font-semibold text-sm">
                  {user ? getInitials(user.name) : "U"}
                </div>
                <div className="text-sm">
                  <div className="font-medium text-slate-800 dark:text-white">{user?.name || "User"}</div>
                  <div className="text-slate-500 dark:text-slate-400 text-xs capitalize">{user?.role || "Guest"}</div>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-red-600"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Sidebar */}
        <aside className={`fixed top-16 left-0 bottom-0 w-64 bg-slate-800 dark:bg-slate-950 text-white z-40 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-teal-600 text-white' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="text-sm text-slate-300 mb-2">School Year</div>
              <div className="font-semibold">2025-2026</div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:ml-64 pt-16 min-h-screen">
          <div className="p-6">
            {children}
          </div>
        </main>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
}