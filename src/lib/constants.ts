/**
 * Application-wide constants for the Phishing IQ Quiz.
 * Age groups, per-question time limit, question counts, UI labels.
 */

import type { QuizMode, QuestionType } from "./types";

// ============================================
// AGE GROUPS
// ============================================

/** The three age groups the quiz supports. Order matters (UI display). */
export const AGE_GROUPS = ["6-18", "18-35", "35-60+"] as const;

/** Type alias for a valid age group identifier. */
export type AgeGroup = (typeof AGE_GROUPS)[number];

/**
 * Mongolian UI labels for each age group.
 * Ported from `index.html` (age-btn labels) — DO NOT reword.
 */
export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  "6-18": "6 – 18 нас",
  "18-35": "18 – 35 нас",
  "35-60+": "35 – 60+ нас",
};

/**
 * Secondary/descriptive labels shown under each age button.
 * Ported from `index.html` (`.age-label`): Өсвөр нас / Залуу нас / Насанд хүрэгчид.
 */
export const AGE_GROUP_SUBLABELS: Record<AgeGroup, string> = {
  "6-18": "Өсвөр нас",
  "18-35": "Залуу нас",
  "35-60+": "Насанд хүрэгчид",
};

/** Emoji icons for each age group (from legacy .age-icon). */
export const AGE_GROUP_ICONS: Record<AgeGroup, string> = {
  "6-18": "🧒",
  "18-35": "👨‍💻",
  "35-60+": "👔",
};

// ============================================
// QUIZ TIMING
// ============================================

/** Per-question time limit in seconds (legacy `QUESTION_TIME`). */
export const QUIZ_TIME_PER_QUESTION_SEC = 60;

// ============================================
// QUESTION COUNTS
// ============================================

/**
 * Number of questions per test for each age group.
 * Matches the current seed data in `src/db/seed.ts`:
 * 6-18 → 10, 18-35 → 15, 35-60+ → 16.
 */
export const QUESTIONS_PER_TEST_BY_AGE: Record<AgeGroup, number> = {
  "6-18": 10,
  "18-35": 15,
  "35-60+": 16,
};

// ============================================
// CANVAS BACKGROUND
// ============================================

/** Number of nodes in the canvas background animation. */
export const CANVAS_NODE_COUNT = 40;

/** Pixel distance threshold for drawing connecting lines between nodes. */
export const CANVAS_LINK_DISTANCE = 160;

// ============================================
// CLIENT STORAGE
// ============================================

/** localStorage key for the anonymous per-browser user UUID. */
export const USER_ID_STORAGE_KEY = "phishing-quiz-user-id";

// ============================================
// MULTI-MODAL — mode + type labels, icons, time limits
// ============================================

export const MODE_LABELS: Record<QuizMode, string> = {
  leveled: "Түвшнээр сурах",
  mixed: "Холимог сорил",
  category: "Төрлөөр сонгох",
};

export const MODE_DESCRIPTIONS: Record<QuizMode, string> = {
  leveled: "5 түвшин дараалан: Имэйл → SMS → QR → Browser → Inbox",
  mixed: "Бүх төрлийн phishing санамсаргүй холилдож гарна",
  category: "Сонирхсон нэг төрлөөрөө онцгойлон дасгалжина",
};

export const TYPE_LABELS: Record<QuestionType, string> = {
  email: "Имэйл",
  sms: "SMS",
  qr: "QR код",
  browser: "Вэб хуудас",
  inbox_batch: "Inbox цэвэрлэгээ",
};

export const TYPE_ICONS: Record<QuestionType, string> = {
  email: "📧",
  sms: "📱",
  qr: "📸",
  browser: "⚠️",
  inbox_batch: "📬",
};

export const TYPE_TIME_LIMITS_SEC: Record<QuestionType, number> = {
  email: 30,
  sms: 30,
  qr: 30,
  browser: 45,
  inbox_batch: 90,
};
