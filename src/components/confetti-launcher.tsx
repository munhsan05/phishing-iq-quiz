"use client";

import { useEffect, useRef } from "react";

import { launchConfetti } from "@/components/confetti";

/**
 * Tiny client wrapper that fires a one-shot confetti burst on mount if
 * `shouldFire` is true. Used by the result page (a server component) to
 * celebrate a high score without pulling the rest of the results UI onto
 * the client.
 *
 * `prefers-reduced-motion` is handled inside `launchConfetti()` itself —
 * the burst is silently skipped when the user prefers reduced motion.
 */
export function ConfettiLauncher({ shouldFire }: { shouldFire: boolean }) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (!shouldFire || firedRef.current) return;
    firedRef.current = true;
    launchConfetti();
  }, [shouldFire]);

  return null;
}
