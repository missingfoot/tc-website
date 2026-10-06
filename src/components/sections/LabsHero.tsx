import type { CSSProperties } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { curvedMask } from "@/components/sections/Hero";

type LabsHeroProps = {
  title: string;
  subtitle: string;
  /** Shorter versions for phones (below lg), where the full text covers too much of the hero */
  shortTitle?: string;
  shortSubtitle?: string;
  cta: { label: string; href: string };
};

// Stars: fixed pseudo-random positions (seeded, so the server and browser render the same dots).
// Each is a small white dot that twinkles on its own rhythm; about one in eight is a brighter
// star with a stacked glow that never fades out fully.
const STAR_COUNT = 110;
const stars = (() => {
  let seed = 7;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: STAR_COUNT }, () => ({
    left: rand() * 100,
    top: rand() * 100,
    size: rand() < 0.8 ? 2 : 3,
    opacity: 0.3 + rand() * 0.5,
    duration: 2 + rand() * 4,
    delay: -rand() * 6,
    bright: rand() < 0.12,
  }));
})();

// The rocket's flight path, ending at the rocket's centre (0, 0): it sets off heading right and
// curves up to arrive at 45°, the rocket's resting angle. The rocket-launch keyframes in
// globals.css are sampled from this curve, so keep them in step if it changes.
const TRAIL_PATH = "M -900 560 Q -560 560 0 0";

/**
 * The Labs page header from the original design: a blue-to-magenta gradient full of twinkling
 * stars, with a rocket that curves in from the bottom left, drawing a light trail behind it,
 * then hovers. Text is centred on desktop and left-aligned below lg (site rule). Animations are off
 * for people who prefer reduced motion.
 */
