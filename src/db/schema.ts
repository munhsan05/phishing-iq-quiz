import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  serial,
  smallint,
  integer,
  text,
  boolean,
  timestamp,
  uniqueIndex,
  index,
  jsonb,
  numeric,
} from "drizzle-orm/pg-core";

// ============================================
// ENUMS
// ============================================
export const ageGroupEnum = pgEnum("age_group", ["6-18", "18-35", "35-60+"]);
export const testTypeEnum = pgEnum("test_type", ["pre", "post", "practice"]);
export const questionCategoryEnum = pgEnum("question_category", [
  "email_phishing",
  "sms_smishing",
  "voice_vishing",
  "url_spoofing",
  "social_eng",
  "credential_theft",
  "other",
]);

export const questionTypeEnum = pgEnum("question_type", [
  "email",
  "sms",
  "qr",
  "browser",
  "inbox_item",
]);

export const quizModeEnum = pgEnum("quiz_mode", [
  "leveled",
  "mixed",
  "category",
]);

// ============================================
// INBOX BATCHES
// ============================================
export const inboxBatches = pgTable("inbox_batches", {
  id: uuid("id").primaryKey().defaultRandom(),
  ageGroup: ageGroupEnum("age_group").notNull(),
  context: text("context"),
  timeLimitSec: smallint("time_limit_sec").default(90).notNull(),
  orderIndex: smallint("order_index").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ============================================
// USERS
// ============================================
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull(),
  ageGroup: ageGroupEnum("age_group").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ============================================
// QUESTIONS — email classification (phish vs legit)
// ============================================
// Each row represents a single email the user has to classify.
// The UI renders this as an email-card (sender, subject, URL bar, body)
// and asks a single binary question: is this phishing or legitimate?
export const questions = pgTable(
  "questions",
  {
    id: serial("id").primaryKey(),
    ageGroup: ageGroupEnum("age_group").notNull(),
    orderIndex: smallint("order_index").notNull(),
    category: questionCategoryEnum("category").notNull(),
    // NEW: modality type + polymorphic content
    type: questionTypeEnum("type").default("email").notNull(),
    content: jsonb("content").default({}).notNull(),
    batchId: uuid("batch_id").references(() => inboxBatches.id, { onDelete: "cascade" }),
    // Legacy email fields (retained for backward compat)
    emailFrom: varchar("email_from", { length: 200 }).notNull(),
    emailSubject: varchar("email_subject", { length: 300 }).notNull(),
    emailBody: text("email_body").notNull(),
    emailUrl: varchar("email_url", { length: 500 }),
    // Answer + education
    isPhish: boolean("is_phish").notNull(),
    explanation: text("explanation").notNull(),
    recommendation: text("recommendation").notNull(),
    difficulty: smallint("difficulty").default(3).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    ageOrderUnique: uniqueIndex("questions_age_order_unique").on(t.ageGroup, t.orderIndex),
    batchIdx: index("questions_batch_idx").on(t.batchId),
  }),
);

// ============================================
// TESTS
// ============================================
export const tests = pgTable(
  "tests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    testType: testTypeEnum("test_type").default("practice").notNull(),
    experimentId: uuid("experiment_id"),
    ageGroup: ageGroupEnum("age_group").notNull(),
    score: smallint("score").default(0).notNull(),
    totalQuestions: smallint("total_questions").notNull(),
    totalTimeMs: integer("total_time_ms").default(0).notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (t) => ({
    userIdx: index("tests_user_idx").on(t.userId),
    leaderboardIdx: index("tests_leaderboard_idx").on(t.score, t.totalTimeMs),
    experimentIdx: index("tests_experiment_idx").on(t.experimentId),
  }),
);

// ============================================
// ANSWERS
// ============================================
// selectedIsPhish is nullable: null = timed out, true/false = user picked.
export const answers = pgTable(
  "answers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    testId: uuid("test_id")
      .notNull()
      .references(() => tests.id, { onDelete: "cascade" }),
    questionId: integer("question_id").references(() => questions.id), // NOW nullable
    batchId: uuid("batch_id").references(() => inboxBatches.id),       // NEW
    selectedIsPhish: boolean("selected_is_phish"),
    inboxSelections: jsonb("inbox_selections"),                        // NEW
    // Range: 0.000–1.100 (F1 for inbox, 0/1 binary, 1.1 for browser report bonus).
    score: numeric("score", { precision: 4, scale: 3 }),
    isCorrect: boolean("is_correct").notNull(),
    timeTakenMs: integer("time_taken_ms").notNull(),
    answeredAt: timestamp("answered_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    testIdx: index("answers_test_idx").on(t.testId),
    questionIdx: index("answers_question_idx").on(t.questionId),
    batchIdx: index("answers_batch_idx").on(t.batchId),                // NEW
  }),
);

// ============================================
// TYPE EXPORTS
// ============================================
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;
export type Test = typeof tests.$inferSelect;
export type NewTest = typeof tests.$inferInsert;
export type Answer = typeof answers.$inferSelect;
export type NewAnswer = typeof answers.$inferInsert;
export type InboxBatch = typeof inboxBatches.$inferSelect;
export type NewInboxBatch = typeof inboxBatches.$inferInsert;
