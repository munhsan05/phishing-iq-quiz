"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

// ============================================
// Types
// ============================================

export type TrendDataPoint = {
  date: string;
  testCount: number;
  avgScorePct: number;
};

export type PrePostPair = {
  experimentId: string;
  prePct: number;
  postPct: number;
};

export type QuestionDifficulty = {
  questionId: number;
  emailSubject: string;
  correctRate: number;
  avgTimeMs: number;
  totalAnswers: number;
};

export type ResponseTimeData = {
  questionId: number;
  emailSubject: string;
  avgTimeMs: number;
  timeoutCount: number;
  totalAnswers: number;
};

export type AgeGroupRadarData = {
  category: string;
  [ageGroup: string]: string | number;
};

// ============================================
// Shared styles
// ============================================

const CARD = "rounded-xl border border-[var(--color-border-1)] bg-[var(--color-navy-2)] p-5";
const HEADING = "mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground";
const TOOLTIP_STYLE = {
  backgroundColor: "#1a1f36",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
};
const TICK = { fill: "#9ca3af", fontSize: 12 };

// ============================================
// Trend Line Chart (Overview)
// ============================================

export function TrendLineChart({
  data,
  title,
}: {
  data: TrendDataPoint[];
  title: string;
}) {
  return (
    <div className={CARD} role="img" aria-label={`${title} — тестийн тоо болон дундаж оноо`}>
      <h3 className={HEADING}>{title}</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="date" tick={TICK} />
          <YAxis yAxisId="left" tick={TICK} />
          <YAxis yAxisId="right" orientation="right" tick={TICK} unit="%" domain={[0, 100]} />
          <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={{ color: "#fff" }} />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="testCount" name="Тестийн тоо" stroke="#06d6f5" strokeWidth={2} dot={{ r: 3 }} />
          <Line yAxisId="right" type="monotone" dataKey="avgScorePct" name="Дундаж оноо (%)" stroke="#34d399" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ============================================
// Pre/Post Scatter Plot (Effectiveness)
// ============================================

export function PrePostScatterChart({ data }: { data: PrePostPair[] }) {
  return (
    <div className={CARD} role="img" aria-label="Pre/Post тестийн оноо тархалт">
      <h3 className={HEADING}>Хэрэглэгч бүрийн ахиц (Pre vs Post)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis type="number" dataKey="prePct" name="Pre-test %" domain={[0, 100]} tick={TICK} unit="%" />
          <YAxis type="number" dataKey="postPct" name="Post-test %" domain={[0, 100]} tick={TICK} unit="%" />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            labelStyle={{ color: "#fff" }}
            formatter={(value) => [`${value ?? ""}%`]}
          />
          <Scatter data={data} fill="#06d6f5">
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.postPct > entry.prePct ? "#34d399" : entry.postPct < entry.prePct ? "#f87171" : "#9ca3af"}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Шугамын дээрх цэг = сайжрав, доорх = буурав
      </p>
    </div>
  );
}

// ============================================
// Question Difficulty Bar (Questions)
// ============================================

export function DifficultyBarChart({ data }: { data: QuestionDifficulty[] }) {
  const truncated = data.map((d, i) => ({
    ...d,
    label: `${i + 1}`,
  }));

  return (
    <div className={CARD} role="img" aria-label="Асуулт тус бүрийн зөв хариултын хувь бар график">
      <h3 className={HEADING}>Асуулт тус бүрийн зөв хариултын хувь</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={truncated}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="label" tick={TICK} />
          <YAxis domain={[0, 100]} tick={TICK} unit="%" />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            labelStyle={{ color: "#fff" }}
            formatter={(value) => [
              typeof value === "number" ? `${value.toFixed(1)}%` : `${value ?? ""}%`,
            ]}
            labelFormatter={(label) => {
              const key = String(label ?? "");
              const item = truncated.find((d) => d.label === key);
              return item ? item.emailSubject : key;
            }}
          />
          <Bar dataKey="correctRate" name="Зөв хариулт %" radius={[4, 4, 0, 0]}>
            {truncated.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.correctRate >= 70 ? "#34d399" : entry.correctRate >= 40 ? "#fbbf24" : "#f87171"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ============================================
// Response Time Bar (Behavioral)
// ============================================

export function ResponseTimeBarChart({ data }: { data: ResponseTimeData[] }) {
  const formatted = data.map((d, i) => ({
    label: `${i + 1}`,
    avgTimeSec: Number((d.avgTimeMs / 1000).toFixed(1)),
    emailSubject: d.emailSubject,
  }));

  return (
    <div className={CARD} role="img" aria-label="Асуулт тус бүрийн дундаж хариулах хугацаа бар график">
      <h3 className={HEADING}>Асуулт тус бүрийн дундаж хариулах хугацаа</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="label" tick={TICK} />
          <YAxis tick={TICK} unit="с" />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            labelStyle={{ color: "#fff" }}
            formatter={(value) => [`${value ?? ""}с`]}
            labelFormatter={(label) => {
              const key = String(label ?? "");
              const item = formatted.find((d) => d.label === key);
              return item ? item.emailSubject : key;
            }}
          />
          <Bar dataKey="avgTimeSec" name="Дундаж хугацаа" fill="#06d6f5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ============================================
// Age Group Radar (Age Groups)
// ============================================

const AGE_COLORS: Record<string, string> = {
  "6-18": "#f87171",
  "18-35": "#06d6f5",
  "35-60+": "#34d399",
};

export function AgeGroupRadarChart({ data }: { data: AgeGroupRadarData[] }) {
  const ageGroups = Object.keys(data[0] ?? {}).filter((k) => k !== "category");

  return (
    <div className={CARD} role="img" aria-label="Насны бүлгийн категори тусын зөв хариулт радар график">
      <h3 className={HEADING}>Насны бүлгийн категори тусын зөв хариулт</h3>
      <ResponsiveContainer width="100%" height={350}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis dataKey="category" tick={{ fill: "#9ca3af", fontSize: 11 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "#6b7280", fontSize: 10 }} />
          {ageGroups.map((ag) => (
            <Radar
              key={ag}
              name={ag}
              dataKey={ag}
              stroke={AGE_COLORS[ag] ?? "#9ca3af"}
              fill={AGE_COLORS[ag] ?? "#9ca3af"}
              fillOpacity={0.12}
            />
          ))}
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ============================================
// Stat Card (reusable)
// ============================================

export function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border-1)] bg-[var(--color-navy-2)] p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-mono text-3xl font-extrabold text-white">
        {value}
      </div>
      {sub ? (
        <div className="mt-1 text-sm text-muted-foreground">{sub}</div>
      ) : null}
    </div>
  );
}
