import { createHmac, timingSafeEqual } from "crypto";
import type { UserRole } from "@/lib/types";

export const SESSION_COOKIE = "cms_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 jam

export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string | null;
  exp: number; // unix detik
}

export const ADMIN_ROLES: UserRole[] = ["super_admin"];
export const EDITOR_ROLES: UserRole[] = ["super_admin", "editor"];

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET tidak valid. Set variabel lingkungan AUTH_SECRET (min 32 karakter)."
    );
  }
  return secret;
}

function base64urlEncode(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}

function base64urlDecode(input: string): string {
  return Buffer.from(input, "base64url").toString("utf8");
}

function sign(data: string): string {
  return createHmac("sha256", getAuthSecret()).update(data).digest("base64url");
}

export function createSessionToken(
  payload: Omit<SessionPayload, "exp">
): { token: string; expiresAt: Date } {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;
  const full: SessionPayload = { ...payload, exp };
  const body = base64urlEncode(JSON.stringify(full));
  const sig = sign(body);
  return { token: `${body}.${sig}`, expiresAt: new Date(exp * 1000) };
}

export function verifySessionToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const dotIndex = token.lastIndexOf(".");
  if (dotIndex <= 0) return null;

  const body = token.slice(0, dotIndex);
  const sig = token.slice(dotIndex + 1);

  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(base64urlDecode(body)) as SessionPayload;
    if (
      typeof payload.exp !== "number" ||
      typeof payload.sub !== "string" ||
      typeof payload.role !== "string"
    ) {
      return null;
    }
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function getCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}
