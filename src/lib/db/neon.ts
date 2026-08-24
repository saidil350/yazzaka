import { neon } from "@neondatabase/serverless";

/**
 * Neon Database Client
 * Jika DATABASE_URL ada di environment variables (.env / .env.local), fungsi ini akan menghubungkan query ke PostgreSQL di Neon.
 */
export function getDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }
  return neon(connectionString);
}
