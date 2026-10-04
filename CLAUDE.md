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
- Font: Circular Std, self-hosted from `src/app/fonts/` via `next/font/local`. Only weights 450 (Book), 500, 700 and 900 exist, so use `font-[450]`, `font-medium`, `font-bold`, `font-black`, never `font-semibold`.

## Design rules
- **Content blocks are left-aligned below `lg` (1024px)**: headings, body text and buttons. Desktop alignment follows the Figma (e.g. centred).
- Footer/CTA buttons in content blocks go full width below `lg`.
- All buttons are 48px tall (`Button` has colour variants only, no sizes).
- Wrap block content in `Container` for the 1440px max width and standard gutters.

## Images
- Photos must look high-res: never downscale or heavily compress the source to save bytes.
- Keep sources at **full original resolution** in `public/images/`, saved as visually lossless JPEG (quality 95, 4:4:4 chroma). Name files by what they show (e.g. `03-kitchen.jpg`).
- Compression happens at delivery: `next/image` serves WebP, resized per device. Large photos use `quality={90}` (allowed values are in `next.config.ts` `images.qualities`). Don't enable AVIF: encoding large photos takes 30s+ and stalled/crashed the dev server.
- Images are always at least 2×: build `sizes` with `sizes2x()` from `src/lib/images.ts` (HiDPI screens multiply by their density; 1× screens get the slot doubled).
