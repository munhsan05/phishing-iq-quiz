import { db, users, questions, tests, answers } from "./index";
import { eq, desc, asc, and, isNotNull, inArray, count, avg, sql, gte } from "drizzle-orm";
import type { NewUser, NewTest, NewAnswer } from "./schema";

// ============================================
// USER OPERATIONS
// ============================================

/**
 * Upsert a user. If `id` is provided and exists, update name + age_group.
 * If not provided or doesn't exist, insert new.
 */
export async function upsertUser(input: {
  id?: string;
  name: string;
  ageGroup: "6-18" | "18-35" | "35-60+";
}) {
  if (input.id) {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.id, input.id))
      .limit(1);

    if (existing.length > 0) {
      const updated = await db
        .update(users)
        .set({
          name: input.name,
          ageGroup: input.ageGroup,
          updatedAt: new Date(),
        })
        .where(eq(users.id, input.id))
        .returning();
      return updated[0];
    }
  }

  const inserted = await db
    .insert(users)
    .values({
      ...(input.id ? { id: input.id } : {}),
      name: input.name,
      ageGroup: input.ageGroup,
    } as NewUser)
    .returning();
  return inserted[0];
}

// ============================================
// QUESTION OPERATIONS
// ============================================

/** Get all email-type questions for an age group, ordered by order_index.
 *  The `type='email'` filter ensures only legacy email questions are picked up
 *  even when the shared DB also contains v2 multi-modal rows (sms/qr/browser/inbox_item). */
export async function getQuestionsByAgeGroup(
  ageGroup: "6-18" | "18-35" | "35-60+",
) {
  return db
    .select()
    .from(questions)
    .where(and(eq(questions.ageGroup, ageGroup), sql`type = 'email'`))
    .orderBy(asc(questions.orderIndex));
}

// ============================================
// TEST OPERATIONS
// ============================================

/** Create a new test record (started state). */
export async function createTest(input: {
  userId: string;
  testType?: "pre" | "post" | "practice";
  experimentId?: string;
  ageGroup: "6-18" | "18-35" | "35-60+";
  totalQuestions: number;
}) {
  const inserted = await db
    .insert(tests)
    .values({
      userId: input.userId,
      testType: input.testType ?? "practice",
      experimentId: input.experimentId,
      ageGroup: input.ageGroup,
      totalQuestions: input.totalQuestions,
    } as NewTest)
    .returning();
  return inserted[0];
}

// ============================================
// EXPERIMENT OPERATIONS
// ============================================

/** Get the pre-test for a given experiment. */
export async function getPreTestByExperiment(experimentId: string) {
  const rows = await db
    .select()
    .from(tests)
    .where(
      and(eq(tests.experimentId, experimentId), eq(tests.testType, "pre")),
    )
    .limit(1);
  return rows[0] ?? null;
}

/** Get the post-test for a given experiment (if exists). */
export async function getPostTestByExperiment(experimentId: string) {
  const rows = await db
    .select()
    .from(tests)
    .where(
      and(eq(tests.experimentId, experimentId), eq(tests.testType, "post")),
    )
    .limit(1);
  return rows[0] ?? null;
}

/** Get all answer question IDs for a test (for re-using same questions in post-test). */
export async function getAnswerQuestionIds(testId: string) {
  const rows = await db
    .select({ questionId: answers.questionId })
    .from(answers)
    .where(eq(answers.testId, testId));
  return rows.map((r) => r.questionId);
}

/** Fetch questions by an array of IDs. */
export async function getQuestionsByIds(ids: number[]) {
  if (ids.length === 0) return [];
  return db.select().from(questions).where(inArray(questions.id, ids));
}

/** Save a single answer. selectedIsPhish is null for timeouts. */
export async function saveAnswer(input: {
  testId: string;
  questionId: number;
  selectedIsPhish: boolean | null;
  isCorrect: boolean;
  timeTakenMs: number;
}) {
  const inserted = await db
    .insert(answers)
    .values(input as NewAnswer)
    .returning();
  return inserted[0];
}

