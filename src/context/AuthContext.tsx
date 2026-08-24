"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/lib/types";
import { initialUsers } from "@/lib/data/initialData";

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  hasPermission: (allowedRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "yazzaka_auth_user_v1";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(initialUsers[0]);
  const [role, setRole] = useState<UserRole>("super_admin");

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
        if (savedUser) {
          const user: User = JSON.parse(savedUser);
          setCurrentUser(user);
          setRole(user.role);
        }
      } catch (e) {
        console.warn("Failed to load auth user:", e);
      }
    });
  }, []);

  const login = (email: string, selectedRole?: UserRole): boolean => {
    const user = initialUsers.find((u) => u.email === email) || {
      id: "usr-custom",
      name: email.split("@")[0].toUpperCase(),
      email,
      role: selectedRole || "admin",
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(user);
    setRole(user.role);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setRole("viewer");
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    if (currentUser) {
      const updatedUser = { ...currentUser, role: newRole };
      setCurrentUser(updatedUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    }
  };

  const hasPermission = (allowedRoles: UserRole[]): boolean => {
    if (!role) return false;
    if (role === "super_admin") return true;
    return allowedRoles.includes(role);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isAuthenticated: !!currentUser,
        login,
        logout,
        switchRole,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
