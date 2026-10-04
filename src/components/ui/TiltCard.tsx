"use client";

import { useRef, type ReactNode } from "react";

const MAX_TILT = 5; // degrees
const LIFT = 1.02;

/**
 * Tilts its content subtly toward the mouse in 3D and lifts it slightly, easing back flat
 * when the mouse leaves. Mouse only (no effect on touch) and off for reduced motion.
 */
export default function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || reduced()) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5; // -0.5 … 0.5
    const y = (e.clientY - r.top) / r.height - 0.5;
    // Quick follow while moving; the slower ease is for settling back on leave
    el.style.transitionDuration = "150ms";
    el.style.transform = `perspective(900px) rotateX(${(-y * 2 * MAX_TILT).toFixed(2)}deg) rotateY(${(x * 2 * MAX_TILT).toFixed(2)}deg) scale(${LIFT})`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transitionDuration = "600ms";
    el.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`transition-transform ease-out will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}