/** Mark a test as completed and update the score + total time. */
export async function finishTest(input: {
  testId: string;
  score: number;
  totalTimeMs: number;
}) {
  const updated = await db
    .update(tests)
    .set({
      score: input.score,
      totalTimeMs: input.totalTimeMs,
      completedAt: new Date(),
    })
    .where(eq(tests.id, input.testId))
    .returning();
  return updated[0];
}

/** Get a single test with its user and answers (for result page). */
export async function getTestWithDetails(testId: string) {
  const test = await db
    .select({
      test: tests,
      user: users,
    })
    .from(tests)
    .innerJoin(users, eq(users.id, tests.userId))
    .where(eq(tests.id, testId))
    .limit(1);

  if (test.length === 0) return null;

  const testAnswers = await db
    .select({
      answer: answers,
      question: questions,
    })
    .from(answers)
    .innerJoin(questions, eq(questions.id, answers.questionId))
    .where(eq(answers.testId, testId))
    .orderBy(asc(answers.answeredAt));

  return {
    ...test[0],
    answers: testAnswers,
  };
}

// ============================================
// LEADERBOARD
// ============================================

/** Top N completed tests, ordered by score desc, time asc. */
export async function getLeaderboard(limit = 20) {
  return db
    .select({
      testId: tests.id,
      name: users.name,
      score: tests.score,
      totalQuestions: tests.totalQuestions,
      totalTimeMs: tests.totalTimeMs,
      ageGroup: tests.ageGroup,
      completedAt: tests.completedAt,
    })
    .from(tests)
    .innerJoin(users, eq(users.id, tests.userId))
    .where(isNotNull(tests.completedAt))
    .orderBy(desc(tests.score), asc(tests.totalTimeMs))
    .limit(limit);
}

// ============================================
// COMPARISON
// ============================================

/** Full experiment data for comparison page: both tests + all answers + questions. */
export async function getExperimentComparison(experimentId: string) {
  const experimentTests = await db
    .select({ test: tests, user: users })
    .from(tests)
    .innerJoin(users, eq(users.id, tests.userId))
    .where(eq(tests.experimentId, experimentId))
    .orderBy(asc(tests.startedAt));

  const preRow = experimentTests.find((r) => r.test.testType === "pre");
  const postRow = experimentTests.find((r) => r.test.testType === "post");

  if (!preRow || !postRow) return null;
  if (!preRow.test.completedAt || !postRow.test.completedAt) return null;

  const preAnswers = await db
    .select({ answer: answers, question: questions })
    .from(answers)
    .innerJoin(questions, eq(questions.id, answers.questionId))
    .where(eq(answers.testId, preRow.test.id))
    .orderBy(asc(questions.id));

  const postAnswers = await db
    .select({ answer: answers, question: questions })
    .from(answers)
    .innerJoin(questions, eq(questions.id, answers.questionId))
    .where(eq(answers.testId, postRow.test.id))
    .orderBy(asc(questions.id));

  return {
    user: preRow.user,
    preTest: preRow.test,
    postTest: postRow.test,
    preAnswers,
    postAnswers,
  };
}

// ============================================
// ANALYTICS
// ============================================

/** Overview stats: total users, tests, avg score, completion rate. */
export async function getOverviewStats() {
  const [userRow] = await db.select({ value: count() }).from(users);
  const [testRow] = await db
    .select({
      total: count(),
      completed: sql<number>`COUNT(${tests.completedAt})`,
      avgScorePct: sql<number>`COALESCE(AVG(
        CASE WHEN ${tests.completedAt} IS NOT NULL
          THEN ${tests.score}::float / NULLIF(${tests.totalQuestions}, 0) * 100
        END
      ), 0)`,
    })
    .from(tests);

  return {
    totalUsers: userRow.value,
    totalTests: testRow.total,
    completedTests: Number(testRow.completed),
    completionRate: testRow.total > 0
      ? (Number(testRow.completed) / testRow.total) * 100
      : 0,
    avgScorePercent: Number(testRow.avgScorePct),
  };
}

