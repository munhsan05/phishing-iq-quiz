/**
 * Shared type definitions for the Phishing IQ Quiz.
 * Re-exports DB schema row types plus UI-only types for the client.
 */

import type {
  User,
  NewUser,
  Question,
  NewQuestion,
  Test,
  NewTest,
  Answer,
  NewAnswer,
} from "@/db/schema";
import type { AgeGroup } from "./constants";

// Re-export DB row types so UI components only need one import.
export type {
  User,
  NewUser,
  Question,
  NewQuestion,
  Test,
  NewTest,
  Answer,
  NewAnswer,
};

// ============================================
// CONTENT SHAPES (per question type)
// ============================================

export type EmailContent = {
  from: string;
  subject: string;
  body: string;
  url?: string;
};

export type SmsContent = {
  sender: string;
  body: string;
  url?: string;
};

export type QrContent = {
  scenario: string;
  posterImagePath: string;
  qrUrl: string;
  contextDescription: string;
};

export type BrowserContent = {
  browserUrl: string;
  pageTitle: string;
  warningTriggered: boolean;
  redirectFrom?: string;
};

export type InboxItemContent = EmailContent;

// ============================================
// MODE + TYPE ENUMS
// ============================================

export type QuizMode = "leveled" | "mixed" | "category";
export type QuestionType = "email" | "sms" | "qr" | "browser" | "inbox_batch";

// ============================================
// CLIENT-ONLY DTOs
// ============================================

/**
 * Discriminated union of all question shapes safe to send to the client.
 * Excludes `isPhish`, `explanation`, and `recommendation` (revealed only
 * after the user submits an answer via submitAnswer).
 *
 * Note: `inbox_batch` has `id: string` (batch UUID); all other variants
 * have `id: number` (serial PK).
 */
export type ClientQuestion =
  | { id: number; type: "email"; content: EmailContent; ageGroup: string; orderIndex: number }
  | { id: number; type: "sms"; content: SmsContent; ageGroup: string; orderIndex: number }
  | { id: number; type: "qr"; content: QrContent; ageGroup: string; orderIndex: number }
  | { id: number; type: "browser"; content: BrowserContent; ageGroup: string; orderIndex: number }
  | {
      id: string;
      type: "inbox_batch";
      ageGroup: string;
      context?: string;
      timeLimitSec: number;
      orderIndex: number;
      items: Array<{ id: number; content: InboxItemContent; isPhish: boolean }>;
    };

/**
 * Discriminated union of answer inputs keyed by `kind`.
 */
export type AnswerInput =
  | { kind: "binary"; questionId: number; choice: "phish" | "legit"; timeTakenMs: number }
  | { kind: "browser"; questionId: number; choice: "back" | "proceed" | "report"; timeTakenMs: number }
  | { kind: "inbox"; batchId: string; selectedItemIds: number[]; timeTakenMs: number };

/**
 * A user's answer to a single question, held in local session state.
 * `selectedIsPhish` is null iff the user timed out.
 */
export type ClientAnswer = {
  questionId: number;
  selectedIsPhish: boolean | null;
  isCorrect: boolean;
  timeTakenMs: number;
};

/**
 * Feedback returned to the client after submitting an answer.
 * Contains the correct answer + explanation + recommendation,
 * which were withheld during play.
 */
export type AnswerFeedback = {
  isCorrect: boolean;
  correctIsPhish: boolean;
  explanation: string;
  recommendation: string;
};

// ============================================
// UI STATE MACHINE
// ============================================

/**
 * Flat quiz session shape used for multi-modal quiz runs.
 */
export type QuizSession = {
  testId: string;
  mode: QuizMode;
  categoryFilter?: QuestionType;
  questions: ClientQuestion[];
  currentIndex: number;
  startedAt: number;
};

// ============================================
// LEADERBOARD
// ============================================

export type LeaderboardRow = {
  testId: string;
  name: string;
  score: number;
  totalQuestions: number;
  totalTimeMs: number;
  ageGroup: AgeGroup;
  completedAt: Date | null;
};
