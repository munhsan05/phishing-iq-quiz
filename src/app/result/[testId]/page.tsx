import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfettiLauncher } from "@/components/confetti-launcher";
import { PostTestButton } from "@/components/post-test-button";
import { getTestWithDetails } from "@/db/queries";
import { AGE_GROUP_ICONS, AGE_GROUP_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Үр дүн",
  description: "Таны фишинг IQ тестийн үр дүн.",
};

type PageProps = {
  params: Promise<{ testId: string }>;
};

/**
 * Result page — server component. Unwraps the async `params` (Next.js 16),
 * loads the test + user + answers via `getTestWithDetails`, and 404s if the
 * row is missing.
 *
 * Copy & score bands are ported from the legacy `script.js` renderResults()
 * function (around lines 1067-1110). Legacy thresholds were raw counts out
 * of 10; here we translate them to percentages so they work with the three
 * age-group question counts (10 / 15 / 16).
 *
 * The `<ConfettiLauncher>` client wrapper fires a single burst on mount if
 * the user's percentage is >= 70 (legacy "Дунджаас дээгүүр" band floor).
 */
export default async function ResultPage({ params }: PageProps) {
  const { testId } = await params;
  const data = await getTestWithDetails(testId);
  if (!data) notFound();

  const { test, user, answers: rows } = data;
  const total = test.totalQuestions;
  const score = test.score;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const totalSeconds = Math.round(test.totalTimeMs / 1000);
  const band = getScoreBand(pct);

  // Derived stat cards — ported from legacy stat-grid (correct / wrong /
  // phish-caught / avg time).
  const wrong = rows.filter((r) => !r.answer.isCorrect).length;
  const phishCaught = rows.filter(
    (r) => r.question.isPhish && r.answer.isCorrect,
  ).length;
  const avgSeconds =
    rows.length > 0
      ? Math.round(
          rows.reduce((sum, r) => sum + r.answer.timeTakenMs, 0) /
            rows.length /
            1000,
        )
      : 0;

  return (
    <>
      <ConfettiLauncher shouldFire={pct >= 70} />
      <main className="relative z-10 flex flex-1 flex-col items-center px-4 py-10 sm:px-6 sm:py-14">
        <div className="w-full max-w-3xl space-y-6">
          {/* Hero card */}
          <Card className="bg-[var(--color-navy-2)] ring-1 ring-[var(--color-border-1)] p-6 sm:p-8">
            <div className="flex flex-col items-center text-center">
              <div className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                ШУТИС · Туршилтын үр дүн
              </div>
              <h1 className="bg-gradient-to-r from-cyan to-blue-2 bg-clip-text text-transparent text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                {band.title}
              </h1>
              <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
                {band.subtitle}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span>
                  <span aria-hidden="true">👤</span>{" "}
                  <span className="font-semibold text-white">{user.name}</span>
                </span>
                <span>
                  <span aria-hidden="true">{AGE_GROUP_ICONS[user.ageGroup]}</span>{" "}
                  {AGE_GROUP_LABELS[user.ageGroup]}
                </span>
                <span>
                  <span aria-hidden="true">⏱</span> Нийт:{" "}
                  <span className="font-mono text-white">
                    {formatDuration(totalSeconds)}
                  </span>
                </span>
              </div>

              {/* Score ring — big percent */}
              <div className="mt-8 flex flex-col items-center">
                <div className="font-mono text-6xl font-extrabold text-white sm:text-7xl">
                  {score}
                  <span className="text-[var(--color-text-2)]">/{total}</span>
                </div>
                <div className="mt-1 text-sm uppercase tracking-wider text-cyan">
                  {pct}% зөв
                </div>
              </div>

              {/* Test type indicator */}
              {test.testType === "pre" && (
                <div className="mt-4 rounded-lg bg-blue-2/10 px-4 py-2 text-sm text-blue-2">
                  📋 Энэ бол <strong>Pre-test</strong> үр дүн. Доорх тайлбар, зөвлөмжийг анхааралтай уншаад Post-test өгнө үү.
                </div>
              )}
              {test.testType === "post" && (
                <div className="mt-4 rounded-lg bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
                  📊 <strong>Post-test</strong> дууслаа! Харьцуулалт харах товч дээр дарж сайжрал харна уу.
                </div>
              )}
            </div>
          </Card>

          {/* Stat grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              value={String(score)}
              label="✅ Зөв ангилал"
              color="text-[var(--color-green)]"
            />
            <StatCard
              value={String(wrong)}
              label="❌ Буруу ангилал"
              color="text-[var(--color-red)]"
            />
            <StatCard
              value={String(phishCaught)}
              label="🎣 Фишинг таних"
              color="text-blue-2"
            />
            <StatCard
              value={`${avgSeconds}с`}
              label="⚡ Дундаж хугацаа"
              color="text-[var(--color-yellow)]"
            />
          </div>

          {/* Research note — ported verbatim from legacy results-screen */}
          <div className="rounded-xl border border-[rgba(26,108,246,.18)] bg-[rgba(26,108,246,.06)] px-5 py-4 font-mono text-[0.78rem] leading-relaxed text-muted-foreground">
            <span aria-hidden="true">📋</span>{" "}
            <strong className="text-blue-2">Судалгааны тэмдэглэл</strong>
            <br />
            Таны хариулт ШУТИС-ийн дипломын ажлын өгөгдлийн санд нэрийгүй
            хэлбэрээр хадгалагдана. Насны бүлэг болон хариулах хугацааны
            дунджийг фишинг илрүүлэх чадварын регрессийн загварт ашиглана. Эх
            сурвалж: APWG 2025, Proofpoint Threat Report 2024.
          </div>

          {/* Detail panel */}
          <Card className="bg-[var(--color-navy-2)] ring-1 ring-[var(--color-border-1)] p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {/* ТУРШИЛТЫН ДЭЛГЭРЭНГҮЙ ҮР ДҮН */}
              </h2>
              <span className="text-xs text-muted-foreground">
                {rows.length} асуулт
              </span>
            </div>

            <ol className="space-y-3">
              {rows.map((row, i) => {
                const a = row.answer;
                const q = row.question;
                const chosenLabel =
                  a.selectedIsPhish === null
                    ? "⏰ Хугацаа дуусав"
                    : a.selectedIsPhish
                      ? "🎣 Фишинг"
                      : "✅ Жинхэнэ";
                const correctLabel = q.isPhish ? "🎣 Фишинг" : "✅ Жинхэнэ";
                return (
                  <li
                    key={a.id}
                    className={cn(
                      "rounded-xl border p-4",
                      a.isCorrect
                        ? "border-[rgba(0,229,160,.25)] bg-[rgba(0,229,160,.05)]"
                        : "border-[rgba(255,61,90,.25)] bg-[rgba(255,61,90,.05)]",
                    )}
                  >
                    {/* Header row */}
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-2">
                        <span className="font-mono text-xs text-muted-foreground">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          aria-hidden="true"
                          className="text-lg leading-none"
                        >
                          {a.isCorrect ? "✅" : "❌"}
                        </span>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-white">
                            {q.emailSubject}
                          </div>
                          <div className="truncate font-mono text-xs text-muted-foreground">
                            {q.emailFrom}
                          </div>
                        </div>
                      </div>
                      <span className="shrink-0 font-mono text-xs text-muted-foreground">
                        ⏱ {Math.round(a.timeTakenMs / 1000)}с
                      </span>
                    </div>

                    {/* Answer comparison */}
                    <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-[var(--color-surface-1)] px-3 py-2">
                        <div className="mb-0.5 text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                          Таны хариулт
                        </div>
                        <div
                          className={cn(
                            "font-semibold",
                            a.isCorrect
                              ? "text-[var(--color-green)]"
                              : "text-[var(--color-red)]",
                          )}
                        >
                          {chosenLabel}
                        </div>
                      </div>
                      <div className="rounded-lg bg-[var(--color-surface-1)] px-3 py-2">
                        <div className="mb-0.5 text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                          Зөв хариулт
                        </div>
                        <div className="font-semibold text-[var(--color-green)]">
                          {correctLabel}
                        </div>
                      </div>
                    </div>

                    {/* Explanation + recommendation */}
                    <div className="space-y-2 text-sm leading-relaxed">
                      <div>
                        <span
                          aria-hidden="true"
                          className="mr-1.5 text-cyan"
                        >
                          💡
                        </span>
                        <span className="text-[var(--color-text-1)]">
                          {q.explanation}
                        </span>
                      </div>
                      <div>
                        <span
                          aria-hidden="true"
                          className="mr-1.5 text-[var(--color-yellow)]"
                        >
                          🛡
                        </span>
                        <span className="text-[var(--color-text-2)]">
                          {q.recommendation}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Card>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            {test.testType === "pre" && test.experimentId ? (
              <>
                <Link
                  href="/"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-12 flex-1 text-base",
                  )}
                >
                  ↩ Нүүр хуудас
                </Link>
                <PostTestButton
                  experimentId={test.experimentId}
                  name={user.name}
                  ageGroup={test.ageGroup}
                />
              </>
            ) : test.testType === "post" && test.experimentId ? (
              <>
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
                  href={`/comparison/${test.experimentId}`}
                  className={cn(
                    buttonVariants({ variant: "default", size: "lg" }),
                    "h-12 flex-1 bg-gradient-to-r from-blue to-cyan text-base text-white shadow-[0_8px_24px_rgba(26,108,246,0.35)]",
                  )}
                >
                  📊 Харьцуулалт харах
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-12 flex-1 text-base",
                  )}
                >
                  ↩ Дахин тест өгөх
                </Link>
                <Link
                  href="/leaderboard"
                  className={cn(
                    buttonVariants({ variant: "default", size: "lg" }),
                    "h-12 flex-1 bg-gradient-to-r from-blue to-cyan text-base text-white shadow-[0_8px_24px_rgba(26,108,246,0.35)]",
                  )}
                >
                  👑 Leaderboard харах
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

/**
 * Small stat card used in the 4-up grid. Mirrors legacy `.stat-card`.
 */
function StatCard({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border-1)] bg-[var(--color-navy-2)] px-4 py-3 text-center">
      <div className={cn("font-mono text-2xl font-bold", color)}>{value}</div>
      <div className="mt-1 text-[0.68rem] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

/**
 * Score band labels — ported verbatim from legacy `script.js` renderResults()
 * (around lines 1067-1082). Legacy thresholds were raw counts out of 10;
 * here we translate to percentages so the bands apply uniformly across the
 * three age-group question counts.
 *
 *   100%     → Мэргэжилтний түвшин
 *    >= 90%  → Дээд чадварын бүлэг
 *    >= 70%  → Дунджаас дээгүүр
 *    >= 50%  → Дундаж чадварын бүлэг
 *    <  50%  → Доод чадварын бүлэг
 */
function getScoreBand(pct: number): { title: string; subtitle: string } {
  if (pct >= 100) {
    return {
      title: "🏆 Мэргэжилтний түвшин",
      subtitle:
        "Бүх сценарийг зөв ангилсан. Танд фишинг илрүүлэх өндөр чадвар байна — судалгааны үр дүнгийн дээд бүлэгт оров.",
    };
  }
  if (pct >= 90) {
    return {
      title: "🥇 Дээд чадварын бүлэг",
      subtitle:
        "Туршилтын 90%+ зөв — танд кибер аюулгүй байдлын мэдлэг хангалттай хөгжсөн байна.",
    };
  }
  if (pct >= 70) {
    return {
      title: "🎯 Дунджаас дээгүүр",
      subtitle:
        "Ихэнх сценарийг зөв таньсан. Зарим нарийн халдлагын шинж тэмдэг дутуу ажиглагдлаа — нэмэлт дадлага шаардлагатай.",
    };
  }
  if (pct >= 50) {
    return {
      title: "⚠️ Дундаж чадварын бүлэг",
      subtitle:
        "Хагас сценарийг зөв ангилав. Фишинг халдлагын шинж тэмдгийг таних чадварыг хөгжүүлэх шаардлагатай байна.",
    };
  }
  return {
    title: "🚨 Доод чадварын бүлэг",
    subtitle:
      "Судалгааны үр дүнгийн доод бүлэгт орлоо. Кибер аюулгүй байдлын мэдлэгийг эрс нэмэгдүүлэх шаардлагатай.",
  };
}

/**
 * Format a positive integer number of seconds as `m:ss` (or `h:mm:ss`).
 */
function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  if (h > 0) return `${h}:${pad(m)}:${pad(sec)}`;
  return `${m}:${pad(sec)}`;
}
