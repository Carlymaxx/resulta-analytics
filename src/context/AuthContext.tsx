"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "teacher" | "student" | "parent";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, role: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface MockUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "admin" | "teacher" | "student" | "parent";
}

const MOCK_USERS: MockUser[] = [
  { id: "1", email: "admin@school.edu", password: "admin123", name: "Admin User", role: "admin" },
  { id: "2", email: "teacher@school.edu", password: "teacher123", name: "Teacher Lenn", role: "teacher" },
  { id: "3", email: "student@school.edu", password: "student123", name: "Student John", role: "student" },
];

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
    
    const foundUser = MOCK_USERS.find(
      u => u.email === email && u.password === password
    );

    if (foundUser) {
      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
      };
      setUser(userData);
      localStorage.setItem("resulta_user", JSON.stringify(userData));
      setIsLoading(false);
      return { success: true };
    }

    const storedUsers = localStorage.getItem("resulta_signups");
    if (storedUsers) {
      const signups: typeof MOCK_USERS = JSON.parse(storedUsers);
      const signedUpUser = signups.find(
        u => u.email === email && u.password === password
      );
      if (signedUpUser) {
        const userData = {
          id: signedUpUser.id,
          email: signedUpUser.email,
          name: signedUpUser.name,
          role: signedUpUser.role,
        };
        setUser(userData);
        localStorage.setItem("resulta_user", JSON.stringify(userData));
        setIsLoading(false);
        return { success: true };
      }
    }

    setIsLoading(false);
    return { success: false, error: "Invalid email or password" };
  };

  const signup = async (name: string, email: string, password: string, role: string) => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const storedUsers = localStorage.getItem("resulta_signups");
    const existingUsers: MockUser[] = storedUsers ? JSON.parse(storedUsers) : [];
    
    if (existingUsers.some(u => u.email === email)) {
      setIsLoading(false);
      return { success: false, error: "Email already registered" };
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      role: role as "admin" | "teacher" | "student" | "parent",
    };
    
    existingUsers.push(newUser);
    localStorage.setItem("resulta_signups", JSON.stringify(existingUsers));

    const userData = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    };
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
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}