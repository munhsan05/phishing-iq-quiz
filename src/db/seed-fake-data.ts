/**
 * Generate 150 realistic fake quiz attempts for analytics/thesis.
 *
 * Distribution:
 *   - 150 users with Mongolian names across 3 age groups
 *   - ~90 users do pre+post experiment (shows intervention improvement)
 *   - ~60 users do practice-only tests
 *   - Answers have realistic timing (3–25s), ~5% timeout rate
 *   - Skill levels vary: 30%–90% base accuracy
 *   - Post-test scores improve by 10–25% over pre-test (education effect)
 *   - Dates spread across the last 30 days
 *
 * Run: npx tsx src/db/seed-fake-data.ts
 */
import "dotenv/config";
import { db } from "./index";
import { users, questions, tests, answers } from "./schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

// ─── Mongolian names pool ──────────────────────────────────────
const FIRST_NAMES = [
  "Бат", "Болд", "Ганбат", "Дорж", "Эрдэнэ", "Тэмүүлэн", "Мөнх",
  "Отгон", "Сүхбат", "Түмэн", "Нарантуяа", "Сарантуяа", "Оюунчимэг",
  "Цэцэгмаа", "Алтанцэцэг", "Энхжаргал", "Батчимэг", "Дэлгэрмаа",
  "Хүрэлбаатар", "Ганзориг", "Батжаргал", "Мөнхбат", "Баярсайхан",
  "Түвшинбаяр", "Энхболд", "Очирбат", "Чулуунбат", "Даваасүрэн",
  "Пүрэвсүрэн", "Лхагвасүрэн", "Одгэрэл", "Цолмон", "Ариунаа",
  "Бямбажав", "Батзориг", "Ганболд", "Ууганбаяр", "Мягмарсүрэн",
  "Содномдорж", "Баттулга", "Ганбаяр", "Сайнбаяр", "Тулга",
  "Номин", "Солонго", "Хулан", "Анужин", "Мишээл", "Сэлэнгэ",
  "Нандин", "Оюунтуяа", "Цэндмаа", "Дулмаа", "Должин", "Энхзул",
  "Болормаа", "Мөнхзул", "Хонгорзул", "Гэрэлмаа", "Жаргалмаа",
];

const LAST_INITIALS = [
  "Б", "Г", "Д", "Э", "Т", "М", "О", "С", "Н", "А", "Х", "Ц",
  "Л", "П", "Ж", "Р", "Ч", "У", "Я", "В",
];

type AgeGroup = "6-18" | "18-35" | "35-60+";

// ─── Helpers ───────────────────────────────────────────────────

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Random date within the last `days` days. */
function randomDate(days: number): Date {
  const now = Date.now();
  const offset = Math.random() * days * 24 * 60 * 60 * 1000;
  return new Date(now - offset);
}

/** Normal-ish distribution via Box-Muller, clamped to [min, max]. */
function normalRand(mean: number, stddev: number, min: number, max: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return Math.max(min, Math.min(max, mean + z * stddev));
}

function generateName(): string {
  const first = pick(FIRST_NAMES);
  const lastInit = pick(LAST_INITIALS);
  return `${lastInit}.${first}`;
}

// ─── Main ──────────────────────────────────────────────────────

