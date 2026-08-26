"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BarChart3, Eye, EyeOff, Loader2, Check, Upload, School, Shield, Users, GraduationCap } from "lucide-react";
import { useAuth, EDUCATION_LEVELS, EducationLevel } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isFilling, setIsFilling] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      router.push("/portal");
    } else {
      setError(result.error || "Login failed");
    }
  };

  const demoAccounts = [
    { email: "superadmin@msms.com", role: "Super Admin", icon: Shield, desc: "Platform-wide access" },
    { email: "admin@school.edu", role: "School Admin", icon: School, desc: "Nairobi High School" },
    { email: "principal@school.edu", role: "Principal", icon: GraduationCap, desc: "Academic leadership" },
    { email: "student@school.edu", role: "Student", icon: GraduationCap, desc: "Learner account" },
    { email: "accountant@school.edu", role: "Accountant", icon: Users, desc: "Finance officer" },
    { email: "parent@school.edu", role: "Parent", icon: Users, desc: "Guardian access" },
  ];

  const fillDemo = async (demoEmail: string) => {
    setIsFilling(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setEmail(demoEmail);
    const passwords: Record<string, string> = {
      "superadmin@msms.com": "super123",
      "admin@school.edu": "admin123",
      "principal@school.edu": "principal123",
      "student@school.edu": "student123",
      "accountant@school.edu": "account123",
      "parent@school.edu": "parent123",
    };
    setPassword(passwords[demoEmail] || "super123");
    setError("");
    setIsFilling(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-800">Resulta Analytics</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome back</h1>
          <p className="text-slate-500 mb-8">Sign in to access your school dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <Shield className="w-4 h-4" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@school.edu"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
            </button>

            <p className="text-center text-slate-500 text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-teal-600 font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>

        <div className="mt-6 bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Demo Accounts</h3>
          <div className="space-y-2">
            {demoAccounts.map((demo) => {
              const Icon = demo.icon;
              return (
                <button
                  key={demo.email}
                  onClick={() => fillDemo(demo.email)}
                  disabled={isFilling}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-teal-500 hover:bg-teal-50 transition-all disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-teal-600" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-slate-800">{demo.role}</div>
                      <div className="text-xs text-slate-500">{demo.desc}</div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">Click to fill</span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-slate-400 mt-3">Password for all demo accounts: <span className="font-mono font-semibold">super123</span></p>
        </div>
      </div>
    </div>
  );
}