/** Daily test count + avg score for the last N days. */
export async function getTrendData(days: 7 | 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const rows = await db
    .select({
      date: sql<string>`TO_CHAR(${tests.startedAt}, 'YYYY-MM-DD')`,
      testCount: count(),
      avgScorePct: sql<number>`COALESCE(AVG(
        CASE WHEN ${tests.completedAt} IS NOT NULL
          THEN ${tests.score}::float / NULLIF(${tests.totalQuestions}, 0) * 100
        END
      ), 0)`,
    })
    .from(tests)
    .where(gte(tests.startedAt, since))
    .groupBy(sql`TO_CHAR(${tests.startedAt}, 'YYYY-MM-DD')`)
    .orderBy(sql`TO_CHAR(${tests.startedAt}, 'YYYY-MM-DD')`);

  return rows.map((r) => ({
    date: r.date,
    testCount: r.testCount,
    avgScorePct: Number(r.avgScorePct),
  }));
}

/** All completed experiment pairs for pre/post analysis. */
export async function getPrePostEffectiveness() {
  const rows = await db
    .select({
      experimentId: tests.experimentId,
      testType: tests.testType,
      score: tests.score,
      totalQuestions: tests.totalQuestions,
      userId: tests.userId,
    })
    .from(tests)
    .where(and(isNotNull(tests.experimentId), isNotNull(tests.completedAt)))
    .orderBy(tests.experimentId, tests.testType);

  const byExp = new Map<string, { pre?: (typeof rows)[0]; post?: (typeof rows)[0] }>();
  for (const row of rows) {
    if (!row.experimentId) continue;
    const entry = byExp.get(row.experimentId) ?? {};
    if (row.testType === "pre") entry.pre = row;
    if (row.testType === "post") entry.post = row;
    byExp.set(row.experimentId, entry);
  }

  return [...byExp.entries()]
    .filter(([, v]) => v.pre && v.post)
    .map(([experimentId, v]) => ({
      experimentId,
      preScore: v.pre!.score,
      postScore: v.post!.score,
      total: v.pre!.totalQuestions,
      prePct: v.pre!.totalQuestions > 0
        ? Math.round((v.pre!.score / v.pre!.totalQuestions) * 100)
        : 0,
      postPct: v.post!.totalQuestions > 0
        ? Math.round((v.post!.score / v.post!.totalQuestions) * 100)
        : 0,
    }));
}

/** Per-question accuracy, avg time, timeout count — sorted by difficulty (hardest first). */
export async function getQuestionAnalysis() {
  const rows = await db
    .select({
      questionId: answers.questionId,
      emailSubject: questions.emailSubject,
      category: questions.category,
      ageGroup: questions.ageGroup,
      isPhish: questions.isPhish,
      totalAnswers: count(),
      correctCount: sql<number>`COUNT(CASE WHEN ${answers.isCorrect} THEN 1 END)`,
      avgTimeMs: sql<number>`COALESCE(AVG(${answers.timeTakenMs}), 0)`,
      timeoutCount: sql<number>`COUNT(CASE WHEN ${answers.selectedIsPhish} IS NULL THEN 1 END)`,
    })
    .from(answers)
    .innerJoin(questions, eq(questions.id, answers.questionId))
    .groupBy(
      answers.questionId,
      questions.emailSubject,
      questions.category,
      questions.ageGroup,
      questions.isPhish,
    )
    .orderBy(
      sql`COUNT(CASE WHEN ${answers.isCorrect} THEN 1 END)::float / NULLIF(COUNT(*), 0)`,
    );

  return rows.map((r) => ({
    questionId: r.questionId,
    emailSubject: r.emailSubject,
    category: r.category,
    ageGroup: r.ageGroup,
    isPhish: r.isPhish,
    totalAnswers: r.totalAnswers,
    correctCount: Number(r.correctCount),
    correctRate:
      r.totalAnswers > 0 ? (Number(r.correctCount) / r.totalAnswers) * 100 : 0,
    avgTimeMs: Number(r.avgTimeMs),
    timeoutCount: Number(r.timeoutCount),
  }));
}

