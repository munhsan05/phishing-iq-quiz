"use server";

/**
 * Server Actions for the Phishing IQ Quiz (multi-modal).
 *
 * Flow:
 *  - First test: mode-selector → startQuiz({mode}) → testType='pre' + new experimentId
 *  - Post-test: home → startQuiz({experimentId}) → testType='post' + reuse pre-test pool
 *  - Practice: future: startQuiz({mode, testType:'practice'}) → no experimentId
 */

import { eq, asc } from "drizzle-orm";
import { db } from "@/db";
import { tests, answers, questions, inboxBatches } from "@/db/schema";
import {
  upsertUser,
  getQuestionsForLeveledMode,
  getQuestionsForMixedMode,
  getQuestionsForCategoryMode,
  getPreTestByExperiment,
  getPostTestByExperiment,
  toClientQuestion,
  buildInboxBatchClientQuestion,
} from "@/db/queries";
import { scoreQuestion } from "@/lib/scoring";
import type { AgeGroup } from "@/lib/constants";
import { AGE_GROUPS } from "@/lib/constants";
import type {
  AnswerInput,
  QuizMode,
  QuestionType,
  ClientQuestion,
} from "@/lib/types";

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

export async function upsertUserAction(input: {
  userId: string;
  name: string;
  ageGroup: AgeGroup;
}): Promise<{ id: string }> {
  assertUuid(input.userId);
  assertName(input.name);
  assertAgeGroup(input.ageGroup);
  const user = await upsertUser({
    id: input.userId,
    name: input.name.trim(),
    ageGroup: input.ageGroup,
  });
  if (!user) throw new Error("UPSERT_USER_FAILED");
  return { id: user.id };
}

/** Fetch the exact question pool used by a previous test (for post-test reuse). */
async function fetchTestQuestionPool(testId: string): Promise<ClientQuestion[]> {
  const ans = await db
    .select()
    .from(answers)
    .where(eq(answers.testId, testId))
    .orderBy(asc(answers.answeredAt));

  const out: ClientQuestion[] = [];
  const seenBatches = new Set<string>();
  for (const a of ans) {
    if (a.questionId !== null) {
      const [q] = await db
        .select()
        .from(questions)
        .where(eq(questions.id, a.questionId));
      if (q) {
        const cq = toClientQuestion(q);
        if (cq) out.push(cq);
      }
    } else if (a.batchId !== null && !seenBatches.has(a.batchId)) {
      seenBatches.add(a.batchId);
      const [b] = await db
        .select()
        .from(inboxBatches)
        .where(eq(inboxBatches.id, a.batchId));
      if (b) {
        const items = await db
          .select()
          .from(questions)
          .where(eq(questions.batchId, b.id))
          .orderBy(asc(questions.orderIndex));
        out.push(buildInboxBatchClientQuestion(b, items));
      }
    }
  }
  return out;
}

