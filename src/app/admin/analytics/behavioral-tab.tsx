import { getBehavioralData } from "@/db/queries";
import {
  StatCard,
  ResponseTimeBarChart,
  type ResponseTimeData,
} from "@/components/analytics-charts";
import { Card } from "@/components/ui/card";

export async function BehavioralTab() {
  const data = await getBehavioralData();

  if (data.totalAnswers === 0) {
    return (
      <Card className="bg-[var(--color-navy-2)] ring-1 ring-[var(--color-border-1)] p-8 text-center">
        <p className="text-muted-foreground">Хариултын дата байхгүй байна.</p>
      </Card>
    );
  }

  const chartData: ResponseTimeData[] = data.perQuestion;

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Нийт хариулт"
          value={String(data.totalAnswers)}
        />
        <StatCard
          label="Timeout хувь"
          value={`${data.timeoutRate.toFixed(1)}%`}
          sub={`${data.timeoutCount} timeout`}
        />
        <StatCard
          label="Дундаж хариулах хугацаа"
          value={`${(data.avgResponseTimeMs / 1000).toFixed(1)}с`}
        />
        <StatCard
          label="Quiz дуусгалтын хувь"
          value={`${data.completionRate.toFixed(1)}%`}
          sub={`${data.completedTests}/${data.totalTests}`}
        />
      </div>

      {/* Response time chart */}
      <ResponseTimeBarChart data={chartData} />
    </div>
  );
}
