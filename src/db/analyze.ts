/**
 * Statistical analysis script — generates CSV + LaTeX tables from quiz data.
 *
 * Analyses:
 *   1. Overview stats (users, tests, avg score, completion rate)
 *   2. Pre vs Post paired t-test (intervention effectiveness)
 *   3. Age group breakdown (per-group scores, timing)
 *
 * Output: diploma_project/analysis/
 *   - overview.csv, overview.tex
 *   - pre_post.csv, pre_post.tex
 *   - age_groups.csv, age_groups.tex
 *
 * Run: npx tsx src/db/analyze.ts
 */
import "dotenv/config";
import { db } from "./index";
import { users, questions, tests, answers } from "./schema";
import { eq, and, isNotNull, count, sql, asc, desc } from "drizzle-orm";
import { writeFileSync } from "fs";
import { join } from "path";

const OUT = join(__dirname, "../../analysis");

// ─── Helpers ───────────────────────────────────────────────────

function writeCsv(name: string, headers: string[], rows: string[][]) {
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  writeFileSync(join(OUT, `${name}.csv`), csv, "utf-8");
  console.log(`  CSV  → analysis/${name}.csv`);
}

function writeTex(name: string, content: string) {
  writeFileSync(join(OUT, `${name}.tex`), content, "utf-8");
  console.log(`  LaTeX → analysis/${name}.tex`);
}

/** Student's t-distribution CDF approximation (two-tailed p-value). */
function tTestPValue(t: number, df: number): number {
  // Approximation using the regularized incomplete beta function
  const x = df / (df + t * t);
  return betaIncomplete(df / 2, 0.5, x);
}

/** Regularized incomplete beta function (series approximation). */
function betaIncomplete(a: number, b: number, x: number): number {
  if (x === 0 || x === 1) return x;
  const lnBeta = lnGamma(a) + lnGamma(b) - lnGamma(a + b);
  const front = Math.exp(Math.log(x) * a + Math.log(1 - x) * b - lnBeta) / a;
  // Lentz's continued fraction
  let f = 1, c = 1, d = 0;
  for (let i = 0; i <= 200; i++) {
    const m = Math.floor(i / 2);
    let numerator: number;
    if (i === 0) {
      numerator = 1;
    } else if (i % 2 === 0) {
      numerator = (m * (b - m) * x) / ((a + 2 * m - 1) * (a + 2 * m));
    } else {
      numerator = -((a + m) * (a + b + m) * x) / ((a + 2 * m) * (a + 2 * m + 1));
    }
    d = 1 + numerator * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    d = 1 / d;
    c = 1 + numerator / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    f *= c * d;
    if (Math.abs(c * d - 1) < 1e-10) break;
  }
  return front * f;
}

function lnGamma(z: number): number {
  const c = [76.18009172947146, -86.50532032941677, 24.01409824083091,
    -1.231739572450155, 0.001208650973866179, -0.000005395239384953];
  const x = z;
  let y = z;
  let tmp = x + 5.5;
  tmp -= (x + 0.5) * Math.log(tmp);
  let ser = 1.000000000190015;
  for (const cj of c) ser += cj / ++y;
  return -tmp + Math.log(2.5066282746310005 * ser / x);
}

function fmt(n: number, decimals = 1): string {
  return n.toFixed(decimals);
}

// ─── Analysis 1: Overview ──────────────────────────────────────

