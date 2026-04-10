import {
  getOverviewStats,
  getTrendData,
  getAgeGroupBreakdown,
} from "@/db/queries";
import {
  StatCard,
  TrendLineChart,
  type TrendDataPoint,
} from "@/components/analytics-charts";
import {
  AGE_GROUP_LABELS,
  AGE_GROUP_ICONS,
  type AgeGroup,
} from "@/lib/constants";

export async function OverviewTab() {
  const [stats, trend7, trend30, breakdown] = await Promise.all([
    getOverviewStats(),
    getTrendData(7),
    getTrendData(30),
    getAgeGroupBreakdown(),
  ]);

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Нийт хэрэглэгч"
          value={String(stats.totalUsers)}
        />
        <StatCard
          label="Нийт тест"
          value={String(stats.totalTests)}
          sub={`${stats.completedTests} дуусгасан`}
        />
        <StatCard
          label="Дундаж оноо"
          value={`${stats.avgScorePercent.toFixed(1)}%`}
        />
        <StatCard
          label="Дуусгалтын хувь"
          value={`${stats.completionRate.toFixed(1)}%`}
          sub={`${stats.completedTests}/${stats.totalTests}`}
        />
      </div>

      {/* Per-age-group summary */}
      <div className="grid grid-cols-3 gap-4">
        {breakdown.summary.map((ag) => (
          <div
            key={ag.ageGroup}
            className="rounded-xl border border-[var(--color-border-1)] bg-[var(--color-navy-2)] p-4 text-center"
          >
            <span className="text-2xl" aria-hidden="true">
              {AGE_GROUP_ICONS[ag.ageGroup as AgeGroup]}
            </span>
            <div className="mt-1 font-mono text-sm font-bold text-white">
              {AGE_GROUP_LABELS[ag.ageGroup as AgeGroup]}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {ag.testCount} тест · {ag.completedCount} дуусгасан
            </div>
            <div className="mt-1 font-mono text-lg font-bold text-cyan">
              {ag.avgScorePct.toFixed(0)}%
            </div>
          </div>
        ))}
      </div>

      {/* Trend charts */}
      <TrendLineChart
        data={trend7 as TrendDataPoint[]}
        title="Сүүлийн 7 хоног"
      />
      <TrendLineChart
        data={trend30 as TrendDataPoint[]}
        title="Сүүлийн 30 хоног"
      />
    </div>
  );
}
