"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { canAccess, logAudit } from "@/lib/schoolStore";
import { Shield, Lock, Loader2 } from "lucide-react";

const PUBLIC_PATHS = ["/", "/login", "/signup", "/about", "/contact", "/pricing"];
const ONBOARDING_PATH = "/onboarding";

const isPublicPath = (path: string) => {
  if (PUBLIC_PATHS.includes(path)) return true;
  if (path === ONBOARDING_PATH) return true;
  if (path.startsWith("/verify/")) return true;
  return false;
};

const MODULE_MAP: Record<string, string> = {
  "/dashboard": "dashboard",
  "/students": "students",
  "/teachers": "teachers",
  "/classes": "classes",
  "/subjects": "subjects",
  "/timetable": "timetable",
  "/attendance": "attendance",
  "/marks": "marks",
  "/results": "results",
  "/analytics": "analytics",
  "/predictions": "predictions",
  "/reports": "reports",
  "/finance": "finance",
  "/payroll": "payroll",
  "/subscription": "subscription",
  "/library": "library",
  "/hostel": "hostel",
  "/transport": "transport",
  "/inventory": "inventory",
  "/medical": "medical",
  "/hr": "hr",
  "/communication": "communication",
  "/elearning": "elearning",
  "/cbt": "cbt",
  "/certificates": "certificates",
  "/super-admin": "super-admin",
  "/notifications": "notifications",
  "/settings": "settings",
  "/activity": "activity",
};

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const [authorized, setAuthorized] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    const isPublic = PUBLIC_PATHS.some((p) => pathname === p) || pathname === ONBOARDING_PATH || pathname.startsWith("/verify/");
    if (isPublic) {
      setAuthorized(true);
      return;
    }
    if (!user) {
      router.push("/login");
      return;
    }
    const matchedPath = Object.keys(MODULE_MAP).find((p) => pathname === p || pathname.startsWith(p + "/"));
    if (matchedPath) {
      const module = MODULE_MAP[matchedPath];
      if (!canAccess(user.role, module)) {
        setDenied(true);
        logAudit(
          {
            userId: user.id,
            userName: user.name,
            userRole: user.role,
            action: "ACCESS_DENIED",
            module,
            details: `Attempted to access ${pathname}`,
          },
          user.schoolId
        );
        return;
      }
    }
    setAuthorized(true);
  }, [user, isLoading, pathname, router]);

  if (denied) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h2>
          <p className="text-slate-500 mb-6">
            Your role ({user?.role}) does not have permission to access this module.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-teal-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-teal-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-teal-600 animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
