"use server";

/**
 * Server Actions for the Phishing IQ Quiz.
 *
 * These run exclusively on the Node.js runtime (Next.js 16 default) and have
 * direct access to the Neon Drizzle client. The client only ever receives
 * `ClientQuestion` payloads — `isPhish`, `explanation`, and `recommendation`
 * are stripped before leaving the server.
 */

import { eq } from "drizzle-orm";
import { db, questions } from "@/db";
import {
  upsertUser,
  getQuestionsByAgeGroup,
  getQuestionsByIds,
  getPreTestByExperiment,
  getPostTestByExperiment,
  getAnswerQuestionIds,
  createTest,
  saveAnswer,
  finishTest,
} from "@/db/queries";
import type { AgeGroup } from "@/lib/constants";
import {
  AGE_GROUPS,
  QUESTIONS_PER_TEST_BY_AGE,
} from "@/lib/constants";
import type { ClientQuestion, AnswerFeedback } from "@/lib/types";

// ============================================
// Input guards
// ============================================

function assertAgeGroup(value: unknown): asserts value is AgeGroup {
  if (
    typeof value !== "string" ||
    !(AGE_GROUPS as readonly string[]).includes(value)
  ) {
    throw new Error("INVALID_AGE_GROUP");
  }
}

function assertName(value: unknown): asserts value is string {
  if (
    typeof value !== "string" ||
    value.trim().length === 0 ||
    value.trim().length > 50
  ) {
    throw new Error("INVALID_NAME");
  }
}

function assertUuid(value: unknown): asserts value is string {
  if (typeof value !== "string" || value.length < 8) {
    throw new Error("INVALID_UUID");
  }
}

function assertPositiveInt(value: unknown): asserts value is number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new Error("INVALID_NUMBER");
  }
}

// ============================================
// Fisher–Yates shuffle using crypto randomness
// ============================================

/**
 * Unbiased Fisher–Yates shuffle driven by `crypto.getRandomValues`.
 * Returns a new array (input is not mutated).
 */
