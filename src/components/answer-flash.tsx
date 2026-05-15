"use client";

import { useEffect, useState } from "react";

type Verdict = "correct" | "wrong" | "timeout";

type Props = {
  /** Cycle key — set to a new value to trigger flash. */
  trigger: number;
  /** Which color/animation to play. */
  verdict: Verdict | null;
};

/**
 * Full-screen colored overlay that fades in then out (~700ms).
 * Wrong/timeout also fires navigator.vibrate(200) on supporting devices.
 */
export function AnswerFlash({ trigger, verdict }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!verdict || trigger === 0) return;
    setVisible(true);

    // Haptic on wrong/timeout
    if (
      verdict !== "correct" &&
      typeof navigator !== "undefined" &&
      "vibrate" in navigator
    ) {
      try {
        navigator.vibrate(verdict === "wrong" ? [120, 60, 120] : [200]);
      } catch {
        // Some browsers throw on iOS Safari — silent fail OK.
      }
    }

    const t = setTimeout(() => setVisible(false), 700);
    return () => clearTimeout(t);
  }, [trigger, verdict]);

  if (!verdict || !visible) return null;

  const color =
    verdict === "correct"
      ? "bg-emerald-400/35"
      : verdict === "wrong"
        ? "bg-red-500/35"
        : "bg-amber-400/35"; // timeout

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-50 ${color} animate-flash-fade`}
    />
  );
}