async function main() {
  console.log("🎲 Fetching existing questions...");

  const allQuestions = await db.select().from(questions);
  const questionsByAge: Record<AgeGroup, typeof allQuestions> = {
    "6-18": allQuestions.filter((q) => q.ageGroup === "6-18"),
    "18-35": allQuestions.filter((q) => q.ageGroup === "18-35"),
    "35-60+": allQuestions.filter((q) => q.ageGroup === "35-60+"),
  };

  console.log(
    `  Questions: 6-18=${questionsByAge["6-18"].length}, ` +
    `18-35=${questionsByAge["18-35"].length}, ` +
    `35-60+=${questionsByAge["35-60+"].length}`
  );

  // ── Distribution: 150 users ──
  const USER_COUNT = 150;
  const AGE_DISTRIBUTION: { group: AgeGroup; count: number }[] = [
    { group: "6-18", count: 35 },
    { group: "18-35", count: 70 },
    { group: "35-60+", count: 45 },
  ];

  let totalUsersCreated = 0;
  let totalTestsCreated = 0;
  let totalAnswersCreated = 0;

  for (const { group, count } of AGE_DISTRIBUTION) {
    const qs = questionsByAge[group];
    if (qs.length === 0) {
      console.log(`  ⚠️ No questions for ${group}, skipping`);
      continue;
    }

    console.log(`\n📋 Age group ${group}: generating ${count} users...`);

    for (let i = 0; i < count; i++) {
      const userId = randomUUID();
      const userName = generateName();
      const userDate = randomDate(30);

      // Insert user
      await db.insert(users).values({
        id: userId,
        name: userName,
        ageGroup: group,
        createdAt: userDate,
        updatedAt: userDate,
      });
      totalUsersCreated++;

      // Base skill level for this user (0.3 to 0.85)
      const baseSkill = normalRand(0.55, 0.15, 0.25, 0.85);

      // 60% of users do pre+post experiment, 40% practice only
      const doExperiment = Math.random() < 0.6;

      if (doExperiment) {
        const experimentId = randomUUID();
        const preDate = new Date(userDate.getTime());
        // Post-test is 5-60 minutes after pre-test
        const postDate = new Date(preDate.getTime() + randInt(5, 60) * 60 * 1000);

        // Pre-test: base skill level
        const preResult = await createTestWithAnswers({
          userId,
          ageGroup: group,
          testType: "pre",
          experimentId,
          questions: qs,
          skillLevel: baseSkill,
          startDate: preDate,
        });
        totalTestsCreated++;
        totalAnswersCreated += preResult.answerCount;

        // Post-test: improved skill (+10% to +25%)
        const improvement = normalRand(0.17, 0.05, 0.08, 0.30);
        const postSkill = Math.min(0.95, baseSkill + improvement);

        const postResult = await createTestWithAnswers({
          userId,
          ageGroup: group,
          testType: "post",
          experimentId,
          questions: qs,
          skillLevel: postSkill,
          startDate: postDate,
        });
        totalTestsCreated++;
        totalAnswersCreated += postResult.answerCount;
      } else {
        // Practice test
        const practiceResult = await createTestWithAnswers({
          userId,
          ageGroup: group,
          testType: "practice",
          questions: qs,
          skillLevel: baseSkill,
          startDate: userDate,
        });
        totalTestsCreated++;
        totalAnswersCreated += practiceResult.answerCount;
      }

      // Progress indicator every 10 users
      if ((i + 1) % 10 === 0) {
        console.log(`  ✓ ${i + 1}/${count} users`);
      }
    }
  }

  console.log(`\n✅ Seed complete!`);
  console.log(`   Users:   ${totalUsersCreated}`);
  console.log(`   Tests:   ${totalTestsCreated}`);
  console.log(`   Answers: ${totalAnswersCreated}`);
}

// ─── Create a single test with all answers ─────────────────────

async function createTestWithAnswers(opts: {
  userId: string;
  ageGroup: AgeGroup;
  testType: "pre" | "post" | "practice";
  experimentId?: string;
  questions: (typeof questions.$inferSelect)[];
  skillLevel: number; // 0.0 – 1.0
  startDate: Date;
}): Promise<{ testId: string; score: number; answerCount: number }> {
  const { userId, ageGroup, testType, experimentId, skillLevel, startDate } = opts;
  const qs = [...opts.questions]; // copy to shuffle
  // Fisher-Yates shuffle
  for (let i = qs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [qs[i], qs[j]] = [qs[j], qs[i]];
  }

  const testId = randomUUID();

  // Insert test (started state)
  await db.insert(tests).values({
    id: testId,
    userId,
    testType,
    experimentId: experimentId ?? null,
    ageGroup,
    totalQuestions: qs.length,
    score: 0,
    totalTimeMs: 0,
    startedAt: startDate,
  });

  let score = 0;
  let totalTimeMs = 0;
  let answerTime = new Date(startDate.getTime());

  for (const q of qs) {
    // ~5% chance of timeout (selectedIsPhish = null)
    const isTimeout = Math.random() < 0.05;

    let selectedIsPhish: boolean | null = null;
    let isCorrect = false;
    let timeTakenMs: number;

    if (isTimeout) {
      // Timeout: full 30 seconds
      timeTakenMs = 30000;
      isCorrect = false;
    } else {
      // Difficulty affects accuracy: harder questions (difficulty 4-5) reduce skill
      const difficultyPenalty = (q.difficulty - 3) * 0.08;
      const effectiveSkill = Math.max(0.15, skillLevel - difficultyPenalty);

      // Decide if answer is correct based on effective skill
      isCorrect = Math.random() < effectiveSkill;

      if (isCorrect) {
        selectedIsPhish = q.isPhish;
      } else {
        selectedIsPhish = !q.isPhish;
      }

      // Response time: correct answers tend to be faster
      // Range: 3–25 seconds, phishing emails take slightly longer
      const baseTime = isCorrect
        ? normalRand(8000, 4000, 2500, 22000)
        : normalRand(12000, 5000, 3000, 28000);
      timeTakenMs = Math.round(baseTime);
    }

    if (isCorrect) score++;
    totalTimeMs += timeTakenMs;
    answerTime = new Date(answerTime.getTime() + timeTakenMs + randInt(500, 2000));

    await db.insert(answers).values({
      id: randomUUID(),
      testId,
      questionId: q.id,
      selectedIsPhish,
      isCorrect,
      timeTakenMs,
      answeredAt: answerTime,
    });
  }

  // Mark test as completed
  await db.update(tests).set({
    score,
    totalTimeMs,
    completedAt: answerTime,
  }).where(eq(tests.id, testId));

  return { testId, score, answerCount: qs.length };
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
