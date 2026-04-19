import { db } from "@/db";
import { sql } from "drizzle-orm";

export type AccuracyByTypeRow = {
  type: string;
  total_answers: number;
  correct: number;
  avg_time_ms: number;
  avg_score: number;
};

export type InboxF1StatsRow = {
  total_batches: number;
  avg_f1: number;
  avg_time_ms: number;
};

export type MissByAgeGroupRow = {
  age_group: string;
  type: string;
  miss_rate: number;
};

export async function getAccuracyByType(): Promise<AccuracyByTypeRow[]> {
  const result = await db.execute(sql`
    SELECT
      q.type::text AS type,
      COUNT(a.id)::int AS total_answers,
      SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END)::int AS correct,
      COALESCE(AVG(a.time_taken_ms), 0)::float AS avg_time_ms,
      COALESCE(AVG(COALESCE(a.score::numeric, CASE WHEN a.is_correct THEN 1 ELSE 0 END)), 0)::float AS avg_score
    FROM answers a
    JOIN questions q ON q.id = a.question_id
    GROUP BY q.type
    ORDER BY q.type
  `);
  return result.rows as unknown as AccuracyByTypeRow[];
}

export async function getInboxF1Stats(): Promise<InboxF1StatsRow> {
  const result = await db.execute(sql`
    SELECT
      COUNT(*)::int AS total_batches,
      COALESCE(AVG(a.score::numeric), 0)::float AS avg_f1,
      COALESCE(AVG(a.time_taken_ms), 0)::float AS avg_time_ms
    FROM answers a
    WHERE a.batch_id IS NOT NULL
  `);
  return (result.rows[0] as unknown as InboxF1StatsRow) ?? {
    total_batches: 0,
    avg_f1: 0,
    avg_time_ms: 0,
  };
}

export async function getMostMissedTypeByAgeGroup(): Promise<MissByAgeGroupRow[]> {
  const result = await db.execute(sql`
    SELECT
      t.age_group::text AS age_group,
      q.type::text AS type,
      (SUM(CASE WHEN NOT a.is_correct THEN 1 ELSE 0 END)::float / NULLIF(COUNT(a.id), 0))::float AS miss_rate
    FROM answers a
    JOIN questions q ON q.id = a.question_id
    JOIN tests t ON t.id = a.test_id
    GROUP BY t.age_group, q.type
    ORDER BY t.age_group, miss_rate DESC
  `);
  return result.rows as unknown as MissByAgeGroupRow[];
}
