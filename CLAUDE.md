@AGENTS.md

# Project conventions

Next.js (App Router) + Tailwind v4 rebuild of The Collective site from Figma (1440px desktop frames).

## Structure
- `src/components/ui/` — primitives (Button, Container, ParallaxImage)
- `src/components/icons/` — inline SVG icons using `currentColor`
- `src/components/layout/` — site-wide pieces (Nav, StickyHeader, Logo)
- `src/components/sections/` — full-width page blocks that take content as props
- `src/content/` — per-page content/data; `src/config/` — site config (nav links)
- Colours are theme tokens in `src/app/globals.css` (`ink`, `stone`, `cream`, `cream-dark`, `ash`)
- Font: Circular Std, self-hosted from `src/app/fonts/` via `next/font/local`. Only weights 450 (Book), 500, 700 and 900 exist, so use `font-normal` (renders Book 450), `font-medium`, `font-bold`, `font-black`, never `font-semibold`.

## Design rules
- **Content blocks are left-aligned below `lg` (1024px)**: headings, body text and buttons. Desktop alignment follows the Figma (e.g. centred).
- Footer/CTA buttons in content blocks go full width below `lg`.
- All buttons are 48px tall (`Button` has colour variants only, no sizes).
- Wrap block content in `Container` for the 1440px max width and standard gutters.
- **Use Tailwind's scales for everything, not raw Figma values** (spacing, sizes, text size, leading, tracking, radii, max-widths), matching the Figma as closely as the scale allows. The Figma files predate auto layout and are full of one-off numbers (30px, 31px, 117px…): round to the nearest scale step (`mt-8`, `gap-6`, `text-4xl`, `leading-relaxed`, `rounded-2xl`…). Recurring design values become theme tokens in `globals.css` (e.g. `drop-shadow-card`); shared text styles live in `src/lib/styles.ts`. Arbitrary values are only for layout geometry (column widths, collage/card positions, aspect ratios, gradients).
- Every content block uses the `Section` component (`src/components/ui/Section.tsx`) for its vertical padding — `py-12 lg:py-20` — so spacing between blocks is consistent. Don't add per-block section padding.

## Images
- Photos must look high-res: never downscale or heavily compress the source to save bytes.
- Keep sources high-res in `public/images/`: the original size, but **capped at 3000px on the long edge** (plenty for 2× on any layout without bloating the repo). Save as JPEG quality 92–95 with 4:4:4 chroma. Name files by what they show (e.g. `03-kitchen.jpg`).
- Compression happens at delivery: `next/image` serves WebP, resized per device. Large photos use `quality={90}` (allowed values are in `next.config.ts` `images.qualities`). Don't enable AVIF: encoding large photos takes 30s+ and stalled/crashed the dev server.
- Images are always at least 2×: build `sizes` with `sizes2x()` from `src/lib/images.ts` (HiDPI screens multiply by their density; 1× screens get the slot doubled).