export async function startQuiz(input: {
  userId: string;
  ageGroup: AgeGroup;
  mode?: QuizMode;
  category?: QuestionType;
  experimentId?: string;
  testType?: "pre" | "post" | "practice";
}): Promise<{
  testId: string;
  experimentId: string;
  questions: ClientQuestion[];
}> {
  assertUuid(input.userId);
  assertAgeGroup(input.ageGroup);

  // POST-TEST branch — reuse pre-test pool
  if (input.experimentId) {
    assertUuid(input.experimentId);
    const preTest = await getPreTestByExperiment(input.experimentId);
    if (!preTest) throw new Error("PRE_TEST_NOT_FOUND");
    if (!preTest.completedAt) throw new Error("PRE_TEST_NOT_COMPLETED");
    const existingPost = await getPostTestByExperiment(input.experimentId);
    if (existingPost) throw new Error("POST_TEST_ALREADY_EXISTS");

    const pool = await fetchTestQuestionPool(preTest.id);
    if (pool.length === 0) throw new Error("NO_PRE_TEST_QUESTIONS");
    const shuffled = cryptoShuffle(pool);

    const [test] = await db
      .insert(tests)
      .values({
        userId: input.userId,
        ageGroup: input.ageGroup,
        testType: "post",
        experimentId: input.experimentId,
        totalQuestions: shuffled.length,
      })
      .returning();

    return {
      testId: test.id,
      experimentId: input.experimentId,
      questions: shuffled,
    };
  }

  // PRE-TEST branch — mode-aware question selection
  if (!input.mode) throw new Error("MODE_REQUIRED");
  let qs: ClientQuestion[];
  if (input.mode === "leveled") {
    qs = await getQuestionsForLeveledMode(input.ageGroup);
  } else if (input.mode === "mixed") {
    qs = await getQuestionsForMixedMode(input.ageGroup);
  } else {
    if (!input.category) throw new Error("CATEGORY_REQUIRED");
    qs = await getQuestionsForCategoryMode(input.ageGroup, input.category);
  }

  if (qs.length === 0) throw new Error("NO_QUESTIONS_FOR_SELECTION");

  const experimentId = crypto.randomUUID();
  const [test] = await db
    .insert(tests)
    .values({
      userId: input.userId,
      ageGroup: input.ageGroup,
      testType: input.testType ?? "pre",
      experimentId,
      totalQuestions: qs.length,
    })
    .returning();

  return { testId: test.id, experimentId, questions: qs };
}

export async function submitAnswer(
  testId: string,
  input: AnswerInput,
): Promise<void> {
  assertUuid(testId);

  if (input.kind === "inbox") {
    const items = await db
      .select()
      .from(questions)
      .where(eq(questions.batchId, input.batchId));
    const phishIds = items.filter((i) => i.isPhish).map((i) => i.id);
    const score = scoreQuestion({
      type: "inbox_batch",
      phishIds,
      selectedIds: input.selectedItemIds,
    });
    await db.insert(answers).values({
      testId,
      batchId: input.batchId,
      questionId: null,
      selectedIsPhish: null,
      inboxSelections: input.selectedItemIds,
      score: score.toFixed(3),
      isCorrect: score >= 0.5,
      timeTakenMs: Math.round(input.timeTakenMs),
    });
    return;
  }

  const [q] = await db
    .select()
    .from(questions)
    .where(eq(questions.id, input.questionId));
  if (!q) throw new Error("QUESTION_NOT_FOUND");

  const score =
    input.kind === "browser"
      ? scoreQuestion({
          type: "browser",
          isPhish: q.isPhish,
          choice: input.choice,
        })
      : scoreQuestion({
          type: q.type as "email" | "sms" | "qr",
          isPhish: q.isPhish,
          choice: input.choice,
        });

  await db.insert(answers).values({
    testId,
    questionId: input.questionId,
    selectedIsPhish:
      input.kind === "binary"
        ? input.choice === "phish"
        : input.choice !== "proceed",
    score: score.toFixed(3),
    isCorrect: score >= 1,
    timeTakenMs: Math.round(input.timeTakenMs),
  });
}

export async function finishQuiz(testId: string): Promise<void> {
  assertUuid(testId);
  const rows = await db.select().from(answers).where(eq(answers.testId, testId));
  const totalScore = rows.reduce((sum, a) => sum + Number(a.score ?? 0), 0);
  const totalMs = rows.reduce((sum, a) => sum + (a.timeTakenMs ?? 0), 0);
  const [test] = await db.select().from(tests).where(eq(tests.id, testId));
  if (!test) return;
  const maxPossible = test.totalQuestions * 1.1;
  const pct = Math.round((totalScore / maxPossible) * 100);
  await db
    .update(tests)
    .set({
      score: Math.min(pct, 100),
      totalTimeMs: totalMs,
      completedAt: new Date(),
    })
    .where(eq(tests.id, testId));
}
