import { neon } from "@neondatabase/serverless";

/**
 * Neon Database Client — Pooled connection untuk API routes (serverless-safe)
 */
export function getDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL tidak ditemukan. Pastikan .env.local sudah terkonfigurasi."
    );
  }
  return neon(connectionString);
}
