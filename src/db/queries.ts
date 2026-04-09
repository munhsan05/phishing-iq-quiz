import { db, users, questions, tests, answers } from "./index";
import { eq, desc, asc, and, isNotNull } from "drizzle-orm";
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

/** Get all questions for an age group, ordered by order_index. */
export async function getQuestionsByAgeGroup(
  ageGroup: "6-18" | "18-35" | "35-60+",
) {
  return db
    .select()
    .from(questions)
    .where(eq(questions.ageGroup, ageGroup))
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
      totalTimeMs: tests.totalTimeMs,
      ageGroup: tests.ageGroup,
      completedAt: tests.completedAt,
    })
    .from(tests)
    .innerJoin(users, eq(users.id, tests.userId))
    .where(and(isNotNull(tests.completedAt), eq(tests.testType, "practice")))
    .orderBy(desc(tests.score), asc(tests.totalTimeMs))
    .limit(limit);
}
