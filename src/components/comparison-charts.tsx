"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

// ============================================
// Types
// ============================================

export type ScoreComparisonData = {
  label: string;
  pre: number;
  post: number;
};

export type CategoryData = {
  category: string;
  pre: number;
  post: number;
};

export type TimeComparisonData = {
  question: string;
  pre: number;
  post: number;
};

// ============================================
// Score Bar Chart
// ============================================

export function ScoreBarChart({ data }: { data: ScoreComparisonData[] }) {
  return (
    <div className="rounded-xl border border-[var(--color-border-1)] bg-[var(--color-navy-2)] p-5">
      <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        // ОНОО ХАРЬЦУУЛАЛТ
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} layout="vertical" barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis type="number" domain={[0, 100]} tick={{ fill: "#9ca3af", fontSize: 12 }} unit="%" />
          <YAxis type="category" dataKey="label" tick={{ fill: "#9ca3af", fontSize: 12 }} width={120} />
          <Tooltip
            contentStyle={{ backgroundColor: "#1a1f36", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
            labelStyle={{ color: "#fff" }}
          />
          <Legend />
          <Bar dataKey="pre" name="Pre-test" fill="#f87171" radius={[0, 4, 4, 0]} />
          <Bar dataKey="post" name="Post-test" fill="#34d399" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ============================================
// Category Radar Chart
// ============================================

const CATEGORY_LABELS: Record<string, string> = {
  email_phishing: "Имэйл фишинг",
  sms_smishing: "SMS смишинг",
  voice_vishing: "Дуут фишинг",
  url_spoofing: "URL хуурамч",
  social_eng: "Нийгмийн инж.",
  credential_theft: "Нэвтрэх мэдээлэл",
  other: "Бусад",
};

export function CategoryRadarChart({ data }: { data: CategoryData[] }) {
  const labeled = data.map((d) => ({
    ...d,
    category: CATEGORY_LABELS[d.category] ?? d.category,
  }));

  return (
    <div className="rounded-xl border border-[var(--color-border-1)] bg-[var(--color-navy-2)] p-5">
      <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        // КАТЕГОРИ ТУСЫН САЙЖРАЛ
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={labeled} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis dataKey="category" tick={{ fill: "#9ca3af", fontSize: 11 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "#6b7280", fontSize: 10 }} />
          <Radar name="Pre-test" dataKey="pre" stroke="#f87171" fill="#f87171" fillOpacity={0.15} />
          <Radar name="Post-test" dataKey="post" stroke="#34d399" fill="#34d399" fillOpacity={0.2} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ============================================
// Time Comparison Chart
// ============================================

export function TimeBarChart({ data }: { data: TimeComparisonData[] }) {
  return (
    <div className="rounded-xl border border-[var(--color-border-1)] bg-[var(--color-navy-2)] p-5">
      <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        // ХАРИУЛАХ ХУГАЦАА (СЕКУНД)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="question" tick={{ fill: "#9ca3af", fontSize: 10 }} />
          <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} unit="с" />
          <Tooltip
            contentStyle={{ backgroundColor: "#1a1f36", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
            labelStyle={{ color: "#fff" }}
          />
          <Legend />
          <Bar dataKey="pre" name="Pre-test" fill="#f87171" radius={[4, 4, 0, 0]} />
          <Bar dataKey="post" name="Post-test" fill="#34d399" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
