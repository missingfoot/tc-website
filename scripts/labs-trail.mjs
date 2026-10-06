// Renders the Labs hero's smoke trail to public/images/labs/rocket-trail.webp and prints the
// trail-reveal keyframes for globals.css. Run with `node scripts/labs-trail.mjs` after changing
// the trail below or the rocket-launch keyframes.
//
// The trail used to be live SVG (noise-warped, blurred strokes drawn on with stroke-dashoffset).
// Safari redraws SVG filters on the CPU every frame, which ran at about 1fps on iPhones, so it is
// now rendered once here (in headless Chromium) and revealed with a cheap CSS mask instead. It is
// rendered at 1x: it is so blurred that 2x looks identical, and 1x takes a quarter of the memory.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";

// The flight path, in the rocket's coordinates: (0, 0) is the rocket's centre (12px below it in
// the hero, so the trail meets the flame). It sets off heading right and curves up to arrive at
// 45°, the rocket's resting angle.
const PATH = "M -900 560 Q -560 560 0 0";
const BOX = { x: -1100, y: -200, width: 1300, height: 960 };

// Brightness along the trail, from the far end (offset 0) to the flame (1)
const gradient = (id, stops) =>
  `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="-900" y1="560" x2="0" y2="0">${stops
    .map(([offset, opacity]) => `<stop offset="${offset}" stop-color="#fff" stop-opacity="${opacity}"/>`)
    .join("")}</linearGradient>`;
const filter = (id, body) =>
  `<filter id="${id}" filterUnits="userSpaceOnUse" x="${BOX.x}" y="${BOX.y}" width="${BOX.width}" height="${BOX.height}">${body}</filter>`;
const smoke = (frequency, seed, scale, blur) =>
  `<feTurbulence type="fractalNoise" baseFrequency="${frequency}" numOctaves="3" seed="${seed}"/>` +
  `<feDisplacementMap in="SourceGraphic" scale="${scale}" xChannelSelector="R" yChannelSelector="G"/>` +
  `<feGaussianBlur stdDeviation="${blur}"/>`;

// A diffuse smoke plume, with no hard line: a very wide aura and a wide glow, both warped by noise
// so their edges billow and both fading out towards the flame, then a soft haze and a blurred,
// translucent core that are brightest at the flame
const layers = [
  { id: "aura", width: 140, stops: [[0, 0], [0.3, 0.35], [0.8, 0.2], [1, 0.05]], filter: smoke(0.008, 4, 70, 30) },
  { id: "glow", width: 56, stops: [[0, 0], [0.25, 0.18], [0.85, 0.08], [1, 0]], filter: smoke(0.015, 9, 40, 16) },
  { id: "haze", width: 32, stops: [[0, 0], [0.2, 0.12], [1, 0.25]], filter: `<feGaussianBlur stdDeviation="14"/>` },
  { id: "core", width: 18, stops: [[0, 0], [0.15, 0.1], [0.6, 0.16], [1, 0.28]], filter: `<feGaussianBlur stdDeviation="9"/>` },
];

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${BOX.width}" height="${BOX.height}" viewBox="${BOX.x} ${BOX.y} ${BOX.width} ${BOX.height}">
<defs>${layers.map((l) => gradient(`g-${l.id}`, l.stops) + filter(`f-${l.id}`, l.filter)).join("")}</defs>
${layers.map((l) => `<path d="${PATH}" fill="none" stroke="url(#g-${l.id})" stroke-width="${l.width}" filter="url(#f-${l.id})"/>`).join("\n")}
</svg>`;

const dir = mkdtempSync(join(tmpdir(), "labs-trail-"));
writeFileSync(join(dir, "trail.html"), `<!doctype html><style>html,body{margin:0}svg{display:block}</style>${svg}`);
execFileSync(process.env.CHROME ?? "chromium", [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--default-background-color=00000000",
  "--force-device-scale-factor=1",
  `--window-size=${BOX.width},${BOX.height}`,
  `--screenshot=${join(dir, "trail.png")}`,
  `file://${join(dir, "trail.html")}`,
], { stdio: "ignore" });

// Crop to the visible smoke, so the image (and the layer Safari keeps for it) is no bigger than it needs to be
const { data, info } = await sharp(readFileSync(join(dir, "trail.png"))).trim({ threshold: 0 }).toBuffer({ resolveWithObject: true });
await sharp(data).webp({ lossless: true, effort: 6 }).toFile("public/images/labs/rocket-trail.webp");
const left = -info.trimOffsetLeft;
const top = -info.trimOffsetTop;
const origin = { x: -BOX.x - left, y: -BOX.y - top }; // the rocket's centre inside the image

console.log(`rocket-trail.webp: ${info.width}x${info.height}, rocket centre at (${origin.x}, ${origin.y}) in the image`);
console.log(`LabsHero: width={${info.width}} height={${info.height}}, left-[calc(50%-${origin.x}px)] top-[calc(50%+12px-${origin.y}px)]\n`);

// Reveal keyframes: a soft mask edge that sits at the rocket and faces its direction of travel,
// read from the rocket-launch keyframes (which already follow the curve with the easing baked in)
const css = readFileSync("src/app/globals.css", "utf8");
const launch = css.match(/@keyframes rocket-launch \{([\s\S]*?)\n\}/)[1];
const frames = [...launch.matchAll(/(\d+)% \{ transform: (?:translate\((-?\d+)px, (-?\d+)px\) rotate\(([\d.]+)deg\)|none)/g)];
console.log("@keyframes rocket-trail {");
for (const [, percent, x = 0, y = 0, rotate = 0] of frames) {
  // The rocket image points up-right, so rotate(45deg) heads right; CSS gradient angles start at "to top"
  const angle = Number(rotate) + 45;
  const a = (angle * Math.PI) / 180;
  const [dx, dy] = [Math.sin(a), -Math.cos(a)];
  const length = info.width * Math.abs(dx) + info.height * Math.abs(dy);
  let edge = length / 2 + (Number(x) + origin.x - info.width / 2) * dx + (Number(y) + origin.y - info.height / 2) * dy;
  if (percent === "100") edge += 200; // fully revealed at rest, including the glow just past the tip
  console.log(`  ${percent}% { --trail-angle: ${angle.toFixed(1)}deg; --trail-edge: ${Math.round(edge)}px; }`);
}
console.log("}");
