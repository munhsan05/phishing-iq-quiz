"use client";

import { useEffect, useRef } from "react";

/**
 * Canvas confetti burst — hand-rolled port of the legacy `launchConfetti()`
 * function from `script.js` (around line 1188).
 *
 * Legacy created 60 DOM elements with a CSS keyframe `confettiFall` that
 * drops from `-10px` to `100vh` while rotating 720deg over 1.5–4s with a
 * random delay of 0–0.8s. Colors came from the palette
 * `['#fbbf24', '#06d6f5', '#00e5a0', '#1a6cf6', '#ff3d5a', '#a78bfa']`.
 *
 * This React port reproduces the same visual feel on a single `<canvas>`:
 *   - 60 rectangular particles (4–12px), half rounded via circle draw
 *   - colors from the legacy palette (cyan / blue / gold / green / red / violet)
 *   - gravity-driven fall + rotation + fade-out at bottom
 *   - random per-particle delay (0–0.8s) to stagger the burst
 *
 * The `<ConfettiLauncher>` client wrapper (see `confetti-launcher.tsx`) calls
 * the exported imperative `launchConfetti()` once on mount. Respects
 * `prefers-reduced-motion` and skips the burst silently in that case.
 */

const COLORS = [
  "#fbbf24", // gold
  "#06d6f5", // cyan
  "#00e5a0", // green
  "#1a6cf6", // blue
  "#ff3d5a", // red
  "#a78bfa", // violet
];

const PARTICLE_COUNT = 60;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotSpeed: number;
  delayMs: number;
  shape: "square" | "circle";
  lifeMs: number;
  ageMs: number;
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

/**
 * Fire a confetti burst imperatively. Creates a transient canvas pinned to
 * the viewport, runs the animation, then cleans up.
 */
export function launchConfetti(): void {
  if (typeof window === "undefined") return;
  if (prefersReducedMotion()) return;

  // Remove any previous canvas from a prior burst.
  document
    .querySelectorAll<HTMLCanvasElement>("canvas[data-confetti]")
    .forEach((c) => c.remove());

  const canvas = document.createElement("canvas");
  canvas.setAttribute("data-confetti", "");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";
  document.body.appendChild(canvas);

  const dpr = window.devicePixelRatio || 1;
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }
  ctx.scale(dpr, dpr);

  const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => {
    const size = 4 + Math.random() * 8; // 4–12px
    return {
      x: Math.random() * w,
      y: -10 - Math.random() * 40,
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 3.5,
      size,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.4,
      delayMs: Math.random() * 800, // 0–0.8s stagger (legacy animation-delay)
      shape: Math.random() > 0.5 ? "circle" : "square",
      // Legacy animation-duration: 1.5–4s. We use the upper bound plus a
      // little runway so slow particles still reach the bottom.
      lifeMs: 1500 + Math.random() * 2500,
      ageMs: 0,
    };
  });

  let raf = 0;
  let lastTs = performance.now();
  const startedAt = lastTs;

  // Safety cap — kill the burst after 6s even if some particles linger.
  const MAX_DURATION_MS = 6000;

  function step(ts: number) {
    if (!ctx) return;
    const dt = Math.min(40, ts - lastTs); // clamp at 40ms to avoid big jumps
    lastTs = ts;
    const elapsed = ts - startedAt;

    ctx.clearRect(0, 0, w, h);

    let alive = false;
    for (const p of particles) {
      if (elapsed < p.delayMs) {
        alive = true;
        continue;
      }
      p.ageMs += dt;
      if (p.ageMs > p.lifeMs) continue;
      alive = true;

      // Physics — fall + slight horizontal drift + gravity.
      p.x += p.vx * (dt / 16.67);
      p.y += p.vy * (dt / 16.67);
      p.vy += 0.06 * (dt / 16.67);
      p.rotation += p.rotSpeed * (dt / 16.67);

      // Fade out near the end of life.
      const lifeT = p.ageMs / p.lifeMs;
      const alpha = lifeT > 0.8 ? Math.max(0, 1 - (lifeT - 0.8) / 0.2) : 1;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      if (p.shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      }
      ctx.restore();
    }

    if (alive && elapsed < MAX_DURATION_MS) {
      raf = requestAnimationFrame(step);
    } else {
      cancelAnimationFrame(raf);
      canvas.remove();
    }
  }

  raf = requestAnimationFrame(step);
}

/**
 * Reactive component variant — fires a burst each time `trigger` flips from
 * false → true (or is true on mount). Cleans up on unmount.
 *
 * Most callers should use the imperative `launchConfetti()` via
 * `<ConfettiLauncher shouldFire={...} />`, but this component is exported
 * for anyone who prefers a declarative API.
 */
export function Confetti({ trigger }: { trigger: boolean }) {
  const lastTriggerRef = useRef(false);

  useEffect(() => {
    if (trigger && !lastTriggerRef.current) {
      launchConfetti();
    }
    lastTriggerRef.current = trigger;
  }, [trigger]);

  useEffect(() => {
    return () => {
      // Clean up any canvas left behind if the component unmounts mid-burst.
      if (typeof document === "undefined") return;
      document
        .querySelectorAll<HTMLCanvasElement>("canvas[data-confetti]")
        .forEach((c) => c.remove());
    };
  }, []);

  return null;
}
