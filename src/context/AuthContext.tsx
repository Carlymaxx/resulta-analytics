"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type EducationLevel = "primary" | "junior" | "secondary" | "other";

export const EDUCATION_LEVELS: { value: EducationLevel; label: string; description: string }[] = [
  { value: "primary", label: "Primary Schools", description: "Lower & Upper Primary (CBC)" },
  { value: "junior", label: "Junior School / KNEC Students", description: "Junior Secondary (CBC)" },
  { value: "secondary", label: "Secondary Schools (KCSE)", description: "Form 1 - Form 4" },
  { value: "other", label: "Other", description: "Other educational institution" },
];

export type UserRole = "superadmin" | "admin" | "principal" | "deputy_principal" | "accountant" | "teacher" | "class_teacher" | "librarian" | "student" | "parent" | "receptionist" | "hostel_manager" | "transport_manager" | "nurse" | "security";

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  school?: string;
  level?: EducationLevel;
  schoolBadge?: string;
  schoolAddress?: string;
  schoolBox?: string;
  schoolMotto?: string;
  schoolPhone?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, role: string, level: EducationLevel, school: string, schoolBadge: string, schoolAddress?: string, schoolBox?: string, schoolMotto?: string, schoolPhone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface MockUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  school?: string;
  level?: EducationLevel;
  schoolBadge?: string;
  schoolAddress?: string;
  schoolBox?: string;
  schoolMotto?: string;
  schoolPhone?: string;
}

const MOCK_USERS: MockUser[] = [
  { id: "0", email: "superadmin@msms.com", password: "super123", name: "Super Admin", role: "superadmin" },
  { id: "1", email: "admin@school.edu", password: "admin123", name: "Admin User", role: "admin", school: "Nairobi High School", level: "secondary", schoolBadge: "", schoolAddress: "P.O. Box 123-00100, Nairobi, Kenya", schoolBox: "P.O. Box 123-00100", schoolMotto: "Education for Excellence", schoolPhone: "+254 700 000 000" },
  { id: "3", email: "student@school.edu", password: "student123", name: "Student John", role: "student", school: "Nairobi High School", level: "secondary", schoolBadge: "" },
  { id: "4", email: "principal@school.edu", password: "principal123", name: "Dr. Mary Wanjiku", role: "principal", school: "Nairobi High School", level: "secondary", schoolBadge: "" },
  { id: "5", email: "accountant@school.edu", password: "account123", name: "James Otieno", role: "accountant", school: "Nairobi High School", level: "secondary", schoolBadge: "" },
  { id: "6", email: "parent@school.edu", password: "parent123", name: "Mr. David Kamau", role: "parent", school: "Nairobi High School", level: "primary", schoolBadge: "" },
];

export const ALL_ROLES: { value: UserRole; label: string }[] = [
  { value: "admin", label: "School Admin" },
  { value: "principal", label: "Principal" },
  { value: "deputy_principal", label: "Deputy Principal" },
  { value: "teacher", label: "Teacher" },
  { value: "class_teacher", label: "Class Teacher" },
  { value: "accountant", label: "Accountant" },
  { value: "librarian", label: "Librarian" },
  { value: "student", label: "Student" },
  { value: "parent", label: "Parent" },
  { value: "receptionist", label: "Receptionist" },
  { value: "hostel_manager", label: "Hostel Manager" },
  { value: "transport_manager", label: "Transport Manager" },
  { value: "nurse", label: "Nurse" },
  { value: "security", label: "Security Officer" },
];

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  level?: EducationLevel;
  school?: string;
  schoolBadge?: string;
  source: "built-in" | "signup";
}

// Returns all accounts the platform knows about: built-in demo accounts + self-signups.
export function getRegisteredUsers(): RegisteredUser[] {
  const builtIn: RegisteredUser[] = MOCK_USERS.map((u) => ({
    id: u.id, name: u.name, email: u.email, role: u.role, level: u.level, school: u.school, schoolBadge: u.schoolBadge, source: "built-in",
  }));
  if (typeof window === "undefined") return builtIn;
  try {
    const raw = localStorage.getItem("resulta_signups");
    const signups: MockUser[] = raw ? JSON.parse(raw) : [];
    const mapped: RegisteredUser[] = signups.map((u) => ({
      id: u.id, name: u.name, email: u.email, role: u.role, level: u.level, school: u.school, schoolBadge: u.schoolBadge, source: "signup",
    }));
    return [...builtIn, ...mapped];
  } catch {
    return builtIn;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("resulta_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (foundUser) {
       const userData = { id: foundUser.id, email: foundUser.email, name: foundUser.name, role: foundUser.role, school: foundUser.school, level: foundUser.level, schoolBadge: foundUser.schoolBadge, schoolAddress: foundUser.schoolAddress, schoolBox: foundUser.schoolBox, schoolMotto: foundUser.schoolMotto, schoolPhone: foundUser.schoolPhone };
      setUser(userData);
      localStorage.setItem("resulta_user", JSON.stringify(userData));
      setIsLoading(false);
      return { success: true };
    }
    const storedUsers = localStorage.getItem("resulta_signups");
    if (storedUsers) {
      const signups: MockUser[] = JSON.parse(storedUsers);
      const signedUpUser = signups.find(u => u.email === email && u.password === password);
      if (signedUpUser) {
         const userData = { id: signedUpUser.id, email: signedUpUser.email, name: signedUpUser.name, role: signedUpUser.role, school: signedUpUser.school, level: signedUpUser.level, schoolBadge: signedUpUser.schoolBadge, schoolAddress: signedUpUser.schoolAddress, schoolBox: signedUpUser.schoolBox, schoolMotto: signedUpUser.schoolMotto, schoolPhone: signedUpUser.schoolPhone };
        setUser(userData);
        localStorage.setItem("resulta_user", JSON.stringify(userData));
        setIsLoading(false);
        return { success: true };
      }
    }
    setIsLoading(false);
    return { success: false, error: "Invalid email or password" };
  };

  const signup = async (name: string, email: string, password: string, role: string, level: EducationLevel, school: string, schoolBadge: string, schoolAddress?: string, schoolBox?: string, schoolMotto?: string, schoolPhone?: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const storedUsers = localStorage.getItem("resulta_signups");
    const existingUsers: MockUser[] = storedUsers ? JSON.parse(storedUsers) : [];
    if (existingUsers.some(u => u.email === email)) {
      setIsLoading(false);
      return { success: false, error: "Email already registered" };
    }
    const newUser: MockUser = { id: Date.now().toString(), email, password, name, role: role as UserRole, level, school, schoolBadge, schoolAddress, schoolBox, schoolMotto, schoolPhone };
    existingUsers.push(newUser);
    localStorage.setItem("resulta_signups", JSON.stringify(existingUsers));
    const userData = { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role, level: newUser.level, school: newUser.school, schoolBadge: newUser.schoolBadge, schoolAddress: newUser.schoolAddress, schoolBox: newUser.schoolBox, schoolMotto: newUser.schoolMotto, schoolPhone: newUser.schoolPhone };
    setUser(userData);
    localStorage.setItem("resulta_user", JSON.stringify(userData));
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("resulta_user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
