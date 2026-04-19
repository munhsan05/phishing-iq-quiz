/**
 * One-off backfill: copy legacy email columns (emailFrom, emailSubject,
 * emailBody, emailUrl) into the new polymorphic `content` JSONB column
 * for existing rows where type='email'. Safe to re-run (idempotent update).
 *
 * Usage: npx tsx src/db/migrate-email-content.ts
 */
import "dotenv/config";
import { db } from "./index";
import { questions } from "./schema";
import { eq } from "drizzle-orm";

async function main() {
  const emails = await db.select().from(questions).where(eq(questions.type, "email"));
  let updated = 0;
  for (const q of emails) {
    await db
      .update(questions)
      .set({
        content: {
          from: q.emailFrom,
          subject: q.emailSubject,
          body: q.emailBody,
          ...(q.emailUrl ? { url: q.emailUrl } : {}),
        },
      })
      .where(eq(questions.id, q.id));
    updated++;
  }
  console.log(`✓ Migrated ${updated} email rows to content JSONB`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
