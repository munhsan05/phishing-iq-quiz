"use client";

import { useEffect, useRef } from "react";
import {
  CANVAS_NODE_COUNT,
  CANVAS_LINK_DISTANCE,
} from "@/lib/constants";

/**
 * Animated constellation canvas background.
 * Faithful port of the `bg-canvas` IIFE in legacy `script.js` (lines 12-115):
 *   - 40 nodes with random position, velocity, radius, opacity
 *   - Each node is either cyan (#06d6f5) or blue (#1a6cf6)
 *   - Draws connecting lines between nodes closer than CANVAS_LINK_DISTANCE (160px)
 *   - Bounces nodes off viewport edges
 *   - Runs at requestAnimationFrame
 *
 * Rendering:
 *   - Fixed position, behind all content (#bg-canvas CSS in globals.css)
 *   - Honors `prefers-reduced-motion: reduce` — skips RAF loop and leaves
 *     a static radial gradient (applied via CSS @media rule).
 */

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  opacity: number;
  color: "cyan" | "blue";
};

export function CanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Respect user's reduced-motion preference — render a single static frame
    // and bail out of the animation loop.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let rafId = 0;
    const nodes: Node[] = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initNodes = () => {
      nodes.length = 0;
      for (let i = 0; i < CANVAS_NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          // Legacy velocity range: (-0.175, 0.175) from `(Math.random() - .5) * .35`
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          // Legacy radius: 0.5–2.0 from `Math.random() * 1.5 + .5`
          r: Math.random() * 1.5 + 0.5,
          // Legacy opacity: 0.2–0.7 from `Math.random() * .5 + .2`
          opacity: Math.random() * 0.5 + 0.2,
          // Legacy color mix: ~40% cyan, ~60% blue (`Math.random() > .6`)
          color: Math.random() > 0.6 ? "cyan" : "blue",
        });
      }
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);

      // Connecting lines: iterate unique node pairs, draw fading blue line
      // when their Euclidean distance is under CANVAS_LINK_DISTANCE (160px).
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CANVAS_LINK_DISTANCE) {
            const alpha = (1 - dist / CANVAS_LINK_DISTANCE) * 0.15;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(26, 108, 246, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw and move nodes.
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle =
          n.color === "cyan"
            ? `rgba(6, 214, 245, ${n.opacity})`
            : `rgba(26, 108, 246, ${n.opacity})`;
        ctx.fill();

        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }
    };

    const step = () => {
      drawFrame();
      rafId = window.requestAnimationFrame(step);
    };

    // Initial setup.
    resize();
    initNodes();

    if (prefersReducedMotion) {
      // Render one static frame; skip the animation loop. The CSS
      // @media (prefers-reduced-motion: reduce) rule in globals.css
      // also paints a fallback gradient on #bg-canvas.
      drawFrame();
    } else {
      step();
    }

    const onResize = () => {
      resize();
      initNodes();
      if (prefersReducedMotion) drawFrame();
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas id="bg-canvas" ref={canvasRef} aria-hidden="true" />;
}
