import Link from "next/link";
import type { Metadata } from "next";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLeaderboard } from "@/db/queries";
import { AGE_GROUP_ICONS, AGE_GROUP_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Авсан оноо",
  description:
    "Оролцогчдын фишинг илрүүлэх чадварын хэмжилт · ШУТИС ДА-2026.",
};

// ISR — refresh the board every 60s. Fresh enough for a research app.
export const revalidate = 60;

/**
 * Leaderboard page — server component. Ported from the legacy
 * `renderLeaderboard()` in `script.js` (around line 1125). Legacy rendered a
 * 3-slot podium plus a flat row list; we keep the same shape using a table
 * for the full list and a podium for the top 3.
 *
 * Mongolian copy is lifted verbatim from `index.html` leaderboard-screen
 * (title "Авсан оноо", subtitle, empty state, back button) and the
 * `renderLeaderboard()` empty message.
 */
export default async function LeaderboardPage() {
  const rows = await getLeaderboard(20);
  const hasData = rows.length > 0;
  const top3 = rows.slice(0, 3);
  const rest = rows.slice(3);

  return (
    <main className="relative z-10 flex flex-1 flex-col items-center px-4 py-10 sm:px-6 sm:py-14">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            ШУТИС · Кибер аюулгүй байдлын тэнхим · 2026
          </div>
          <h1 className="bg-gradient-to-r from-cyan to-blue-2 bg-clip-text text-transparent text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            <span aria-hidden="true">👑</span> Авсан оноо
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Оролцогчдын фишинг илрүүлэх чадварын хэмжилт · ШУТИС ДА-2026
          </p>
        </div>

        <Card className="bg-[var(--color-navy-2)] ring-1 ring-[var(--color-border-1)] p-5 sm:p-8">
          {!hasData ? (
            // Empty state — copy ported verbatim from legacy `#leaderboard-empty`.
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="text-4xl" aria-hidden="true">
                🔬
              </div>
              <p className="text-base text-muted-foreground">
                Одоохондоо судалгааны өгөгдөл байхгүй байна. Эхлээд туршилт
                хийнэ үү!
              </p>
              <p className="text-sm text-[var(--color-text-3)]">
                Эхний нь та байж магадгүй!
              </p>
            </div>
          ) : (
            <>
              {/* Top 3 podium */}
              {top3.length > 0 ? (
                <div className="mb-6 grid grid-cols-3 items-end gap-3 sm:gap-6">
                  {/* Slot order: silver (1) · gold (0) · bronze (2) — matches legacy */}
                  <PodiumSlot
                    row={top3[1]}
                    rank={2}
                    crown="🥈"
                    heightClass="h-28 sm:h-32"
                    colorClass="from-[rgba(192,192,192,.18)] to-[rgba(192,192,192,.03)] border-[rgba(192,192,192,.3)]"
                    scoreColor="text-[var(--color-text-1)]"
                  />
                  <PodiumSlot
                    row={top3[0]}
                    rank={1}
                    crown="🥇"
                    heightClass="h-36 sm:h-40"
                    colorClass="from-[rgba(251,191,36,.18)] to-[rgba(251,191,36,.03)] border-[rgba(251,191,36,.4)]"
                    scoreColor="text-[var(--color-yellow)]"
                  />
                  <PodiumSlot
                    row={top3[2]}
                    rank={3}
                    crown="🥉"
                    heightClass="h-24 sm:h-28"
                    colorClass="from-[rgba(205,127,50,.18)] to-[rgba(205,127,50,.03)] border-[rgba(205,127,50,.3)]"
                    scoreColor="text-[#cd7f32]"
                  />
                </div>
              ) : null}

              {/* Divider */}
              <div className="my-4 h-px w-full bg-[var(--color-border-1)]" />

              {/* Full list — top 20 as a table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border-1)] text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="px-3 py-2 font-medium">#</th>
                      <th className="px-3 py-2 font-medium">Нэр</th>
                      <th className="hidden px-3 py-2 font-medium sm:table-cell">
                        Насны бүлэг
                      </th>
                      <th className="px-3 py-2 text-right font-medium">
                        Оноо
                      </th>
                      <th className="px-3 py-2 text-right font-medium">
                        Хугацаа
                      </th>
                      <th className="hidden px-3 py-2 text-right font-medium md:table-cell">
                        Огноо
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => {
                      const rank = i + 1;
                      const isTop3 = rank <= 3;
                      return (
                        <tr
                          key={row.testId}
                          className={cn(
                            "border-b border-[var(--color-border-1)] last:border-0 transition-colors hover:bg-[var(--color-surface-1)]",
                            rank === 1 && "bg-[rgba(251,191,36,.04)]",
                            rank === 2 && "bg-[rgba(192,192,192,.04)]",
                            rank === 3 && "bg-[rgba(205,127,50,.04)]",
                          )}
                        >
                          <td className="px-3 py-3 font-mono text-sm">
                            <RankBadge rank={rank} />
                          </td>
                          <td className="px-3 py-3">
                            <div className="font-semibold text-white">
                              {row.name}
                            </div>
                            <div className="font-mono text-[0.65rem] text-muted-foreground sm:hidden">
                              {AGE_GROUP_LABELS[row.ageGroup]}
                            </div>
                          </td>
                          <td className="hidden px-3 py-3 sm:table-cell">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border-1)] bg-[var(--color-surface-1)] px-2.5 py-0.5 text-xs">
                              <span aria-hidden="true">
                                {AGE_GROUP_ICONS[row.ageGroup]}
                              </span>
                              <span className="text-muted-foreground">
                                {AGE_GROUP_LABELS[row.ageGroup]}
                              </span>
                            </span>
                          </td>
                          <td
                            className={cn(
                              "px-3 py-3 text-right font-mono font-bold",
                              isTop3 ? "text-cyan" : "text-white",
                            )}
                          >
                            {row.score}
                            <span className="text-[var(--color-text-3)]">
                              /{row.totalQuestions}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-right font-mono text-muted-foreground">
                            {formatDuration(
                              Math.round(row.totalTimeMs / 1000),
                            )}
                          </td>
                          <td className="hidden px-3 py-3 text-right font-mono text-[0.75rem] text-[var(--color-text-3)] md:table-cell">
                            {formatDate(row.completedAt)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {rest.length === 0 && top3.length > 0 && top3.length < 3 ? (
                <p className="mt-6 text-center font-mono text-xs text-[var(--color-text-3)]">
                  // бусад оролцогчдын өгөгдөл байхгүй байна
                </p>
              ) : null}
            </>
          )}
        </Card>

        {/* Back button */}
        <div className="flex justify-center">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 px-6 text-sm",
            )}
          >
            ← Нүүр хуудас
          </Link>
        </div>
      </div>
    </main>
  );
}

