import { getQuestionAnalysis } from "@/db/queries";
import { DifficultyBarChart, type QuestionDifficulty } from "@/components/analytics-charts";
import { Card } from "@/components/ui/card";
import { AGE_GROUP_LABELS } from "@/lib/constants";
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

export async function QuestionsTab() {
  const questions = await getQuestionAnalysis();

  if (questions.length === 0) {
    return (
      <Card className="bg-[var(--color-navy-2)] ring-1 ring-[var(--color-border-1)] p-8 text-center">
        <p className="text-muted-foreground">Хариултын дата байхгүй байна.</p>
      </Card>
    );
  }

  const chartData: QuestionDifficulty[] = questions.map((q) => ({
    questionId: q.questionId,
    emailSubject: q.emailSubject,
    correctRate: Number(q.correctRate.toFixed(1)),
    avgTimeMs: q.avgTimeMs,
    totalAnswers: q.totalAnswers,
  }));

  // Category summary
  const categoryMap = new Map<string, { correct: number; total: number }>();
  for (const q of questions) {
    const entry = categoryMap.get(q.category) ?? { correct: 0, total: 0 };
    entry.correct += q.correctCount;
    entry.total += q.totalAnswers;
    categoryMap.set(q.category, entry);
  }

  // Age group × category heatmap data
  const heatmapCells = new Map<string, { correct: number; total: number }>();
  for (const q of questions) {
    const key = `${q.ageGroup}|${q.category}`;
    const entry = heatmapCells.get(key) ?? { correct: 0, total: 0 };
    entry.correct += q.correctCount;
    entry.total += q.totalAnswers;
    heatmapCells.set(key, entry);
  }
  const allCategories = [...new Set(questions.map((q) => q.category))];
  const allAgeGroups = [...new Set(questions.map((q) => q.ageGroup))];

  return (
    <div className="space-y-6">
      <DifficultyBarChart data={chartData} />

      {/* Category summary */}
      <Card className="bg-[var(--color-navy-2)] ring-1 ring-[var(--color-border-1)] p-5">
        <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Категори тусын алдааны хувь
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-2 pr-3">Категори</th>
                <th className="py-2 pr-3 text-right">Нийт</th>
                <th className="py-2 pr-3 text-right">Зөв</th>
                <th className="py-2 text-right">Зөв %</th>
              </tr>
            </thead>
            <tbody>
              {[...categoryMap.entries()].map(([cat, { correct, total }]) => {
                const rate = total > 0 ? (correct / total) * 100 : 0;
                return (
                  <tr key={cat} className="border-b border-white/5">
                    <td className="py-2 pr-3 text-white">{CATEGORY_LABELS[cat] ?? cat}</td>
                    <td className="py-2 pr-3 text-right font-mono text-muted-foreground">{total}</td>
                    <td className="py-2 pr-3 text-right font-mono text-muted-foreground">{correct}</td>
                    <td className={cn(
                      "py-2 text-right font-mono font-semibold",
                      rate >= 70 ? "text-emerald-400" : rate >= 40 ? "text-yellow" : "text-red",
                    )}>
                      {rate.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Age Group × Category Heatmap */}
      <Card className="bg-[var(--color-navy-2)] ring-1 ring-[var(--color-border-1)] p-5">
        <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Насны бүлэг × Категори (зөв хариулт %)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-2 pr-3">Категори</th>
                {allAgeGroups.map((ag) => (
                  <th key={ag} className="py-2 pr-3 text-center">
                    {AGE_GROUP_LABELS[ag as keyof typeof AGE_GROUP_LABELS] ?? ag}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allCategories.map((cat) => (
                <tr key={cat} className="border-b border-white/5">
                  <td className="py-2 pr-3 text-white">{CATEGORY_LABELS[cat] ?? cat}</td>
                  {allAgeGroups.map((ag) => {
                    const cell = heatmapCells.get(`${ag}|${cat}`);
                    const rate = cell && cell.total > 0 ? (cell.correct / cell.total) * 100 : null;
                    return (
                      <td key={ag} className="py-2 pr-3 text-center">
                        {rate !== null ? (
                          <span
                            className={cn(
                              "inline-block rounded px-2 py-0.5 font-mono text-xs font-semibold",
                              rate >= 70
                                ? "bg-emerald-500/20 text-emerald-400"
                                : rate >= 40
                                  ? "bg-yellow-500/20 text-yellow"
                                  : "bg-red-500/20 text-red",
                            )}
                          >
                            {rate.toFixed(0)}%
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Full question detail table */}
      <Card className="bg-[var(--color-navy-2)] ring-1 ring-[var(--color-border-1)] p-5">
        <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Бүх асуултын дэлгэрэнгүй (хэцүү → амархан)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-2 pr-3">#</th>
                <th className="py-2 pr-3">Имэйл сэдэв</th>
                <th className="py-2 pr-3 text-center">Төрөл</th>
                <th className="py-2 pr-3 text-center">Категори</th>
                <th className="py-2 pr-3 text-right">Зөв %</th>
                <th className="py-2 pr-3 text-right">Д. хугацаа</th>
                <th className="py-2 text-right">Timeout</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, i) => (
                <tr key={q.questionId} className="border-b border-white/5">
                  <td className="py-2 pr-3 font-mono text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </td>
                  <td className="py-2 pr-3 max-w-[200px] truncate text-white">
                    {q.emailSubject}
                  </td>
                  <td className="py-2 pr-3 text-center">
                    {q.isPhish ? "🎣" : "✉️"}
                  </td>
                  <td className="py-2 pr-3 text-center text-xs text-muted-foreground">
                    {CATEGORY_LABELS[q.category] ?? q.category}
                  </td>
                  <td className={cn(
                    "py-2 pr-3 text-right font-mono font-semibold",
                    q.correctRate >= 70 ? "text-emerald-400" : q.correctRate >= 40 ? "text-yellow" : "text-red",
                  )}>
                    {q.correctRate.toFixed(1)}%
                  </td>
                  <td className="py-2 pr-3 text-right font-mono text-muted-foreground">
                    {(q.avgTimeMs / 1000).toFixed(1)}с
                  </td>
                  <td className="py-2 text-right font-mono text-muted-foreground">
                    {q.timeoutCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
