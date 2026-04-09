"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type QuestionTimerProps = {
  /** Total time in seconds for the current question. */
  durationSec: number;
  /** Called when the timer hits 0. Parent should submit a `null` answer. */
  onExpire: () => void;
  /**
   * Changing this key resets the timer back to `durationSec`. Typically the
   * current question id or index.
   */
  resetKey: string | number;
  /** Pause the countdown (e.g. while a feedback modal is shown). */
  paused?: boolean;
};

/**
 * Countdown timer for a single question.
 *
 * Renders a horizontal progress bar plus a numeric "X сек" label.
 * The bar colour transitions cyan → yellow → red as time runs low, mirroring
 * the legacy `.timer-ring` behaviour in `script.js`.
 *
 * Runs at 100ms resolution for smooth animation, then calls `onExpire()`
 * exactly once when the remaining time reaches 0.
 */
export function QuestionTimer({
  durationSec,
  onExpire,
  resetKey,
  paused = false,
}: QuestionTimerProps) {
  const durationMs = durationSec * 1000;
  const [remainingMs, setRemainingMs] = useState(durationMs);
  const expireRef = useRef(onExpire);

  // Keep the latest onExpire callback without restarting the interval.
  useEffect(() => {
    expireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    // Reset whenever the question changes or the duration changes.
    setRemainingMs(durationMs);
  }, [resetKey, durationMs]);

  useEffect(() => {
    if (paused) return;

    const startedAt = Date.now();
    const initial = remainingMs;
    let fired = false;

    const id = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const next = Math.max(0, initial - elapsed);
      setRemainingMs(next);
      if (next <= 0 && !fired) {
        fired = true;
        window.clearInterval(id);
        expireRef.current();
      }
    }, 100);

    return () => {
      window.clearInterval(id);
    };
    // We intentionally depend on resetKey + paused so the interval restarts
    // cleanly on each new question / resume. `remainingMs` deliberately
    // excluded — we re-init from the reset effect above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey, paused, durationMs]);

  const remainingSec = Math.ceil(remainingMs / 1000);
  const ratio = Math.max(0, Math.min(1, remainingMs / durationMs));
  const percent = ratio * 100;

  // Colour thresholds: >50% cyan, 20-50% yellow, <20% red.
  const colour =
    ratio > 0.5 ? "cyan" : ratio > 0.2 ? "yellow" : "red";

  const barClass =
    colour === "cyan"
      ? "bg-cyan shadow-[0_0_12px_rgba(6,214,245,0.6)]"
      : colour === "yellow"
        ? "bg-yellow shadow-[0_0_12px_rgba(251,191,36,0.6)]"
        : "bg-red shadow-[0_0_14px_rgba(255,61,90,0.7)] animate-pulse";

  const textClass =
    colour === "cyan"
      ? "text-cyan"
      : colour === "yellow"
        ? "text-yellow"
        : "text-red";

  return (
    <div
      className="flex w-full flex-col gap-2"
      role="timer"
      aria-live="polite"
      aria-label={`Үлдсэн хугацаа: ${remainingSec} секунд`}
    >
      <div className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground">
        <span>⏱ Хугацаа</span>
        <span className={cn("font-mono text-lg font-bold", textClass)}>
          {remainingSec} сек
        </span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-100 ease-linear",
            barClass,
          )}
          style={{ width: `${percent}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
