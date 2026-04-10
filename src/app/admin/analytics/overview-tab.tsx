import {
  getOverviewStats,
  getTrendData,
} from "@/db/queries";
import {
  StatCard,
  TrendLineChart,
  type TrendDataPoint,
} from "@/components/analytics-charts";

export async function OverviewTab() {
  const [stats, trend7, trend30] = await Promise.all([
    getOverviewStats(),
    getTrendData(7),
    getTrendData(30),
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
