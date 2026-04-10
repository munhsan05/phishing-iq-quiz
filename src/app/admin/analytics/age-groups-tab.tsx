import { getAgeGroupBreakdown } from "@/db/queries";
import {
  StatCard,
  AgeGroupRadarChart,
  type AgeGroupRadarData,
} from "@/components/analytics-charts";
import { Card } from "@/components/ui/card";
import { AGE_GROUP_LABELS, AGE_GROUP_ICONS } from "@/lib/constants";
import type { AgeGroup } from "@/lib/constants";
import { cn } from "@/lib/utils";

const CATEGORY_LABELS: Record<string, string> = {
  email_phishing: "Имэйл фишинг",
  sms_smishing: "SMS смишинг",
  voice_vishing: "Дуут фишинг",
  url_spoofing: "URL хуурамч",
  social_eng: "Нийгмийн инж.",
  credential_theft: "Нэвтрэх мэдээлэл",
  other: "Бусад",
};

export async function AgeGroupsTab() {
  const data = await getAgeGroupBreakdown();

  if (data.summary.length === 0) {
    return (
      <Card className="bg-[var(--color-navy-2)] ring-1 ring-[var(--color-border-1)] p-8 text-center">
        <p className="text-muted-foreground">Тестийн дата байхгүй байна.</p>
      </Card>
    );
  }

  // Build radar chart data: rows = categories, columns = age groups
  const categories = [...new Set(data.categoryAccuracy.map((c) => c.category))];
  const radarData: AgeGroupRadarData[] = categories.map((cat) => {
    const row: AgeGroupRadarData = {
      category: CATEGORY_LABELS[cat] ?? cat,
    };
    for (const entry of data.categoryAccuracy) {
      if (entry.category === cat) {
        row[entry.ageGroup] = Number(entry.correctRate.toFixed(1));
      }
    }
    return row;
  });

  return (
    <div className="space-y-6">
      {/* Per-age-group cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {data.summary.map((ag) => (
          <Card
            key={ag.ageGroup}
            className="bg-[var(--color-navy-2)] ring-1 ring-[var(--color-border-1)] p-5"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden="true">
                {AGE_GROUP_ICONS[ag.ageGroup as AgeGroup]}
              </span>
              <div>
                <div className="font-mono text-lg font-bold text-white">
                  {AGE_GROUP_LABELS[ag.ageGroup as AgeGroup]}
                </div>
                <div className="text-xs text-muted-foreground">
                  {ag.testCount} тест · {ag.completedCount} дуусгасан
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-muted-foreground">Дундаж оноо</div>
                <div className={cn(
                  "font-mono text-xl font-bold",
                  ag.avgScorePct >= 70 ? "text-emerald-400" : ag.avgScorePct >= 50 ? "text-yellow" : "text-red",
                )}>
                  {ag.avgScorePct.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Дундаж хугацаа</div>
                <div className="font-mono text-xl font-bold text-white">
                  {formatDuration(Math.round(ag.avgTimeMs / 1000))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Radar chart */}
      {radarData.length > 0 && <AgeGroupRadarChart data={radarData} />}
    </div>
  );
}

function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