export default function LabsHero({ title, subtitle, shortTitle = title, shortSubtitle = subtitle, cta }: LabsHeroProps) {
  return (
    <div className="@container">
      <section className={`relative h-130 w-full overflow-hidden bg-[#3b3ccf] lg:h-160 ${curvedMask}`}>
        {/* Gradient from the design (its blue end deepened towards the corner), darkened with a
            soft-light black layer as in the Figma */}
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(135deg,#0a2f8f_0%,#0077d6_28%,#8f3ec3_60%,#ff00a9_100%)]" />
        <div aria-hidden="true" className="absolute inset-0 bg-black/50 mix-blend-soft-light" />

        <div aria-hidden="true" className="absolute inset-0">
          {stars.map((star, i) => (
            <span
              key={i}
              className={`absolute rounded-full bg-white motion-safe:animate-[twinkle_var(--d)_ease-in-out_var(--delay)_infinite] ${star.bright ? "shadow-star-glow [--dim:0.55] [--lit:1]" : ""}`}
              style={
                {
                  left: `${star.left}%`,
                  top: `${star.top}%`,
                  width: star.bright ? 3 : star.size,
                  height: star.bright ? 3 : star.size,
                  opacity: star.bright ? 1 : star.opacity,
                  "--d": `${star.duration}s`,
                  "--delay": `${star.delay}s`,
                } as CSSProperties
              }
            />
          ))}
        </div>

        {/* Rocket and its trail. One geometry, scaled down on phones; the curve ends at (0, 0), the
            rocket's box centre (the trail is drawn 12px lower so it meets the flame). The trail
            sits outside the rocket's flight so it stays put while the rocket flies along it; the
            rocket covers the trail's tip, so it shows from the flame. Both hover together once
            the rocket has landed. */}
        <div aria-hidden="true" className="absolute top-[22%] left-[66%] size-28 max-lg:scale-60 lg:top-[15%] lg:left-[63%]">
          <div className="size-full motion-safe:animate-[rocket-hover_4s_ease-in-out_1.8s_infinite]">
            <svg
              className="absolute top-[calc(50%-188px)] left-[calc(50%-1100px)] overflow-visible"
              width="1300"
              height="960"
              viewBox="-1100 -200 1300 960"
            >
              <defs>
                {/* Brightness along the trail, from the far end (offset 0) to the flame (1) */}
                <linearGradient id="trail-aura" gradientUnits="userSpaceOnUse" x1="-900" y1="560" x2="0" y2="0">
                  <stop offset="0" stopColor="#fff" stopOpacity="0" />
                  <stop offset="0.3" stopColor="#fff" stopOpacity="0.35" />
                  <stop offset="0.8" stopColor="#fff" stopOpacity="0.2" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0.05" />
                </linearGradient>
                <linearGradient id="trail-glow" gradientUnits="userSpaceOnUse" x1="-900" y1="560" x2="0" y2="0">
                  <stop offset="0" stopColor="#fff" stopOpacity="0" />
                  <stop offset="0.25" stopColor="#fff" stopOpacity="0.18" />
                  <stop offset="0.85" stopColor="#fff" stopOpacity="0.08" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="trail-core" gradientUnits="userSpaceOnUse" x1="-900" y1="560" x2="0" y2="0">
                  <stop offset="0" stopColor="#fff" stopOpacity="0" />
                  <stop offset="0.15" stopColor="#fff" stopOpacity="0.1" />
                  <stop offset="0.6" stopColor="#fff" stopOpacity="0.16" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0.28" />
                </linearGradient>
                <linearGradient id="trail-haze" gradientUnits="userSpaceOnUse" x1="-900" y1="560" x2="0" y2="0">
                  <stop offset="0" stopColor="#fff" stopOpacity="0" />
                  <stop offset="0.2" stopColor="#fff" stopOpacity="0.12" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0.25" />
                </linearGradient>
                <filter id="trail-smoke-aura" filterUnits="userSpaceOnUse" x="-1100" y="-200" width="1300" height="960">
                  <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="3" seed="4" />
                  <feDisplacementMap in="SourceGraphic" scale="70" xChannelSelector="R" yChannelSelector="G" />
                  <feGaussianBlur stdDeviation="30" />
                </filter>
                <filter id="trail-smoke-wide" filterUnits="userSpaceOnUse" x="-1100" y="-200" width="1300" height="960">
                  <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" seed="9" />
                  <feDisplacementMap in="SourceGraphic" scale="40" xChannelSelector="R" yChannelSelector="G" />
                  <feGaussianBlur stdDeviation="16" />
                </filter>
                <filter id="trail-blur-mid" filterUnits="userSpaceOnUse" x="-1100" y="-200" width="1300" height="960">
                  <feGaussianBlur stdDeviation="14" />
                </filter>
                <filter id="trail-blur-soft" filterUnits="userSpaceOnUse" x="-1100" y="-200" width="1300" height="960">
                  <feGaussianBlur stdDeviation="9" />
                </filter>
              </defs>
              {/* A diffuse smoke plume, with no hard line: a very wide aura and a wide glow, both
                  warped by noise so their edges billow and both fading out towards the flame, then
                  a soft haze and a blurred, translucent core that are brightest at the flame */}
              {[
                { stroke: "url(#trail-aura)", width: 140, filter: "url(#trail-smoke-aura)" },
                { stroke: "url(#trail-glow)", width: 56, filter: "url(#trail-smoke-wide)" },
                { stroke: "url(#trail-haze)", width: 32, filter: "url(#trail-blur-mid)" },
                { stroke: "url(#trail-core)", width: 18, filter: "url(#trail-blur-soft)" },
              ].map((layer) => (
                <path
                  key={layer.stroke}
                  d={TRAIL_PATH}
                  pathLength={1}
                  strokeDasharray="1"
                  fill="none"
                  stroke={layer.stroke}
                  strokeWidth={layer.width}
                  filter={layer.filter}
                  className="motion-safe:animate-[rocket-trail_1.8s_cubic-bezier(0.4,0,0.2,1)_both]"
                />
              ))}
            </svg>
            <div className="relative size-full motion-safe:animate-[rocket-launch_1.8s_linear_both]">
              <Image src="/images/labs/rocket.png" alt="" width={268} height={268} priority className="size-full" />
            </div>
          </div>
        </div>

        <Container className="relative flex h-full flex-col items-start justify-end pb-18 text-left text-white lg:items-center lg:justify-center lg:pt-40 lg:pb-0 lg:text-center">
          <h1 className="max-w-sm text-5xl font-bold leading-heading tracking-tight lg:max-w-4xl lg:text-7xl">
            <span className="lg:hidden">{shortTitle}</span>
            <span className="max-lg:hidden">{title}</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg font-medium leading-snug text-balance lg:mt-6 lg:max-w-2xl lg:text-xl">
            <span className="lg:hidden">{shortSubtitle}</span>
            <span className="max-lg:hidden">{subtitle}</span>
          </p>
          <Button href={cta.href} variant="white" className="mt-8">
            {cta.label}
          </Button>
        </Container>
      </section>
    </div>
  );
}
