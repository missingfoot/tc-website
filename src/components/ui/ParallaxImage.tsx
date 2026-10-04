"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef } from "react";

type ParallaxImageProps = Omit<ImageProps, "fill"> & {
  /** How fast the image moves relative to the page: 0 = scrolls normally, 1 = stays fixed. */
  speed?: number;
};

/**
 * A fill image that scrolls slower than the page. Place it inside a positioned,
 * overflow-hidden parent. Turned off for people who prefer reduced motion.
 */
export default function ParallaxImage({ alt, speed = 0.4, className = "", ...props }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const { top, bottom } = el.parentElement!.getBoundingClientRect();
      // Only move while the parent is on screen
      if (bottom < 0 || top > window.innerHeight) return;
      el.style.transform = `translate3d(0, ${-top * speed}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed]);

  return (
    <div ref={ref} className="absolute inset-0 will-change-transform">
      <Image fill alt={alt} className={className} {...props} />
    </div>
  );
}
