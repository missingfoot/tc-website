import Image from "next/image";
import type { CircleImage } from "@/lib/types";
import Container from "@/components/ui/Container";
import Photo from "@/components/ui/Photo";
import Section, { type SectionTone } from "@/components/ui/Section";
import SectionIntro from "@/components/ui/SectionIntro";
import { Download } from "@/components/icons";
import { pressable, text } from "@/lib/styles";

export type LogoAsset = {
  name: string;
  /** Base path without extension: a .svg and .png sit side by side. */
  file: string;
  /** Shows the white versions on dark. */
  dark?: boolean;
};

export type PhotoGroup = { heading: string; photos: CircleImage[] };

type MediaKitProps = {
  heading: string;
  intro?: string;
  logos: LogoAsset[];
  photoGroups: PhotoGroup[];
  /** Section background (default cream; the cards are white). */
  tone?: SectionTone;
};

const linkStyle = "font-medium text-ink underline underline-offset-4 hover:opacity-70";

/**
 * Downloadable brand assets: logo previews with PNG and SVG links, then press photos in groups,
 * each with a download button (the photos are served full size; the previews are resized).
 */
export default function MediaKit({ heading, intro, logos, photoGroups, tone = "cream" }: MediaKitProps) {
  return (
    <Section tone={tone}>
      <Container>
        <SectionIntro heading={heading} intro={intro} />

        <h3 className={`mt-12 lg:mt-16 ${text.subheading}`}>Logos</h3>
        <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {logos.map((logo) => (
            <li key={logo.file} className="overflow-hidden rounded-2xl bg-white">
              <div className={`flex aspect-[3/2] items-center justify-center p-6 ${logo.dark ? "bg-ink" : "bg-white"}`}>
                <Image src={`${logo.file}.svg`} alt={logo.name} width={300} height={150} unoptimized className="max-h-full w-auto max-w-full" />
              </div>
              <p className="flex items-center justify-center gap-3 border-t border-ink/10 px-4 py-3 text-sm">
                <a href={`${logo.file}.png`} download className={linkStyle}>
                  PNG
                </a>
                <span aria-hidden="true" className="text-ink/20">
                  |
                </span>
                <a href={`${logo.file}.svg`} download className={linkStyle}>
                  SVG
                </a>
                <span className="sr-only">: {logo.name}</span>
              </p>
            </li>
          ))}
        </ul>

        <h3 className={`mt-14 lg:mt-20 ${text.subheading}`}>Photos</h3>
        <div className="mt-6 flex flex-col gap-10">
          {photoGroups.map((group) => (
            <section key={group.heading} aria-label={group.heading}>
              <h4 className="font-bold text-ink">{group.heading}</h4>
              <ul className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
                {group.photos.map((photo) => (
                  <li key={photo.src}>
                    <a href={photo.src} download className={`group block ${pressable}`}>
                      <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-ink/10">
                        {/* The zoom is on a wrapper so its transition doesn't replace the photo's fade */}
                        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                          <Photo
                            src={photo.src}
                            alt=""
                            sizes="(min-width: 768px) (min-resolution: 2dppx) 30vw, (min-width: 768px) 60vw, (min-resolution: 2dppx) 50vw, 100vw"
                            className="object-cover"
                          />
                        </div>
                        <span className="absolute right-3 bottom-3 flex size-9 items-center justify-center rounded-full bg-white text-ink shadow-md">
                          <Download />
                        </span>
                      </div>
                      <span className="mt-2 block text-sm text-stone">
                        {photo.alt}
                        <span className="sr-only"> (download full size)</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Container>
    </Section>
  );
}
