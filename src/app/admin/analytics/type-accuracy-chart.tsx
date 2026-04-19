"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { TYPE_LABELS } from "@/lib/constants";
import type { QuestionType } from "@/lib/types";
import type { AccuracyByTypeRow } from "./queries-by-type";

type ChartDatum = {
  type: string;
  label: string;
  accuracy: number;
  avgScore: number;
};

export function TypeAccuracyChart({ data }: { data: AccuracyByTypeRow[] }) {
  const rows: ChartDatum[] = data.map((r) => ({
    type: r.type,
    label: TYPE_LABELS[r.type as QuestionType] ?? r.type,
    accuracy:
      r.total_answers > 0
        ? (Number(r.correct) / Number(r.total_answers)) * 100
        : 0,
    avgScore: Number(r.avg_score) * 100,
  }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={rows}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
        <XAxis dataKey="label" stroke="currentColor" />
        <YAxis domain={[0, 100]} stroke="currentColor" />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-navy-2)",
            border: "1px solid var(--color-border-1)",
          }}
          formatter={(value) => `${Number(value).toFixed(1)}%`}
        />
        <Bar dataKey="accuracy" fill="#60a5fa" name="Нарийвчлал" />
      </BarChart>
    </ResponsiveContainer>
  );
}
