"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/lib/types";

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isInitialized: boolean;
  loginWithCredentials: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  hasPermission: (allowedRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active) setCurrentUser(data?.user ?? null);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setIsInitialized(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const loginWithCredentials = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.user) {
        setCurrentUser(data.user);
        return { success: true };
      }

      return {
        success: false,
        error:
          data?.error ||
          "Kombinasi email atau kata sandi tidak valid. Silakan periksa kembali.",
      };
    } catch {
      return {
        success: false,
        error: "Terjadi gangguan saat menghubungi server. Silakan coba kembali.",
      };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Tetap bersihkan state lokal meski request logout gagal
    }
    setCurrentUser(null);
  };

  const role: UserRole = currentUser?.role ?? "viewer";

  const hasPermission = (allowedRoles: UserRole[]): boolean => {
    if (!currentUser) return false;
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
        loginWithCredentials,
        logout,
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
