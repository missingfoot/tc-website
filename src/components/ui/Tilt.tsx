"use client";

import { useRef, type ReactNode } from "react";

type TiltProps = {
  children: ReactNode;
  /** Furthest it leans each way, in degrees. */
  max?: number;
  className?: string;
};

/**
 * Leans its content towards the mouse in 3D, as if it were a card held under the pointer, and
 * settles back flat when the mouse leaves. Mouse only (touch screens get it flat), and off for
 * people who prefer reduced motion. The pointer is tracked on an outer wrapper that never moves,
 * so the leaning edges can't slip out from under the mouse and make it jitter.
 */
export default function Tilt({ children, max = 6, className = "" }: TiltProps) {
  const inner = useRef<HTMLDivElement>(null);

  const lean = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = inner.current;
    if (!el || e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    // -0.5 to 0.5 across the box, from its centre
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    el.style.transform = `perspective(1200px) rotateX(${-y * max * 2}deg) rotateY(${x * max * 2}deg) scale(1.02)`;
  };
  const settle = () => {
    if (inner.current) inner.current.style.transform = "";
  };

  return (
    <div className={className} onPointerMove={lean} onPointerLeave={settle}>
      <div ref={inner} className="transition-transform duration-500 ease-out will-change-transform motion-reduce:transition-none">
        {children}
      </div>
    </div>
  );
}
