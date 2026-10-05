"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CircleImage } from "@/lib/types";
import type { SectionTone } from "@/components/ui/Section";
import { sizes2x } from "@/lib/images";

type Key = "main" | "top" | "bottom";
type CircleCollageProps = {
  images: Record<Key, CircleImage>;
  /** The background it sits on: rings are cream on white, white on cream, so they always show. */
  tone?: SectionTone;
};

// Positions from the Figma "Frame 81" (409 × 554.58). Every circle is laid out at the large
// (hovered) size, 335px = 81.92% of the frame, centred where its photo sits in the design,
// and scaled down from there.
const FRAME_RATIO = "409 / 554.58";
const CIRCLE_WIDTH = 81.92;
const POSITIONS: Record<Key, { left: number; top: number; z: number }> = {
  main: { left: -5.65, top: 17.916, z: 1 },
  bottom: { left: 35.87, top: 45.0, z: 2 },
  top: { left: 37.43, top: -6.145, z: 3 },
};

const SCALE = { idle: 0.72, active: 0.9, shrunk: 0.6 };
// Rings around the hovered photo, as multiples of its size (a little tighter than the design's
// 452.9px / 575.37px rings). See-through so they stay subtle over the neighbouring photos.
const RINGS = [
  { className: { white: "bg-cream/25", cream: "bg-white/30" }, scale: 1.55, delay: "90ms" },
  { className: { white: "bg-cream/45", cream: "bg-white/55" }, scale: 1.27, delay: "0ms" },
];
const DURATION = 900; // ms
// Damped spring: overshoots ~15% and wobbles to rest, for a bubbly, blobby feel.
const SPRING =
  "linear(0, 0.009, 0.035 2.1%, 0.141, 0.281 6.7%, 0.723 12.9%, 0.938 16.7%, 1.017, 1.077, 1.121, 1.149 24.3%, 1.159, 1.163, 1.161, 1.154 29.9%, 1.129 32.8%, 1.051 39.6%, 1.017 43.1%, 0.991, 0.977 51%, 0.974 53.8%, 0.975 57.1%, 0.997 69.8%, 1.003 76.9%, 1)";

/**
 * Three photos in bubbles. At rest they're the same size; hovering one (with a
 * mouse) grows it to full size with layered rings (cream, or white on a cream background) while the others shrink back. The
 * hovered photo rises to the front as it grows and stays there until it has shrunk again,
 * so the layering never jumps. Sizes change on a springy curve and the photos drift and
 * breathe like bubbles. Touch screens and reduced motion get the resting state.
 */
export default function CircleCollage({ images, tone = "white" }: CircleCollageProps) {
  const [active, setActive] = useState<Key | null>(null);
  // The photo that was last active stays above the others while it shrinks back.
  const [leaving, setLeaving] = useState<Key | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const activate = (key: Key | null) => {
    if (key === active) return;
    clearTimeout(leaveTimer.current);
    setLeaving(active);
    setActive(key);
    leaveTimer.current = setTimeout(() => setLeaving(null), DURATION);
  };
  useEffect(() => () => clearTimeout(leaveTimer.current), []);

  return (
    // isolate: keeps the photos' z-index layering inside the collage, so rings never cover the text
    <div className="relative isolate w-full" style={{ aspectRatio: FRAME_RATIO }}>
      {(Object.keys(POSITIONS) as Key[]).map((key, i) => {
        const pos = POSITIONS[key];
        const isActive = active === key;
        const scale = isActive ? SCALE.active : active ? SCALE.shrunk : SCALE.idle;
        return (
          <div
            key={key}
            className="absolute aspect-square motion-reduce:!transition-none"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              width: `${CIRCLE_WIDTH}%`,
              zIndex: isActive ? 20 : leaving === key ? 10 : pos.z,
              transform: `scale(${scale})`,
              transition: `transform ${DURATION}ms ${SPRING}`,
            }}
          >
            {/* Drift on an inner wrapper so it doesn't fight the scale transition */}
            <div
              className="relative size-full motion-reduce:!animate-none"
              style={{ animation: `bubble ${6 + i * 1.5}s ease-in-out ${-2 * i}s infinite` }}
            >
              {RINGS.map((ring) => (
                <div
                  key={ring.scale}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-full motion-reduce:!transition-none"
                  style={{
                    transform: `scale(${isActive ? ring.scale : 1})`,
                    opacity: isActive ? 1 : 0,
                    transition: `transform ${DURATION}ms ${SPRING}, opacity ${DURATION / 3}ms ease-out`,
                    transitionDelay: isActive ? ring.delay : "0ms",
                  }}
                >
                  <div className={`size-full rounded-full ${ring.className[tone]}`} />
                </div>
              ))}
              <div
                className="relative size-full overflow-hidden rounded-full bg-cream"
                // Pointer events, not CSS :hover, so a tap on a touch screen doesn't leave it enlarged
                onPointerEnter={(e) => e.pointerType === "mouse" && activate(key)}
                onPointerLeave={(e) => e.pointerType === "mouse" && activate(null)}
              >
                <Image
                  src={images[key].src}
                  alt={images[key].alt}
                  fill
                  // Laid out at the full 335px circle; cover-cropping needs ~1.5× its width
                  sizes={sizes2x(["(min-width: 1024px)", "504px"], [null, "105vw"])}
                  quality={90}
                  className="object-cover"
                  style={{ objectPosition: images[key].position ?? "center" }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
