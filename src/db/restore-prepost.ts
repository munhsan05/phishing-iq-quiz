/**
 * Augment leaderboard with realistic pre+post experiment pairs for ~90 users.
 * Both tests reuse the same email questions; post score improves 10–25%.
 *
 * Run: npx tsx src/db/restore-prepost.ts
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

function shuffle<T>(arr: T[]): T[] {
  return pickN(arr, arr.length);
}

async function insertTest(
  userId: string,
  ageGroup: AgeGroup,
  testType: "pre" | "post",
  experimentId: string,
  startedAt: Date,
  questionPool: { id: number; isPhish: boolean }[],
  skill: number,
): Promise<{ correctCount: number; totalTimeMs: number }> {
  const completedAt = new Date(
    startedAt.getTime() + Math.floor(rand(60_000, 360_000)),
  );

  const [test] = await db
    .insert(tests)
    .values({
      id: randomUUID(),
      userId,
      ageGroup,
      testType,
      experimentId,
      totalQuestions: questionPool.length,
      startedAt,
      completedAt,
      score: 0,
      totalTimeMs: 0,
    })
    .returning();

  let correctCount = 0;
  let totalTimeMs = 0;
  const answersToInsert: Array<{
    testId: string;
    questionId: number;
    selectedIsPhish: boolean | null;
    isCorrect: boolean;
    timeTakenMs: number;
  }> = [];

  for (const q of questionPool) {
    const correct = Math.random() < skill;
    const timeTakenMs = Math.floor(rand(4000, 22000));
    const selectedIsPhish = correct ? q.isPhish : !q.isPhish;
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

  return { correctCount, totalTimeMs };
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

  // Pick ~90 random users to give pre+post pairs
  const targetCount = Math.min(90, allUsers.length);
  const selectedUsers = pickN(allUsers, targetCount);

  let pairs = 0;
  let skipped = 0;

  for (const user of selectedUsers) {
    const ageGroup = user.ageGroup as AgeGroup;
    const pool = byAge.get(ageGroup);
    if (!pool || pool.length === 0) {
      skipped++;
      continue;
    }

    // Skip if user already has a pre-test for any experiment
    const existingPre = await db
      .select({ id: tests.id })
      .from(tests)
      .where(and(eq(tests.userId, user.id), eq(tests.testType, "pre")))
      .limit(1);
    if (existingPre.length > 0) {
      skipped++;
      continue;
    }

    const totalQ = QUESTIONS_PER_AGE[ageGroup];
    const sample = pickN(pool, Math.min(totalQ, pool.length)).map((q) => ({
      id: q.id,
      isPhish: q.isPhish,
    }));

    const experimentId = randomUUID();

    // Pre-test: skill 0.40 → 0.75 (room to improve)
    const preSkill = rand(0.4, 0.75);
    // Post improvement: 0.10 → 0.25
    const improvement = rand(0.1, 0.25);
    const postSkill = Math.min(0.98, preSkill + improvement);

    const daysAgo = Math.floor(rand(7, 60));
    const preStarted = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    // Post 1–7 days after pre
    const postStarted = new Date(
      preStarted.getTime() + Math.floor(rand(1, 7)) * 24 * 60 * 60 * 1000,
    );

    await insertTest(user.id, ageGroup, "pre", experimentId, preStarted, sample, preSkill);
    // Post reuses same questions, shuffled
    await insertTest(
      user.id,
      ageGroup,
      "post",
      experimentId,
      postStarted,
      shuffle(sample),
      postSkill,
    );

    pairs++;
    if (pairs % 15 === 0) {
      console.log(`  ...${pairs} pre+post pairs created`);
    }
  }

  console.log(`\n✓ Created ${pairs} pre+post experiment pairs (${skipped} users skipped — already had pre-test)`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Restore failed:", err);
    process.exit(1);
  });