/** Aggregate behavioral metrics: timeouts, response time, completion rate. */
export async function getBehavioralData() {
  const [answerRow] = await db
    .select({
      totalAnswers: count(),
      timeoutCount: sql<number>`COUNT(CASE WHEN ${answers.selectedIsPhish} IS NULL THEN 1 END)`,
      avgTimeMs: sql<number>`COALESCE(AVG(${answers.timeTakenMs}), 0)`,
    })
    .from(answers);

  const [testRow] = await db
    .select({
      totalTests: count(),
      completedTests: sql<number>`COUNT(${tests.completedAt})`,
    })
    .from(tests);

  // Per-question avg response time for chart
  const perQuestion = await db
    .select({
      questionId: answers.questionId,
      emailSubject: questions.emailSubject,
      avgTimeMs: sql<number>`COALESCE(AVG(${answers.timeTakenMs}), 0)`,
      timeoutCount: sql<number>`COUNT(CASE WHEN ${answers.selectedIsPhish} IS NULL THEN 1 END)`,
      totalAnswers: count(),
    })
    .from(answers)
    .innerJoin(questions, eq(questions.id, answers.questionId))
    .groupBy(answers.questionId, questions.emailSubject)
    .orderBy(answers.questionId);

  return {
    totalAnswers: answerRow.totalAnswers,
    timeoutCount: Number(answerRow.timeoutCount),
    timeoutRate:
      answerRow.totalAnswers > 0
        ? (Number(answerRow.timeoutCount) / answerRow.totalAnswers) * 100
        : 0,
    avgResponseTimeMs: Number(answerRow.avgTimeMs),
    totalTests: testRow.totalTests,
    completedTests: Number(testRow.completedTests),
    completionRate:
      testRow.totalTests > 0
        ? (Number(testRow.completedTests) / testRow.totalTests) * 100
        : 0,
    perQuestion: perQuestion.map((r) => ({
      questionId: r.questionId,
      emailSubject: r.emailSubject,
      avgTimeMs: Number(r.avgTimeMs),
      timeoutCount: Number(r.timeoutCount),
      totalAnswers: r.totalAnswers,
    })),
  };
}

/** Per age-group stats + per-category accuracy for radar chart. */
export async function getAgeGroupBreakdown() {
  const summary = await db
    .select({
      ageGroup: tests.ageGroup,
      testCount: count(),
      completedCount: sql<number>`COUNT(${tests.completedAt})`,
      avgScorePct: sql<number>`COALESCE(AVG(
        CASE WHEN ${tests.completedAt} IS NOT NULL
          THEN ${tests.score}::float / NULLIF(${tests.totalQuestions}, 0) * 100
        END
      ), 0)`,
      avgTimeMs: sql<number>`COALESCE(AVG(
        CASE WHEN ${tests.completedAt} IS NOT NULL THEN ${tests.totalTimeMs} END
      ), 0)`,
    })
    .from(tests)
    .groupBy(tests.ageGroup);

  const categoryAccuracy = await db
    .select({
      ageGroup: questions.ageGroup,
      category: questions.category,
      totalAnswers: count(),
      correctCount: sql<number>`COUNT(CASE WHEN ${answers.isCorrect} THEN 1 END)`,
    })
    .from(answers)
    .innerJoin(questions, eq(questions.id, answers.questionId))
    .groupBy(questions.ageGroup, questions.category);

  return {
    summary: summary.map((r) => ({
      ageGroup: r.ageGroup,
      testCount: r.testCount,
      completedCount: Number(r.completedCount),
      avgScorePct: Number(r.avgScorePct),
      avgTimeMs: Number(r.avgTimeMs),
    })),
    categoryAccuracy: categoryAccuracy.map((r) => ({
      ageGroup: r.ageGroup,
      category: r.category,
      totalAnswers: r.totalAnswers,
      correctRate:
        r.totalAnswers > 0 ? (Number(r.correctCount) / r.totalAnswers) * 100 : 0,
    })),
  };
}
