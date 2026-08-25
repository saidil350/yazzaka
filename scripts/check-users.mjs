import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const sql = neon(process.env.DATABASE_URL);
const rows = await sql`
  SELECT id, email, role,
         length(coalesce(password_hash, '')) AS hash_len,
         created_at
  FROM users ORDER BY created_at, id
`;
console.table(rows);
