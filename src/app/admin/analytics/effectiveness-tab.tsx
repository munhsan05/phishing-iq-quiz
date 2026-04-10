import { getPrePostEffectiveness } from "@/db/queries";
import {
  StatCard,
  PrePostScatterChart,
  type PrePostPair,
} from "@/components/analytics-charts";
import { ScoreBarChart, type ScoreComparisonData } from "@/components/comparison-charts";
import {
  mean,
  pairedTTest,
  cohensD,
  interpretCohensD,
  interpretPValue,
} from "@/lib/statistics";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export async function EffectivenessTab() {
  const pairs = await getPrePostEffectiveness();
  const hasPairs = pairs.length > 0;

  if (!hasPairs) {
    return (
      <Card className="bg-[var(--color-navy-2)] ring-1 ring-[var(--color-border-1)] p-8 text-center">
        <div className="text-4xl" aria-hidden="true">📊</div>
        <p className="mt-3 text-muted-foreground">
          Pre/Post туршилтын дата байхгүй байна. Хэрэглэгчид Pre-test → Post-test flow-г дуусгах хэрэгтэй.
        </p>
      </Card>
    );
  }

  const preScores = pairs.map((p) => p.prePct);
  const postScores = pairs.map((p) => p.postPct);
  const preMean = mean(preScores);
  const postMean = mean(postScores);
  const tTest = pairedTTest(preScores, postScores);
  const d = cohensD(preScores, postScores);
  const improved = pairs.filter((p) => p.postPct > p.prePct).length;
  const improvementRate = (improved / pairs.length) * 100;

  const scoreData: ScoreComparisonData[] = [
    { label: "Дундаж оноо (%)", pre: Math.round(preMean), post: Math.round(postMean) },
  ];

  const scatterData: PrePostPair[] = pairs.map((p) => ({
    experimentId: p.experimentId,
    prePct: p.prePct,
    postPct: p.postPct,
  }));

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Туршилтын тоо" value={String(pairs.length)} />
        <StatCard
          label="Сайжрал хувь"
          value={`${improvementRate.toFixed(0)}%`}
          sub={`${improved}/${pairs.length} сайжирсан`}
        />
        <StatCard
          label="Cohen's d"
          value={d.toFixed(3)}
          sub={interpretCohensD(d)}
        />
        <StatCard
          label="p-value"
          value={tTest.pValue.toFixed(4)}
          sub={interpretPValue(tTest.pValue)}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ScoreBarChart data={scoreData} />
        <PrePostScatterChart data={scatterData} />
      </div>

      {/* Detailed stats table */}
      <Card className="bg-[var(--color-navy-2)] ring-1 ring-[var(--color-border-1)] p-5">
        <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Статистик шинжилгээ
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-white/5">
              <StatRow label="Pre-test дундаж" value={`${preMean.toFixed(1)}%`} />
              <StatRow label="Post-test дундаж" value={`${postMean.toFixed(1)}%`} />
              <StatRow label="Ялгаа" value={`${(postMean - preMean) > 0 ? "+" : ""}${(postMean - preMean).toFixed(1)}%`} highlight={postMean > preMean} />
              <StatRow label="t-value" value={tTest.tValue.toFixed(3)} />
              <StatRow label="p-value" value={tTest.pValue.toFixed(4)} />
              <StatRow label="p-value тайлбар" value={interpretPValue(tTest.pValue)} highlight={tTest.pValue < 0.05} />
              <StatRow label="Cohen's d" value={d.toFixed(3)} />
              <StatRow label="Effect size тайлбар" value={interpretCohensD(d)} highlight={Math.abs(d) >= 0.5} />
              <StatRow label="df" value={String(tTest.df)} />
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function StatRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <tr>
      <td className="py-2.5 pr-4 text-muted-foreground">{label}</td>
      <td className={cn("py-2.5 font-mono font-semibold", highlight ? "text-cyan" : "text-white")}>{value}</td>
    </tr>
  );
}