async function analyzeOverview() {
  console.log("\n📊 1. Ерөнхий тойм");

  const [userRow] = await db.select({ value: count() }).from(users);
  const [testRow] = await db
    .select({
      total: count(),
      completed: sql<number>`COUNT(${tests.completedAt})`,
      avgScorePct: sql<number>`COALESCE(AVG(
        CASE WHEN ${tests.completedAt} IS NOT NULL
          THEN ${tests.score}::float / NULLIF(${tests.totalQuestions}, 0) * 100
        END
      ), 0)`,
      avgTimeMs: sql<number>`COALESCE(AVG(
        CASE WHEN ${tests.completedAt} IS NOT NULL THEN ${tests.totalTimeMs} END
      ), 0)`,
    })
    .from(tests);

  const [answerRow] = await db
    .select({
      total: count(),
      correct: sql<number>`COUNT(CASE WHEN ${answers.isCorrect} THEN 1 END)`,
      timeouts: sql<number>`COUNT(CASE WHEN ${answers.selectedIsPhish} IS NULL THEN 1 END)`,
    })
    .from(answers);

  const totalUsers = userRow.value;
  const totalTests = testRow.total;
  const completedTests = Number(testRow.completed);
  const completionRate = totalTests > 0 ? (completedTests / totalTests) * 100 : 0;
  const avgScorePct = Number(testRow.avgScorePct);
  const avgTimeSec = Number(testRow.avgTimeMs) / 1000;
  const totalAnswers = answerRow.total;
  const correctAnswers = Number(answerRow.correct);
  const overallAccuracy = totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0;
  const timeouts = Number(answerRow.timeouts);
  const timeoutRate = totalAnswers > 0 ? (timeouts / totalAnswers) * 100 : 0;

  console.log(`  Хэрэглэгч: ${totalUsers}`);
  console.log(`  Тест: ${totalTests} (дууссан: ${completedTests})`);
  console.log(`  Дундаж оноо: ${fmt(avgScorePct)}%`);
  console.log(`  Нийт accuracy: ${fmt(overallAccuracy)}%`);

  // CSV
  writeCsv("overview",
    ["metric", "value"],
    [
      ["total_users", String(totalUsers)],
      ["total_tests", String(totalTests)],
      ["completed_tests", String(completedTests)],
      ["completion_rate_pct", fmt(completionRate)],
      ["avg_score_pct", fmt(avgScorePct)],
      ["avg_time_sec", fmt(avgTimeSec)],
      ["total_answers", String(totalAnswers)],
      ["correct_answers", String(correctAnswers)],
      ["overall_accuracy_pct", fmt(overallAccuracy)],
      ["timeout_count", String(timeouts)],
      ["timeout_rate_pct", fmt(timeoutRate)],
    ],
  );

  // LaTeX
  const tex = `% Ерөнхий тойм хүснэгт — auto-generated
\\begin{table}[H]
  \\centering
  \\caption{Судалгааны ерөнхий тойм}
  \\label{tab:overview}
  \\begin{tabular}{l r}
    \\toprule
    \\textbf{Үзүүлэлт} & \\textbf{Утга} \\\\
    \\midrule
    Нийт хэрэглэгч          & ${totalUsers} \\\\
    Нийт тест                & ${totalTests} \\\\
    Дууссан тест             & ${completedTests} \\\\
    Completion rate           & ${fmt(completionRate)}\\% \\\\
    Дундаж оноо              & ${fmt(avgScorePct)}\\% \\\\
    Дундаж хугацаа           & ${fmt(avgTimeSec)} сек \\\\
    Нийт хариулт             & ${totalAnswers} \\\\
    Зөв хариулт              & ${correctAnswers} (${fmt(overallAccuracy)}\\%) \\\\
    Timeout                  & ${timeouts} (${fmt(timeoutRate)}\\%) \\\\
    \\bottomrule
  \\end{tabular}
\\end{table}
`;
  writeTex("overview", tex);
}

// ─── Analysis 2: Pre vs Post (paired t-test) ───────────────────

