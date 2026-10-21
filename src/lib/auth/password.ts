import { scryptSync, timingSafeEqual, randomBytes } from "crypto";

/**
 * Format hash legacy yang dipakai CMS ini (dibuat oleh scripts/migrate-auth.mjs
 * dan src/app/api/users): scrypt:N:r:p:salt_hex:hash_hex
 */

export function hashPassword(password: string): string {
  const N = 16384;
  const r = 8;
  const p = 1;
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, 64, { N, r, p });
  return `scrypt:${N}:${r}:${p}:${salt.toString("hex")}:${derived.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const parts = stored.split(":");
    if (parts.length !== 6 || parts[0] !== "scrypt") return false;
    const N = parseInt(parts[1], 10);
    const r = parseInt(parts[2], 10);
    const p = parseInt(parts[3], 10);
    const salt = Buffer.from(parts[4], "hex");
    const expected = Buffer.from(parts[5], "hex");
    const derived = scryptSync(password, salt, expected.length, { N, r, p });
    return timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

/** Hash dummy untuk mitigasi timing enumeration saat user tidak ditemukan. */
export function dummyHash(): string {
  return `scrypt:16384:8:1:${randomBytes(16).toString("hex")}:${randomBytes(64).toString("hex")}`;
}