function cryptoShuffle<T>(arr: readonly T[]): T[] {
  const out = arr.slice();
  const n = out.length;
  if (n <= 1) return out;
  const rand = new Uint32Array(n);
  crypto.getRandomValues(rand);
  for (let i = n - 1; i > 0; i--) {
    const j = rand[i] % (i + 1);
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}

// ============================================
// Strip server-only fields before returning to client
// ============================================

function toClientQuestion(q: {
  id: number;
  ageGroup: AgeGroup;
  orderIndex: number;
  category:
    | "email_phishing"
    | "sms_smishing"
    | "voice_vishing"
    | "url_spoofing"
    | "social_eng"
    | "credential_theft"
    | "other";
  emailFrom: string;
  emailSubject: string;
  emailBody: string;
  emailUrl: string | null;
  difficulty: number;
}): ClientQuestion {
  return {
    id: q.id,
    ageGroup: q.ageGroup,
    orderIndex: q.orderIndex,
    category: q.category,
    emailFrom: q.emailFrom,
    emailSubject: q.emailSubject,
    emailBody: q.emailBody,
    emailUrl: q.emailUrl,
    difficulty: q.difficulty,
  };
}

// ============================================
// Actions
// ============================================

/**
 * Start a new quiz.
 *
 * Without `experimentId` → creates a **pre-test** with a new experiment.
 * With `experimentId`    → creates a **post-test** using the same questions
 *                          as the pre-test, re-shuffled.
 */
export async function startQuiz(input: {
  userId: string;
  name: string;
  ageGroup: AgeGroup;
  experimentId?: string;
}): Promise<{
  testId: string;
  experimentId: string;
  questions: ClientQuestion[];
}> {
  assertUuid(input.userId);
  assertName(input.name);
  assertAgeGroup(input.ageGroup);

  const user = await upsertUser({
    id: input.userId,
    name: input.name.trim(),
    ageGroup: input.ageGroup,
  });
  if (!user) throw new Error("UPSERT_USER_FAILED");

  // ── POST-TEST ──
  if (input.experimentId) {
    assertUuid(input.experimentId);

    const preTest = await getPreTestByExperiment(input.experimentId);
    if (!preTest) throw new Error("PRE_TEST_NOT_FOUND");
    if (!preTest.completedAt) throw new Error("PRE_TEST_NOT_COMPLETED");

    const existingPost = await getPostTestByExperiment(input.experimentId);
    if (existingPost) throw new Error("POST_TEST_ALREADY_EXISTS");

    // Same questions, re-shuffled
    const questionIds = await getAnswerQuestionIds(preTest.id);
    if (questionIds.length === 0) throw new Error("NO_PRE_TEST_ANSWERS");
    const pool = await getQuestionsByIds(questionIds);
    const shuffled = cryptoShuffle(pool);

    const test = await createTest({
      userId: user.id,
      testType: "post",
      experimentId: input.experimentId,
      ageGroup: input.ageGroup,
      totalQuestions: shuffled.length,
    });
    if (!test) throw new Error("CREATE_TEST_FAILED");

    return {
      testId: test.id,
      experimentId: input.experimentId,
      questions: shuffled.map(toClientQuestion),
    };
  }

  // ── PRE-TEST ──
  const pool = await getQuestionsByAgeGroup(input.ageGroup);
  if (pool.length === 0) throw new Error("NO_QUESTIONS_FOR_AGE_GROUP");

  const desired = QUESTIONS_PER_TEST_BY_AGE[input.ageGroup];
  const shuffled = cryptoShuffle(pool);
  const sliced = shuffled.slice(0, Math.min(desired, shuffled.length));

  const experimentId = crypto.randomUUID();

  const test = await createTest({
    userId: user.id,
    testType: "pre",
    experimentId,
    ageGroup: input.ageGroup,
    totalQuestions: sliced.length,
  });
  if (!test) throw new Error("CREATE_TEST_FAILED");

  return {
    testId: test.id,
    experimentId,
    questions: sliced.map(toClientQuestion),
  };
}

/**
 * Submit a single answer. The correct answer and the explanation live
 * exclusively on the server — they are fetched here, compared against
 * `selectedIsPhish`, then surfaced to the client only as feedback.
 *
 * `selectedIsPhish` is `null` when the question timed out.
 */
export async function submitAnswer(input: {
  testId: string;
  questionId: number;
  selectedIsPhish: boolean | null;
  timeTakenMs: number;
}): Promise<AnswerFeedback> {
  assertUuid(input.testId);
  if (!Number.isInteger(input.questionId) || input.questionId <= 0) {
    throw new Error("INVALID_QUESTION_ID");
  }
  if (
    input.selectedIsPhish !== null &&
    typeof input.selectedIsPhish !== "boolean"
  ) {
    throw new Error("INVALID_SELECTION");
  }
  assertPositiveInt(input.timeTakenMs);

  const rows = await db
    .select()
    .from(questions)
    .where(eq(questions.id, input.questionId))
    .limit(1);
  const question = rows[0];
  if (!question) throw new Error("QUESTION_NOT_FOUND");

  const isCorrect =
    input.selectedIsPhish !== null &&
    input.selectedIsPhish === question.isPhish;

  await saveAnswer({
    testId: input.testId,
    questionId: input.questionId,
    selectedIsPhish: input.selectedIsPhish,
    isCorrect,
    timeTakenMs: Math.round(input.timeTakenMs),
  });

  return {
    isCorrect,
    correctIsPhish: question.isPhish,
    explanation: question.explanation,
    recommendation: question.recommendation,
  };
}

/**
 * Finalise a test. Updates score + total time and stamps `completedAt`.
 */
export async function finishQuiz(input: {
  testId: string;
  score: number;
  totalTimeMs: number;
}): Promise<{ ok: true }> {
  assertUuid(input.testId);
  assertPositiveInt(input.score);
  assertPositiveInt(input.totalTimeMs);

  const test = await finishTest({
    testId: input.testId,
    score: Math.round(input.score),
    totalTimeMs: Math.round(input.totalTimeMs),
  });
  if (!test) throw new Error("FINISH_TEST_FAILED");

  return { ok: true };
}
