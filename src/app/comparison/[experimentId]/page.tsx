import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ScoreBarChart,
  CategoryRadarChart,
  TimeBarChart,
  type ScoreComparisonData,
  type CategoryData,
  type TimeComparisonData,
} from "@/components/comparison-charts";
import { getExperimentComparison } from "@/db/queries";
import { AGE_GROUP_LABELS } from "@/lib/constants";
import {
  mean,
  pairedTTest,
  cohensD,
  interpretCohensD,
  interpretPValue,
} from "@/lib/statistics";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Харьцуулалт",
  description: "Pre-test ба Post-test хоорондын харьцуулалт.",
};

type PageProps = {
  params: Promise<{ experimentId: string }>;
};

export default async function ComparisonPage({ params }: PageProps) {
  const { experimentId } = await params;
  const data = await getExperimentComparison(experimentId);
  if (!data) notFound();

  const { user, preTest, postTest, preAnswers, postAnswers } = data;

  // ── Basic scores ──
  const preScore = preTest.score;
  const postScore = postTest.score;
  const total = preTest.totalQuestions;
  const prePct = total > 0 ? Math.round((preScore / total) * 100) : 0;
  const postPct = total > 0 ? Math.round((postScore / total) * 100) : 0;
  const diff = postPct - prePct;

  // ── Per-question paired data (matched by question_id) ──
  const preByQ = new Map(preAnswers.map((r) => [r.question.id, r]));
  const postByQ = new Map(postAnswers.map((r) => [r.question.id, r]));
  const allQuestionIds = [...new Set([...preByQ.keys(), ...postByQ.keys()])];

  const preScores: number[] = [];
  const postScores: number[] = [];
  const questionDetails: {
    id: number;
    subject: string;
    from: string;
    category: string;
    preCorrect: boolean;
    postCorrect: boolean;
    preTimeMs: number;
    postTimeMs: number;
  }[] = [];

  for (const qId of allQuestionIds) {
    const pre = preByQ.get(qId);
    const post = postByQ.get(qId);
    if (!pre || !post) continue;

    preScores.push(pre.answer.isCorrect ? 1 : 0);
    postScores.push(post.answer.isCorrect ? 1 : 0);
    questionDetails.push({
      id: qId,
      subject: pre.question.emailSubject,
      from: pre.question.emailFrom,
      category: pre.question.category,
      preCorrect: pre.answer.isCorrect,
      postCorrect: post.answer.isCorrect,
      preTimeMs: pre.answer.timeTakenMs,
      postTimeMs: post.answer.timeTakenMs,
    });
  }

  // ── Statistics ──
  const tTest = pairedTTest(preScores, postScores);
  const d = cohensD(preScores, postScores);
  const preAvgTime = mean(questionDetails.map((q) => q.preTimeMs)) / 1000;
  const postAvgTime = mean(questionDetails.map((q) => q.postTimeMs)) / 1000;

  // ── Chart data ──
  const scoreData: ScoreComparisonData[] = [
    { label: "Зөв хариулт (%)", pre: prePct, post: postPct },
  ];

  const categories = [...new Set(questionDetails.map((q) => q.category))];
  const categoryData: CategoryData[] = categories.map((cat) => {
    const qs = questionDetails.filter((q) => q.category === cat);
    const preCat = qs.filter((q) => q.preCorrect).length / qs.length * 100;
    const postCat = qs.filter((q) => q.postCorrect).length / qs.length * 100;
    return { category: cat, pre: Math.round(preCat), post: Math.round(postCat) };
  });

  const timeData: TimeComparisonData[] = questionDetails.map((q, i) => ({
    question: `${i + 1}`,
    pre: Math.round(q.preTimeMs / 1000),
    post: Math.round(q.postTimeMs / 1000),
  }));

  const preTimeStr = `${preAvgTime.toFixed(1)}с`;
  const postTimeStr = `${postAvgTime.toFixed(1)}с`;
  const preTotalSec = Math.round(preTest.totalTimeMs / 1000);
  const postTotalSec = Math.round(postTest.totalTimeMs / 1000);

  return (
    <main id="main-content" className="relative z-10 flex flex-1 flex-col items-center px-4 py-10 sm:px-6 sm:py-14">
      <div className="w-full max-w-4xl space-y-6">
        {/* Hero */}
        <Card className="bg-[var(--color-navy-2)] ring-1 ring-[var(--color-border-1)] p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              ШУТИС · Pre/Post Туршилтын Харьцуулалт
            </div>
            <h1 className="bg-gradient-to-r from-cyan to-blue-2 bg-clip-text text-transparent text-3xl font-extrabold tracking-tight sm:text-4xl">
              Харьцуулалт
            </h1>
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <span>
                <span className="font-semibold text-white">{user.name}</span>
              </span>
              <span>{AGE_GROUP_LABELS[user.ageGroup]}</span>
            </div>

            {/* Big score comparison */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Pre-test</div>
                <div className="font-mono text-3xl font-extrabold text-[#f87171] sm:text-5xl">
                  {preScore}<span className="text-lg text-muted-foreground">/{total}</span>
                </div>
                <div className="text-sm text-muted-foreground">{prePct}%</div>
              </div>
              <div className="text-3xl text-muted-foreground">→</div>
              <div className="text-center">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Post-test</div>
                <div className="font-mono text-3xl font-extrabold text-[#34d399] sm:text-5xl">
                  {postScore}<span className="text-lg text-muted-foreground">/{total}</span>
                </div>
                <div className="text-sm text-muted-foreground">{postPct}%</div>
              </div>
              <div className={cn(
                "rounded-xl px-3 py-1.5 text-center font-mono text-lg font-bold sm:px-4 sm:py-2 sm:text-2xl",
                diff > 0 ? "bg-emerald-500/10 text-emerald-400" : diff < 0 ? "bg-red-500/10 text-red-400" : "bg-white/5 text-muted-foreground",
              )}>
                {diff > 0 ? "+" : ""}{diff}%
              </div>
            </div>
          </div>
        </Card>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ScoreBarChart data={scoreData} />
          <CategoryRadarChart data={categoryData} />
        </div>
        <TimeBarChart data={timeData} />

        {/* Per-question detail table */}
        <Card className="bg-[var(--color-navy-2)] ring-1 ring-[var(--color-border-1)] p-5 sm:p-6">
          <h2 className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {/* АСУУЛТ ТУСЫН ӨӨРЧЛӨЛТ */}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-2 pr-3">#</th>
                  <th className="py-2 pr-3">Имэйл сэдэв</th>
                  <th className="py-2 pr-3 text-center">Pre</th>
                  <th className="py-2 pr-3 text-center">Post</th>
                  <th className="py-2 pr-3 text-center">Хугацаа</th>
                  <th className="py-2 text-center">Өөрчлөлт</th>
                </tr>
              </thead>
              <tbody>
                {questionDetails.map((q, i) => {
                  const improved = !q.preCorrect && q.postCorrect;
                  const regressed = q.preCorrect && !q.postCorrect;
                  const stable = q.preCorrect === q.postCorrect;
                  return (
                    <tr key={q.id} className="border-b border-white/5">
                      <td className="py-2 pr-3 font-mono text-xs text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </td>
                      <td className="py-2 pr-3 max-w-[200px] truncate text-white">
                        {q.subject}
                      </td>
                      <td className="py-2 pr-3 text-center">
                        {q.preCorrect ? "✅" : "❌"}
                      </td>
                      <td className="py-2 pr-3 text-center">
                        {q.postCorrect ? "✅" : "❌"}
                      </td>
                      <td className="py-2 pr-3 text-center font-mono text-xs text-muted-foreground">
                        {Math.round(q.preTimeMs / 1000)}с → {Math.round(q.postTimeMs / 1000)}с
                      </td>
                      <td className="py-2 text-center">
                        {improved && <span className="text-emerald-400">Сайжрав</span>}
                        {regressed && <span className="text-red-400">Буурав</span>}
                        {stable && q.preCorrect && <span className="text-blue-2">Тогтвортой</span>}
                        {stable && !q.preCorrect && <span className="text-yellow">Сайжраагүй</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Statistical analysis */}
        <Card className="bg-[var(--color-navy-2)] ring-1 ring-[var(--color-border-1)] p-5 sm:p-6">
          <h2 className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {/* СТАТИСТИК ШИНЖИЛГЭЭ */}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-white/5">
                <StatRow label="Pre-test оноо" value={`${preScore}/${total} (${prePct}%)`} />
                <StatRow label="Post-test оноо" value={`${postScore}/${total} (${postPct}%)`} />
                <StatRow label="Оноо ялгаа" value={`${diff > 0 ? "+" : ""}${diff}%`} highlight={diff > 0} />
                <StatRow label="Дундаж хариулах хугацаа (pre)" value={preTimeStr} />
                <StatRow label="Дундаж хариулах хугацаа (post)" value={postTimeStr} />
                <StatRow label="Нийт хугацаа (pre)" value={formatDuration(preTotalSec)} />
                <StatRow label="Нийт хугацаа (post)" value={formatDuration(postTotalSec)} />
                <StatRow label="Paired t-test t-value" value={tTest.tValue.toFixed(3)} />
                <StatRow label="p-value" value={tTest.pValue.toFixed(4)} />
                <StatRow label="p-value тайлбар" value={interpretPValue(tTest.pValue)} highlight={tTest.pValue < 0.05} />
                <StatRow label="Cohen's d (effect size)" value={d.toFixed(3)} />
                <StatRow label="Effect size тайлбар" value={interpretCohensD(d)} highlight={Math.abs(d) >= 0.8} />
                <StatRow label="Degrees of freedom" value={String(tTest.df)} />
              </tbody>
            </table>
          </div>

          {/* Interpretation guide */}
          <div className="mt-6 space-y-3 rounded-xl border border-[rgba(26,108,246,.18)] bg-[rgba(26,108,246,.06)] px-5 py-4 text-sm text-muted-foreground">
            <div>
              <strong className="text-blue-2">Cohen&apos;s d тайлбар:</strong>{" "}
              &lt; 0.2 бага нөлөө · 0.2–0.5 дунд нөлөө · 0.5–0.8 том нөлөө · &gt; 0.8 маш том нөлөө
            </div>
            <div>
              <strong className="text-blue-2">p-value тайлбар:</strong>{" "}
              &lt; 0.05 бол статистик ач холбогдолтой — сургалтын нөлөө баталгаажсан гэж үзнэ
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-12 flex-1 text-base",
            )}
          >
            ↩ Нүүр хуудас
          </Link>
          <Link
            href="/leaderboard"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "h-12 flex-1 bg-gradient-to-r from-blue to-cyan text-base text-white shadow-[0_8px_24px_rgba(26,108,246,0.35)]",
            )}
          >
            Leaderboard харах
          </Link>
        </div>
      </div>
    </main>
  );
}

function StatRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <tr>
      <td className="py-2.5 pr-4 text-muted-foreground">{label}</td>
      <td className={cn("py-2.5 font-mono font-semibold", highlight ? "text-cyan" : "text-white")}>
        {value}
      </td>
    </tr>
  );
}

function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
