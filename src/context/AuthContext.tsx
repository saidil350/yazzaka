"use client";

import React, { createContext, use, useCallback, useEffect, useState } from "react";
import { authClient } from "@/lib/auth/client";
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

function mapUser(betterUser: {
  id: string;
  name: string;
  email: string;
  role?: string;
  image?: string | null;
} | null | undefined): User | null {
  if (!betterUser) return null;
  return {
    id: betterUser.id,
    name: betterUser.name,
    email: betterUser.email,
    role: (betterUser.role as UserRole) ?? "editor",
    avatarUrl: betterUser.image ?? undefined,
    createdAt: "",
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/get-session", { cache: "no-store" });
      const data = res.ok ? await res.json().catch(() => null) : null;
      setCurrentUser(mapUser(data?.user));
    } catch {
      // Biarkan state sesudahnya; jangan logout paksa saat jaringan gagal
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const loginWithCredentials = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const { error } = await authClient.signIn.email({ email, password });
    if (error) {
      return {
        success: false,
        error:
          error.status === 401 || error.status === 403
            ? "Email atau kata sandi tidak valid. Silakan periksa kembali kredensial Anda."
            : "Terjadi gangguan saat menghubungi server. Silakan coba kembali.",
      };
    }
    await refreshSession();
    return { success: true };
  };

  const logout = async () => {
    try {
      await authClient.signOut();
    } catch {
      // Tetap bersihkan state lokal meski request logout gagal
    }
    setCurrentUser(null);
  };

  const role: UserRole = currentUser?.role ?? "editor";

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
  const context = use(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
