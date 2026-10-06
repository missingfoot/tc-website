import Image from "next/image";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import StarField from "@/components/ui/StarField";
import { curvedMask } from "@/components/sections/Hero";

type LabsHeroProps = {
  title: string;
  subtitle: string;
  cta: { label: string; href: string };
};

// The rocket's light trail, pre-rendered by scripts/labs-trail.mjs (which prints its size and position)
const trail = { src: "/images/labs/rocket-trail.webp", width: 1003, height: 767, unoptimized: true, preload: true };
const trailPosition = "absolute top-[calc(50%+12px-96px)] left-[calc(50%-935px)] max-w-none";

/**
 * The Labs page header from the original design: a blue-to-magenta gradient full of twinkling
 * stars, with a rocket that curves in from the bottom left, drawing a light trail behind it,
 * then hovers. Text is centred on desktop and left-aligned below lg (site rule). Animations are off
 * for people who prefer reduced motion.
 */
export default function LabsHero({ title, subtitle, cta }: LabsHeroProps) {
  return (
    <div className="@container">
      <section className={`relative h-130 w-full overflow-hidden bg-[#3b3ccf] lg:h-160 ${curvedMask}`}>
        {/* Gradient from the design (its blue end deepened towards the corner), darkened as in the
            Figma's soft-light black layer. The darkening is baked into the colours (the extra
            stops keep it exact) rather than layered with mix-blend-mode, which is costly on iOS. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(135deg,#051c70_0%,#032d89_9%,#0242a7_19%,#0057c5_28%,#1d45bc_39%,#4036b4_49%,#7027ac_60%,#9918a2_73%,#cb0b96_87%,#ff008d_100%)]"
        />

        <StarField />

        {/* Rocket and its trail. One geometry, scaled down on phones. The trail is a pre-rendered
            image (scripts/labs-trail.mjs, which also gives its size and position: its curve ends
            12px below the rocket's centre so it meets the flame). A soft mask edge travels with
            the rocket to reveal it; the rocket covers the trail's tip, so it shows from the flame.
            Once landed, an identical unmasked copy takes over and hovers in step with the rocket:
            a masked element moving in its own layer made both disappear on iPhones. */}
        <div aria-hidden="true" className="absolute top-[22%] left-[66%] size-28 max-lg:scale-60 lg:top-[15%] lg:left-[63%]">
          <Image
            {...trail}
            alt=""
            className={`${trailPosition} [mask-image:linear-gradient(var(--trail-angle),#000_calc(var(--trail-edge)-40px),transparent_calc(var(--trail-edge)+40px))] motion-safe:animate-[rocket-trail_1.8s_linear_both] motion-reduce:hidden`}
          />
          <Image
            {...trail}
            alt=""
            className={`${trailPosition} invisible motion-safe:animate-[rocket-landed_1.8s_step-end_both,rocket-hover_4s_ease-in-out_1.8s_infinite] motion-reduce:visible`}
          />
          <div className="relative size-full motion-safe:animate-[rocket-hover_4s_ease-in-out_1.8s_infinite]">
            <div className="size-full motion-safe:animate-[rocket-launch_1.8s_linear_both]">
              <Image src="/images/labs/rocket.png" alt="" width={268} height={268} preload className="size-full" />
            </div>
          </div>
        </div>

        <Container className="relative flex h-full flex-col items-start justify-end pb-18 text-left text-white lg:items-center lg:justify-center lg:pt-40 lg:pb-0 lg:text-center">
          <h1 className="max-w-sm text-5xl font-bold leading-heading tracking-tight lg:max-w-4xl lg:text-7xl">{title}</h1>
          <p className="mt-4 max-w-xl text-lg font-medium leading-snug text-balance lg:mt-6 lg:max-w-2xl lg:text-xl">{subtitle}</p>
          <Button href={cta.href} variant="white" className="mt-8">
            {cta.label}
          </Button>
        </Container>
      </section>
    </div>
  );
}
