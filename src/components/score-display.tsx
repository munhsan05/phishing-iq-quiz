"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Final score (0-100 or 0-totalQuestions). */
  value: number;
  /** Suffix to render after the number (e.g. "%" or "/10"). */
  suffix?: string;
  /** Fire confetti when animation completes if score ≥ this. */
  confettiThreshold?: number;
  /** Animation duration in ms. */
  duration?: number;
  className?: string;
};

export function ScoreDisplay({
  value,
  suffix = "",
  confettiThreshold = 70,
  duration = 1200,
  className,
}: Props) {
  const [display, setDisplay] = useState(0);
  const firedRef = useRef(false);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(value);
        if (!firedRef.current && value >= confettiThreshold) {
          firedRef.current = true;
          import("canvas-confetti").then(({ default: confetti }) => {
            confetti({
              particleCount: 120,
              spread: 80,
              startVelocity: 35,
              origin: { x: 0.5, y: 0.3 },
              colors: ["#06b6d4", "#0891b2", "#22d3ee", "#fbbf24", "#10b981"],
            });
          });
        }
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, confettiThreshold]);

  return (
    <span className={className}>
      {display}
      {suffix}
    </span>
  );
}
