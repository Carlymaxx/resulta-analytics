"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  BarChart3, TrendingUp, Users, GraduationCap, FileText, Brain, Settings, LogOut,
  Menu, X, Moon, Sun, Bell, Search, BookOpen, Contact, Info, Tag, BellRing, Calendar,
  Activity, UserCheck, BookMarked, Clock, DollarSign, Wallet, CreditCard, Building2,
  Bus, Package, Heart, Briefcase, MessageSquare, Monitor, ClipboardList, Award, Shield, Library, LayoutGrid
} from "lucide-react";

const navGroups = [
  {
    label: "Main",
    items: [
      { href: "/portal", label: "Portal", icon: LayoutGrid },
      { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
      { href: "/activity", label: "Activity Log", icon: Activity },
    ]
  },
  {
    label: "Academic",
    items: [
      { href: "/students", label: "Students", icon: Users },
      { href: "/teachers", label: "Teachers", icon: UserCheck },
      { href: "/classes", label: "Classes", icon: BookOpen },
      { href: "/subjects", label: "Learning Areas", icon: BookMarked },
      { href: "/timetable", label: "Timetable", icon: Clock },
      { href: "/attendance", label: "Attendance", icon: Calendar },
    ]
  },
  {
    label: "Examinations",
    items: [
      { href: "/marks", label: "Marks & Reports", icon: ClipboardList },
      { href: "/results", label: "Results", icon: FileText },
      { href: "/analytics", label: "Analytics", icon: TrendingUp },
      { href: "/predictions", label: "Predictions", icon: Brain },
      { href: "/reports", label: "Reports", icon: GraduationCap },
    ]
  },
  {
    label: "Finance",
    items: [
      { href: "/finance", label: "Finance", icon: DollarSign },
      { href: "/payroll", label: "Payroll", icon: Wallet },
      { href: "/subscription", label: "Subscription", icon: CreditCard },
    ]
  },
  {
    label: "Modules",
    items: [
      { href: "/library", label: "Library", icon: Library },
      { href: "/hostel", label: "Hostel", icon: Building2 },
      { href: "/transport", label: "Transport", icon: Bus },
      { href: "/inventory", label: "Inventory", icon: Package },
      { href: "/medical", label: "Medical", icon: Heart },
    ]
  },
  {
    label: "HR & Comms",
    items: [
      { href: "/hr", label: "Human Resources", icon: Briefcase },
      { href: "/communication", label: "Communication", icon: MessageSquare },
    ]
  },
  {
    label: "E-Learning",
    items: [
      { href: "/elearning", label: "E-Learning", icon: Monitor },
      { href: "/cbt", label: "CBT Exams", icon: ClipboardList },
      { href: "/certificates", label: "Certificates", icon: Award },
    ]
  },
  {
    label: "Admin",
    items: [
      { href: "/super-admin", label: "Super Admin", icon: Shield },
      { href: "/notifications", label: "Notifications", icon: BellRing },
      { href: "/settings", label: "Settings", icon: Settings },
      { href: "/pricing", label: "Pricing", icon: Tag },
      { href: "/about", label: "About", icon: Info },
      { href: "/contact", label: "Contact", icon: Contact },
    ]
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => { logout(); router.push("/"); };
  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 h-16">
          <div className="flex items-center justify-between h-full px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                {sidebarOpen ? <X className="w-6 h-6 dark:text-white" /> : <Menu className="w-6 h-6 dark:text-white" />}
              </button>
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-800 dark:text-white hidden sm:block">{user?.school || "My School"}</span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm ml-2 text-slate-800 dark:text-white placeholder-slate-400 w-40" />
              </div>
              <button onClick={() => setDarkMode(!darkMode)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg" title={darkMode ? "Light Mode" : "Dark Mode"}>
                {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
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
                  <div className="text-slate-500 dark:text-slate-400 text-xs capitalize">{user?.role?.replace("_", " ") || "Guest"}</div>
                </div>
              </div>
              <button onClick={handleLogout} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-red-600" title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Sidebar */}
        <aside className={`fixed top-16 left-0 bottom-0 w-64 bg-slate-800 dark:bg-slate-950 text-white z-40 transform transition-transform duration-300 overflow-y-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
          <nav className="p-3 pb-20">
            {navGroups.map((group) => (
              <div key={group.label} className="mb-3">
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{group.label}</div>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${isActive ? "bg-teal-600 text-white" : "text-slate-300 hover:bg-slate-700 hover:text-white"}`}>
                        <item.icon className="w-4 h-4 flex-shrink-0" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-700 bg-slate-800">
            <div className="bg-slate-700/50 rounded-lg p-3 text-sm">
              <div className="text-slate-400 text-xs mb-1">School Year</div>
              <div className="font-semibold text-white">2025 – 2026</div>
              {user?.school && <div className="text-teal-400 text-xs mt-1 truncate">{user.school}</div>}
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="lg:ml-64 pt-16 min-h-screen">
          <div className="p-6">{children}</div>
        </main>

        {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      </div>
    </div>
  );
}