type LeaderboardRowLike = Awaited<ReturnType<typeof getLeaderboard>>[number];

/**
 * Podium slot for the top-3 grid. Height + color variant are driven by the
 * rank so the slots visually echo a podium (gold tallest, then silver and
 * bronze).
 */
function PodiumSlot({
  row,
  rank,
  crown,
  heightClass,
  colorClass,
  scoreColor,
}: {
  row: LeaderboardRowLike | undefined;
  rank: number;
  crown: string;
  heightClass: string;
  colorClass: string;
  scoreColor: string;
}) {
  if (!row) {
    // Preserve the podium shape even if fewer than 3 entries exist.
    return (
      <div
        className={cn(
          "flex items-end justify-center rounded-xl border border-dashed border-[var(--color-border-1)]",
          heightClass,
        )}
        aria-hidden="true"
      >
        <div className="pb-2 text-3xl opacity-30">{crown}</div>
      </div>
    );
  }
  const initial = row.name.trim().charAt(0).toUpperCase() || "?";
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-end rounded-xl border bg-gradient-to-b p-3 text-center",
        colorClass,
        heightClass,
      )}
    >
      <div className="text-2xl sm:text-3xl" aria-hidden="true">
        {crown}
      </div>
      <div
        className={cn(
          "mt-1 flex size-9 items-center justify-center rounded-full border border-[var(--color-border-2)] bg-[var(--color-surface-2)] font-mono text-sm font-bold text-white sm:size-10 sm:text-base",
        )}
        aria-hidden="true"
      >
        {initial}
      </div>
      <div className="mt-1 line-clamp-1 max-w-full text-xs font-semibold text-white sm:text-sm">
        {row.name}
      </div>
      <div
        className={cn(
          "mt-0.5 font-mono text-sm font-bold sm:text-base",
          scoreColor,
        )}
      >
        {row.score}/{row.totalQuestions}
      </div>
      <div className="mt-0.5 font-mono text-[0.6rem] text-[var(--color-text-3)]">
        #{rank}
      </div>
    </div>
  );
}

/**
 * Rank badge — medals for top 3, plain number otherwise.
 */
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span aria-label="1-р байр">🥇</span>;
  if (rank === 2) return <span aria-label="2-р байр">🥈</span>;
  if (rank === 3) return <span aria-label="3-р байр">🥉</span>;
  return (
    <span className="text-[var(--color-text-3)]">
      {String(rank).padStart(2, "0")}
    </span>
  );
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

/**
 * Short Mongolian date formatter — `YYYY/MM/DD`. Kept locale-neutral so
 * there's no server-vs-client hydration drift.
 */
function formatDate(date: Date | null): string {
  if (!date) return "—";
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "—";
  const y = d.getUTCFullYear();
  const m = (d.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = d.getUTCDate().toString().padStart(2, "0");
  return `${y}/${m}/${day}`;
}
