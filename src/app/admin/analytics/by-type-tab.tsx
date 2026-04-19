import { Card } from "@/components/ui/card";
import {
  getAccuracyByType,
  getInboxF1Stats,
  getMostMissedTypeByAgeGroup,
} from "./queries-by-type";
import { TypeAccuracyChart } from "./type-accuracy-chart";
import { TYPE_LABELS, TYPE_ICONS } from "@/lib/constants";
import type { QuestionType } from "@/lib/types";

export async function ByTypeTab() {
  const [accuracy, inboxStats, missMatrix] = await Promise.all([
    getAccuracyByType(),
    getInboxF1Stats(),
    getMostMissedTypeByAgeGroup(),
  ]);

  const missByAge = new Map<string, typeof missMatrix>();
  for (const row of missMatrix) {
    const arr = missByAge.get(row.age_group) ?? [];
    arr.push(row);
    missByAge.set(row.age_group, arr);
  }

  return (
    <div className="space-y-6">
      <Card className="bg-[var(--color-navy-2)] ring-1 ring-[var(--color-border-1)] p-5 sm:p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">
          Нарийвчлал төрлөөр
        </h3>
        {accuracy.length === 0 ? (
          <div className="text-sm text-muted-foreground">Өгөгдөл алга.</div>
        ) : (
          <TypeAccuracyChart data={accuracy} />
        )}
      </Card>

      <Card className="bg-[var(--color-navy-2)] ring-1 ring-[var(--color-border-1)] p-5 sm:p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">
          Inbox triage F1 оноо
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <Stat
            label="Нийт triage"
            value={String(inboxStats.total_batches)}
          />
          <Stat
            label="Дундаж F1"
            value={inboxStats.avg_f1.toFixed(3)}
          />
          <Stat
            label="Дундаж хугацаа"
            value={`${Math.round(inboxStats.avg_time_ms / 1000)}с`}
          />
        </div>
      </Card>

      <Card className="bg-[var(--color-navy-2)] ring-1 ring-[var(--color-border-1)] p-5 sm:p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">
          Насны бүлгээр алддаг төрлүүд (өндрөөс доош)
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {[...missByAge.entries()].map(([ageGroup, rows]) => (
            <div
              key={ageGroup}
              className="rounded-lg border border-[var(--color-border-1)] p-3"
            >
              <div className="mb-2 text-sm font-semibold text-cyan">
                {ageGroup}
              </div>
              <ul className="space-y-1 text-sm">
                {rows.slice(0, 5).map((r) => (
                  <li
                    key={`${ageGroup}-${r.type}`}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="text-muted-foreground">
                      {TYPE_ICONS[r.type as QuestionType] ?? "❓"}{" "}
                      {TYPE_LABELS[r.type as QuestionType] ?? r.type}
                    </span>
                    <span className="font-mono text-xs text-red-400">
                      {(r.miss_rate * 100).toFixed(0)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--color-border-1)] bg-[var(--color-surface-1)] p-3 text-center">
      <div className="font-mono text-xl font-bold text-cyan">{value}</div>
      <div className="mt-1 text-[0.65rem] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
