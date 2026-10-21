import { betterAuth } from "better-auth";
import { Pool } from "@neondatabase/serverless";
import { verifyPassword } from "@/lib/auth/password";
import type { UserRole } from "@/lib/types";

export const ADMIN_ROLES: UserRole[] = ["super_admin"];
export const EDITOR_ROLES: UserRole[] = ["super_admin", "editor"];

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const auth = betterAuth({
  secret: process.env.AUTH_SECRET,
  database: pool,
  emailAndPassword: {
    enabled: true,
    password: {
      // Verifikasi hash scrypt legacy (format scrypt:N:r:p:salt:hash) —
      // password user lama tetap valid tanpa reset.
      verify: async ({ password, hash }) => verifyPassword(password, hash),
    },
    // Selalu jalankan verifikasi (hash dummy bila user tak ada) agar
    // waktu respons seragam dan email tidak bisa di-enumerate.
    disableSignUp: true,
  },
  session: {
    expiresIn: 60 * 60 * 8, // 8 jam, paritas dengan sesi lama
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  user: {
    modelName: "users",
    fields: {
      name: "name",
      email: "email",
      emailVerified: "email_verified",
      image: "avatar_url",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "editor",
        input: false,
      },
    },
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 10,
  },
  advanced: {
    cookiePrefix: "yazzaka",
  },
});
