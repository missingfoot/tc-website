"use client";

import { useState } from "react";
import type { TravelMode } from "@/lib/types";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section, { type SectionTone } from "@/components/ui/Section";
import SectionIntro from "@/components/ui/SectionIntro";
import { Bus, Car, ChevronDown, Roundel, Train } from "@/components/icons";

const MODE_ICONS = { underground: Roundel, overground: Train, bus: Bus, car: Car };

type DirectionsProps = {
  /** Section background (default white). */
  tone?: SectionTone;
  heading: string;
  intro?: string;
  modes: TravelMode[];
  /** Google Maps embed URL for the map panel. */
  mapEmbedUrl: string;
};

/** Accordion of travel modes with step-by-step directions, and a map (beside it on desktop, below on mobile). */
export default function Directions({ heading, intro, modes, mapEmbedUrl, tone = "white" }: DirectionsProps) {
  const [open, setOpen] = useState(0);

  return (
    <Section tone={tone}>
      <Container>
        <SectionIntro heading={heading} intro={intro} />
        <div className="mt-10 grid gap-8 lg:mt-16 lg:grid-cols-[22.5rem_1fr]">
          <ul className="flex flex-col gap-2.5">
            {modes.map((mode, i) => (
              <li key={mode.label}>
                <ModeItem mode={mode} expanded={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
              </li>
            ))}
          </ul>

          <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream lg:aspect-auto lg:min-h-160">
            <iframe
              src={mapEmbedUrl}
              title="Map of The Collective Old Oak"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 size-full"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}

function ModeItem({ mode, expanded, onToggle }: { mode: TravelMode; expanded: boolean; onToggle: () => void }) {
  const ModeIcon = MODE_ICONS[mode.icon];
  const panelId = `directions-${mode.label.toLowerCase().replace(/\W+/g, "-")}`;

  return (
    <div className={`overflow-hidden rounded-2xl transition-colors duration-300 ${expanded ? "bg-ink text-white" : "bg-cream text-ink"}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={panelId}
        className={`flex w-full items-center gap-5 border-b p-4 text-left transition-colors ${expanded ? "border-white/10" : "border-transparent"}`}
      >
        <ModeIcon className="shrink-0" />
        <span className="flex-1 text-base font-medium">{mode.label}</span>
        <ChevronDown className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
      </button>

      {/* grid-rows 0fr → 1fr animates the panel's height */}
      <div
        id={panelId}
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="min-h-0" inert={!expanded}>
          <ol className="relative flex flex-col gap-7 px-4 pt-6 pb-8">
            {/* Timeline line through the step dots */}
            <span aria-hidden="true" className="absolute top-8 bottom-10 left-7 w-px -translate-x-1/2 bg-white/10" />
            {mode.steps.map((step) => (
              <li key={step} className="relative flex gap-5">
                <span className="flex w-6 shrink-0 justify-center pt-1">
                  <span className="relative size-3 rounded-full border-3 border-cream bg-ink" />
                </span>
                <span className="text-base leading-snug">{step}</span>
              </li>
            ))}
          </ol>
          <div className="px-8 pb-8">
            <Button href={mode.mapsUrl} variant="glass" arrow className="w-full justify-center">
              Open with Google Maps
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
