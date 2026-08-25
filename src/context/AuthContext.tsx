"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/lib/types";
import { initialUsers } from "@/lib/data/initialData";

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (email: string, role?: UserRole) => boolean;
  loginWithCredentials: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  hasPermission: (allowedRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "yazzaka_auth_user_v1";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>("viewer");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedUser) {
        const user: User = JSON.parse(savedUser);
        setCurrentUser(user);
        setRole(user.role);
      } else {
        // Jika belum ada sesi tersimpan, tetapkan akun default untuk demo seamless
        const defaultUser = initialUsers[0];
        setCurrentUser(defaultUser);
        setRole(defaultUser.role);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultUser));
      }
    } catch (e) {
      console.warn("Failed to load auth user:", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const loginWithCredentials = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    // Simulasi penundaan request otentikasi jaringan yang aman dan responsif
    await new Promise((resolve) => setTimeout(resolve, 350));

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      return {
        success: false,
        error: "Email dan kata sandi wajib diisi.",
      };
    }

    // Format email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return {
        success: false,
        error: "Format alamat email tidak valid.",
      };
    }

    if (cleanPassword.length < 6) {
      return {
        success: false,
        error: "Kata sandi harus terdiri dari minimal 6 karakter.",
      };
    }

    // Cari akun terdaftar di data staf institusi
    const matchedUser = initialUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    // Kredensial demo diterima untuk staf terdaftar atau email institusi yazzakka.sch.id
    if (matchedUser || cleanEmail.endsWith("@yazzakka.sch.id")) {
      const authenticatedUser: User = matchedUser || {
        id: `usr-${Date.now()}`,
        name: cleanEmail.split("@")[0].replace(".", " ").toUpperCase(),
        email: cleanEmail,
        role: "admin",
        createdAt: new Date().toISOString().split("T")[0],
      };

      setCurrentUser(authenticatedUser);
      setRole(authenticatedUser.role);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedUser));
      return { success: true };
    }

    return {
      success: false,
      error: "Kombinasi email atau kata sandi tidak valid. Silakan periksa kembali kredensial Anda.",
    };
  };

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
        isInitialized,
        login,
        loginWithCredentials,
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