async function analyzePrePost() {
  console.log("\n📊 2. Pre vs Post харьцуулалт (paired t-test)");

  const rows = await db
    .select({
      experimentId: tests.experimentId,
      testType: tests.testType,
      score: tests.score,
      totalQuestions: tests.totalQuestions,
      totalTimeMs: tests.totalTimeMs,
    })
    .from(tests)
    .where(and(isNotNull(tests.experimentId), isNotNull(tests.completedAt)))
    .orderBy(tests.experimentId, tests.testType);

  // Group by experiment
  const byExp = new Map<string, { pre?: typeof rows[0]; post?: typeof rows[0] }>();
  for (const row of rows) {
    if (!row.experimentId) continue;
    const entry = byExp.get(row.experimentId) ?? {};
    if (row.testType === "pre") entry.pre = row;
    if (row.testType === "post") entry.post = row;
    byExp.set(row.experimentId, entry);
  }

  // Filter complete pairs
  const pairs = [...byExp.values()].filter((v) => v.pre && v.post) as {
    pre: typeof rows[0]; post: typeof rows[0];
  }[];

  console.log(`  Experiment хосууд: ${pairs.length}`);

  if (pairs.length < 2) {
    console.log("  ⚠️ Хангалттай хос байхгүй");
    return;
  }

  // Compute paired differences (percentage scores)
  const prePcts: number[] = [];
  const postPcts: number[] = [];
  const diffs: number[] = [];
  const preTimeSec: number[] = [];
  const postTimeSec: number[] = [];

  for (const { pre, post } of pairs) {
    const prePct = pre.totalQuestions > 0 ? (pre.score / pre.totalQuestions) * 100 : 0;
    const postPct = post.totalQuestions > 0 ? (post.score / post.totalQuestions) * 100 : 0;
    prePcts.push(prePct);
    postPcts.push(postPct);
    diffs.push(postPct - prePct);
    preTimeSec.push(pre.totalTimeMs / 1000);
    postTimeSec.push(post.totalTimeMs / 1000);
  }

  const n = diffs.length;
  const meanDiff = diffs.reduce((a, b) => a + b, 0) / n;
  const meanPre = prePcts.reduce((a, b) => a + b, 0) / n;
  const meanPost = postPcts.reduce((a, b) => a + b, 0) / n;
  const meanPreTime = preTimeSec.reduce((a, b) => a + b, 0) / n;
  const meanPostTime = postTimeSec.reduce((a, b) => a + b, 0) / n;

  // Standard deviation of differences
  const sdDiff = Math.sqrt(
    diffs.reduce((sum, d) => sum + (d - meanDiff) ** 2, 0) / (n - 1)
  );

  // Paired t-test
  const tStat = meanDiff / (sdDiff / Math.sqrt(n));
  const df = n - 1;
  const pValue = tTestPValue(Math.abs(tStat), df);
  const significant = pValue < 0.05;

  // Cohen's d (effect size)
  const cohensD = meanDiff / sdDiff;

  // Count improved / same / declined
  const improved = diffs.filter((d) => d > 0).length;
  const same = diffs.filter((d) => d === 0).length;
  const declined = diffs.filter((d) => d < 0).length;

  console.log(`  Pre дундаж:  ${fmt(meanPre)}%`);
  console.log(`  Post дундаж: ${fmt(meanPost)}%`);
  console.log(`  Ялгаа:      +${fmt(meanDiff)}%`);
  console.log(`  t-статистик: ${fmt(tStat, 3)}`);
  console.log(`  p-утга:      ${pValue < 0.001 ? "<0.001" : fmt(pValue, 4)}`);
  console.log(`  Cohen's d:   ${fmt(cohensD, 3)}`);
  console.log(`  ${significant ? "✅ Статистик ач холбогдолтой (p < 0.05)" : "❌ Ач холбогдолгүй"}`);
  console.log(`  Сайжирсан: ${improved}, Ижил: ${same}, Буурсан: ${declined}`);

  // CSV
  writeCsv("pre_post",
    ["metric", "value"],
    [
      ["n_pairs", String(n)],
      ["pre_mean_pct", fmt(meanPre)],
      ["post_mean_pct", fmt(meanPost)],
      ["mean_diff_pct", fmt(meanDiff)],
      ["sd_diff", fmt(sdDiff, 3)],
      ["t_statistic", fmt(tStat, 3)],
      ["df", String(df)],
      ["p_value", pValue < 0.001 ? "<0.001" : fmt(pValue, 4)],
      ["cohens_d", fmt(cohensD, 3)],
      ["improved_count", String(improved)],
      ["same_count", String(same)],
      ["declined_count", String(declined)],
      ["pre_avg_time_sec", fmt(meanPreTime)],
      ["post_avg_time_sec", fmt(meanPostTime)],
    ],
  );

  // LaTeX
  const pStr = pValue < 0.001 ? "$<$0.001" : fmt(pValue, 4);
  const tex = `% Pre vs Post paired t-test — auto-generated
\\begin{table}[H]
  \\centering
  \\caption{Pre-test ба Post-test оноо харьцуулалт (paired t-test)}
  \\label{tab:pre-post}
  \\begin{tabular}{l r r r}
    \\toprule
    \\textbf{Үзүүлэлт} & \\textbf{Pre-test} & \\textbf{Post-test} & \\textbf{Ялгаа} \\\\
    \\midrule
    Хосын тоо (n)           & \\multicolumn{3}{c}{${n}} \\\\
    Дундаж оноо (\\%)        & ${fmt(meanPre)} & ${fmt(meanPost)} & +${fmt(meanDiff)} \\\\
    Дундаж хугацаа (сек)    & ${fmt(meanPreTime)} & ${fmt(meanPostTime)} & ${fmt(meanPostTime - meanPreTime)} \\\\
    \\midrule
    t-статистик             & \\multicolumn{3}{c}{${fmt(tStat, 3)}} \\\\
    Эрх чөлөөний зэрэг (df) & \\multicolumn{3}{c}{${df}} \\\\
    p-утга                  & \\multicolumn{3}{c}{${pStr}} \\\\
    Cohen's d               & \\multicolumn{3}{c}{${fmt(cohensD, 3)}} \\\\
    \\midrule
    Сайжирсан               & \\multicolumn{3}{c}{${improved} (${fmt(improved / n * 100)}\\%)} \\\\
    Буурсан                 & \\multicolumn{3}{c}{${declined} (${fmt(declined / n * 100)}\\%)} \\\\
    \\bottomrule
  \\end{tabular}
\\end{table}
`;
  writeTex("pre_post", tex);
}

