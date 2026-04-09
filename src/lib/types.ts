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
// CLIENT-ONLY DTOs
// ============================================

/**
 * The subset of a question safe to send to the client during quiz play.
 * Notably excludes `isPhish`, `explanation`, and `recommendation`
 * (those are revealed only after the user submits an answer).
 */
export type ClientQuestion = Pick<
  Question,
  | "id"
  | "ageGroup"
  | "orderIndex"
  | "category"
  | "emailFrom"
  | "emailSubject"
  | "emailBody"
  | "emailUrl"
  | "difficulty"
>;

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
 * Finite state for the quiz session on the client.
 * Drives the QuizRunner component.
 */
export type QuizSession =
  | { phase: "idle" }
  | { phase: "loading" }
  | {
      phase: "running";
      testId: string;
      ageGroup: AgeGroup;
      currentIndex: number;
      questions: ClientQuestion[];
      answers: ClientAnswer[];
      startedAt: number;
    }
  | {
      phase: "finished";
      testId: string;
      ageGroup: AgeGroup;
      score: number;
      totalQuestions: number;
      totalTimeMs: number;
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
