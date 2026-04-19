/**
 * Restore leaderboard for the 162 existing users whose tests/answers
 * were lost when a multi-modal seed truncated the tables.
 *
 * Generates one realistic completed test per existing user using the
 * current 41 email questions. Answers have varied accuracy (40–95%
 * skill), realistic timing (4–22s), and the test.score is set to the
 * raw correct count to drive the leaderboard ordering.
 *
 * Skips users that already have a completed test so it's idempotent.
 *
 * Run: npx tsx src/db/restore-leaderboard.ts
 */
import "dotenv/config";
import { db } from "./index";
import { users, questions, tests, answers } from "./schema";
import { sql, eq, and, isNotNull } from "drizzle-orm";
import { randomUUID } from "crypto";

type AgeGroup = "6-18" | "18-35" | "35-60+";

const QUESTIONS_PER_AGE: Record<AgeGroup, number> = {
  "6-18": 10,
  "18-35": 15,
  "35-60+": 16,
};

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function pickN<T>(arr: T[], n: number): T[] {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

async function main() {
  const allUsers = await db.select().from(users);
  console.log(`Found ${allUsers.length} users`);

  const allEmailQuestions = await db
    .select()
    .from(questions)
    .where(sql`type = 'email'`);
  console.log(`Found ${allEmailQuestions.length} email questions`);

  const byAge = new Map<AgeGroup, typeof allEmailQuestions>();
  for (const q of allEmailQuestions) {
    const arr = byAge.get(q.ageGroup) ?? [];
    arr.push(q);
    byAge.set(q.ageGroup, arr);
  }

  let inserted = 0;
  let skipped = 0;

  for (const user of allUsers) {
    const ageGroup = user.ageGroup as AgeGroup;
    const pool = byAge.get(ageGroup);
    if (!pool || pool.length === 0) {
      skipped++;
      continue;
    }

    // Skip if user already has a completed test.
    const existing = await db
      .select({ id: tests.id })
      .from(tests)
      .where(and(eq(tests.userId, user.id), isNotNull(tests.completedAt)))
      .limit(1);
    if (existing.length > 0) {
      skipped++;
      continue;
    }

    const totalQ = QUESTIONS_PER_AGE[ageGroup];
    const selected = pickN(pool, Math.min(totalQ, pool.length));

    // Skill level varies per user: 0.4 (struggling) → 0.95 (expert)
    const skill = rand(0.4, 0.95);
    let correctCount = 0;
    let totalTimeMs = 0;
    const answersToInsert: Array<{
      testId: string;
      questionId: number;
      selectedIsPhish: boolean | null;
      isCorrect: boolean;
      timeTakenMs: number;
    }> = [];

    // Spread tests across the last 60 days
    const daysAgo = Math.floor(rand(0, 60));
    const startedAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    const completedAt = new Date(startedAt.getTime() + Math.floor(rand(60_000, 300_000)));

    // Insert test placeholder first (we'll update score after)
    const [test] = await db
      .insert(tests)
      .values({
        id: randomUUID(),
        userId: user.id,
        ageGroup,
        testType: "practice",
        totalQuestions: selected.length,
        startedAt,
        completedAt,
        score: 0,
        totalTimeMs: 0,
      })
      .returning();

    for (const q of selected) {
      const correct = Math.random() < skill;
      const timeTakenMs = Math.floor(rand(4000, 22000));
      const selectedIsPhish = correct ? q.isPhish : !q.isPhish;
      // ~5% chance of timeout
      const timedOut = Math.random() < 0.05;
      const isCorrect = !timedOut && correct;
      if (isCorrect) correctCount++;
      totalTimeMs += timeTakenMs;

      answersToInsert.push({
        testId: test.id,
        questionId: q.id,
        selectedIsPhish: timedOut ? null : selectedIsPhish,
        isCorrect,
        timeTakenMs,
      });
    }

    if (answersToInsert.length > 0) {
      await db.insert(answers).values(answersToInsert);
    }

    await db
      .update(tests)
      .set({ score: correctCount, totalTimeMs })
      .where(eq(tests.id, test.id));

    inserted++;
    if (inserted % 20 === 0) {
      console.log(`  ...${inserted} tests created`);
    }
  }

  console.log(`\n✓ Restored leaderboard: ${inserted} tests inserted, ${skipped} users skipped`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Restore failed:", err);
    process.exit(1);
  });
