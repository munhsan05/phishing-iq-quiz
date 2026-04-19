"use server";

/**
 * Server Actions for the Phishing IQ Quiz (multi-modal).
 *
 * - `upsertUserAction` — creates/updates user, returns id (called by home page)
 * - `startQuiz` — mode-aware question selection, creates test, returns ClientQuestion[]
 * - `submitAnswer` — polymorphic dispatch via AnswerInput, scores via lib/scoring
 * - `finishQuiz` — sums answer scores, normalises to 0-100, stamps completedAt
 */

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { tests, answers, questions } from "@/db/schema";
import {
  upsertUser,
  getQuestionsForLeveledMode,
  getQuestionsForMixedMode,
  getQuestionsForCategoryMode,
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

export async function startQuiz(input: {
  userId: string;
  ageGroup: AgeGroup;
  mode: QuizMode;
  category?: QuestionType;
  experimentId?: string;
  testType?: "pre" | "post" | "practice";
}): Promise<{ testId: string; questions: ClientQuestion[] }> {
  assertUuid(input.userId);
  assertAgeGroup(input.ageGroup);

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

  const [test] = await db
    .insert(tests)
    .values({
      userId: input.userId,
      ageGroup: input.ageGroup,
      testType: input.testType ?? "practice",
      experimentId: input.experimentId ?? null,
      totalQuestions: qs.length,
    })
    .returning();

  return { testId: test.id, questions: qs };
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
  // Approximate max possible: each question ≤ 1.0, browser bonus +0.1, inbox ≤ 1.0
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