// ─── Analysis 3: Age group breakdown ───────────────────────────

async function analyzeAgeGroups() {
  console.log("\n📊 3. Насны бүлгийн харьцуулалт");

  const summary = await db
    .select({
      ageGroup: tests.ageGroup,
      testCount: count(),
      completedCount: sql<number>`COUNT(${tests.completedAt})`,
      avgScorePct: sql<number>`COALESCE(AVG(
        CASE WHEN ${tests.completedAt} IS NOT NULL
          THEN ${tests.score}::float / NULLIF(${tests.totalQuestions}, 0) * 100
        END
      ), 0)`,
      minScorePct: sql<number>`COALESCE(MIN(
        CASE WHEN ${tests.completedAt} IS NOT NULL
          THEN ${tests.score}::float / NULLIF(${tests.totalQuestions}, 0) * 100
        END
      ), 0)`,
      maxScorePct: sql<number>`COALESCE(MAX(
        CASE WHEN ${tests.completedAt} IS NOT NULL
          THEN ${tests.score}::float / NULLIF(${tests.totalQuestions}, 0) * 100
        END
      ), 0)`,
      avgTimeMs: sql<number>`COALESCE(AVG(
        CASE WHEN ${tests.completedAt} IS NOT NULL THEN ${tests.totalTimeMs} END
      ), 0)`,
    })
    .from(tests)
    .groupBy(tests.ageGroup)
    .orderBy(tests.ageGroup);

  // Per age-group timeout + accuracy from answers
  const answerStats = await db
    .select({
      ageGroup: questions.ageGroup,
      totalAnswers: count(),
      correctCount: sql<number>`COUNT(CASE WHEN ${answers.isCorrect} THEN 1 END)`,
      timeoutCount: sql<number>`COUNT(CASE WHEN ${answers.selectedIsPhish} IS NULL THEN 1 END)`,
      avgTimeMs: sql<number>`COALESCE(AVG(${answers.timeTakenMs}), 0)`,
    })
    .from(answers)
    .innerJoin(questions, eq(questions.id, answers.questionId))
    .groupBy(questions.ageGroup)
    .orderBy(questions.ageGroup);

  const ageLabels: Record<string, string> = {
    "6-18": "6--18 (Өсвөр нас)",
    "18-35": "18--35 (Залуу нас)",
    "35-60+": "35--60+ (Насанд хүрэгчид)",
  };

  for (const row of summary) {
    console.log(`  ${row.ageGroup}: ${row.testCount} тест, дундаж ${fmt(Number(row.avgScorePct))}%`);
  }

  // CSV
  writeCsv("age_groups",
    ["age_group", "test_count", "completed", "avg_score_pct", "min_score_pct", "max_score_pct", "avg_time_sec", "total_answers", "correct_pct", "timeout_pct", "avg_answer_time_sec"],
    summary.map((s) => {
      const as = answerStats.find((a) => a.ageGroup === s.ageGroup);
      const correctPct = as && as.totalAnswers > 0 ? (Number(as.correctCount) / as.totalAnswers) * 100 : 0;
      const timeoutPct = as && as.totalAnswers > 0 ? (Number(as.timeoutCount) / as.totalAnswers) * 100 : 0;
      return [
        s.ageGroup,
        String(s.testCount),
        String(Number(s.completedCount)),
        fmt(Number(s.avgScorePct)),
        fmt(Number(s.minScorePct)),
        fmt(Number(s.maxScorePct)),
        fmt(Number(s.avgTimeMs) / 1000),
        String(as?.totalAnswers ?? 0),
        fmt(correctPct),
        fmt(timeoutPct),
        fmt(as ? Number(as.avgTimeMs) / 1000 : 0),
      ];
    }),
  );

  // LaTeX
  const texRows = summary.map((s) => {
    const as = answerStats.find((a) => a.ageGroup === s.ageGroup);
    const correctPct = as && as.totalAnswers > 0 ? (Number(as.correctCount) / as.totalAnswers) * 100 : 0;
    const timeoutPct = as && as.totalAnswers > 0 ? (Number(as.timeoutCount) / as.totalAnswers) * 100 : 0;
    const label = ageLabels[s.ageGroup] ?? s.ageGroup;
    return `    ${label} & ${Number(s.completedCount)} & ${fmt(Number(s.avgScorePct))} & ${fmt(Number(s.minScorePct))}--${fmt(Number(s.maxScorePct))} & ${fmt(Number(s.avgTimeMs) / 1000)} & ${fmt(timeoutPct)} \\\\`;
  }).join("\n");

  const tex = `% Насны бүлгийн харьцуулалт — auto-generated
\\begin{table}[H]
  \\centering
  \\caption{Насны бүлгээр ангилсан тестийн үр дүн}
  \\label{tab:age-groups}
  \\begin{tabular}{l r r r r r}
    \\toprule
    \\textbf{Насны бүлэг} & \\textbf{Тест} & \\textbf{Дундаж (\\%)} & \\textbf{Min--Max (\\%)} & \\textbf{Хугацаа (с)} & \\textbf{Timeout (\\%)} \\\\
    \\midrule
${texRows}
    \\bottomrule
  \\end{tabular}
\\end{table}
`;
  writeTex("age_groups", tex);
}

// ─── Main ──────────────────────────────────────────────────────

async function main() {
  console.log("═══════════════════════════════════════════");
  console.log("  Фишинг IQ Quiz — Статистик шинжилгээ");
  console.log("═══════════════════════════════════════════");

  await analyzeOverview();
  await analyzePrePost();
  await analyzeAgeGroups();

  console.log("\n✅ Бүх шинжилгээ дууслаа!");
  console.log(`   Файлууд: analysis/ хавтаст хадгалагдсан`);
}

main().catch((err) => {
  console.error("❌ Алдаа:", err);
  process.exit(1);
});
