"use client";

import { useEffect, useRef } from "react";

// Stars: fixed pseudo-random positions (seeded, so every visit shows the same sky). Each is a
// small white dot that twinkles on its own rhythm; about one in eight is a brighter star with a
// glow that never fades out fully.
const STAR_COUNT = 110;
const stars = (() => {
  let seed = 7;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: STAR_COUNT }, () => {
    const star = {
      left: rand() * 100,
      top: rand() * 100,
      size: rand() < 0.8 ? 2 : 3,
      opacity: 0.3 + rand() * 0.5,
      duration: 2 + rand() * 4,
      delay: -rand() * 6,
      bright: rand() < 0.12,
    };
    // Opacity range while twinkling, and the still opacity for reduced motion
    return star.bright
      ? { ...star, size: 3, dim: 0.55, lit: 1, still: 1 }
      : { ...star, dim: 0.15, lit: 0.9, still: star.opacity };
  });
})();

// The bright stars' glow: stacked halos, each wider and fainter, drawn once and stamped per star
const GLOW_RADIUS = 18;
function drawGlow(scale: number) {
  const size = Math.ceil(GLOW_RADIUS * 2 * scale);
  const glow = document.createElement("canvas");
  glow.width = glow.height = size;
  const ctx = glow.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  // Matched by eye to the CSS glow it replaced: box-shadows of 2px, 6px and 14px blur
  for (const [offset, alpha] of [[0, 1], [0.07, 0.9], [0.13, 0.5], [0.22, 0.2], [0.4, 0.06], [0.7, 0.015], [1, 0]]) {
    gradient.addColorStop(offset, `rgb(255 255 255 / ${alpha})`);
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return glow;
}

// Twinkling is slow, so 30fps looks the same as 60 for half the work
const FRAME_MS = 1000 / 30;

/**
 * A twinkling star field that fills its positioned parent. Drawn on one canvas rather than as
 * animated elements: on iPhones, 100+ separately animated dots each became a layer, and together
 * they ran Safari out of layer memory (parts of the page stopped drawing). Only animates while on
 * screen, and is still for people who prefer reduced motion.
 */
export default function StarField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Capped at 2x: the dots are tiny, and a 3x canvas would take over twice the memory
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    const glow = drawGlow(scale);
    let width = 0;
    let height = 0;

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const star of stars) {
        // Same rhythm as a CSS ease-in-out twinkle: dim → lit → dim over its duration
        const phase = (time / 1000 - star.delay) / star.duration;
        const opacity = still ? star.still : star.dim + (star.lit - star.dim) * (0.5 - 0.5 * Math.cos(phase * 2 * Math.PI));
        const x = ((star.left / 100) * width + star.size / 2) * scale;
        const y = ((star.top / 100) * height + star.size / 2) * scale;
        ctx.globalAlpha = opacity;
        if (star.bright) ctx.drawImage(glow, x - glow.width / 2, y - glow.height / 2);
        ctx.beginPath();
        ctx.arc(x, y, (star.size / 2) * scale, 0, 2 * Math.PI);
        ctx.fill();
      }
    };

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      ctx.fillStyle = "#fff";
      draw(performance.now());
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    if (still) return () => resizeObserver.disconnect();

    let frame = 0;
    let last = 0;
    const tick = (time: number) => {
      frame = requestAnimationFrame(tick);
      if (time - last < FRAME_MS) return;
      last = time;
      draw(time);
    };
    const visibility = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      frame = entry.isIntersecting ? requestAnimationFrame(tick) : 0;
    });
    visibility.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibility.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`absolute inset-0 size-full ${className}`} />;
}
