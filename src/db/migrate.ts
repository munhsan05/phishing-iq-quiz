/**
 * Apply the latest drizzle-generated migration SQL to Neon.
 *
 * Drizzle-kit push is interactive (requires TTY) and fails in agent
 * shells. This script reads the generated SQL file and runs each
 * statement via the Neon HTTP driver. Safe for a fresh DB; use
 * drizzle-kit migrate (not push) for iterative migrations later.
 *
 * Usage: npx tsx src/db/migrate.ts
 */
import "dotenv/config";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in .env");
}

const sql = neon(process.env.DATABASE_URL);

const drizzleDir = join(process.cwd(), "drizzle");
const sqlFiles = readdirSync(drizzleDir)
  .filter((f) => f.endsWith(".sql") && !f.includes("_rollback"))
  .sort();

if (sqlFiles.length === 0) {
  console.error("No .sql files found in drizzle/");
  process.exit(1);
}

async function run() {
  for (const file of sqlFiles) {
    const fullPath = join(drizzleDir, file);
    const content = readFileSync(fullPath, "utf-8");
    const statements = content
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    console.log(`\n-> Applying ${file} (${statements.length} statements)`);
    for (const stmt of statements) {
      try {
        await sql.query(stmt);
        const preview = stmt.split("\n")[0].slice(0, 80);
        console.log(`   ok: ${preview}`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("already exists")) {
          console.log(`   skip (exists): ${stmt.split("\n")[0].slice(0, 60)}`);
          continue;
        }
        console.error(`   FAILED: ${stmt.split("\n")[0].slice(0, 60)}`);
        console.error(`   ${msg}`);
        process.exit(1);
      }
    }
  }
  console.log("\nMigration complete.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
