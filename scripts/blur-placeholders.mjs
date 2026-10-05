// Generates a tiny, inline blur placeholder for every photo in public/images, so <Photo> can
// show a blurred preview straight away (no extra request) while the full image loads.
// Runs before `dev` and `build`; the output is committed, so if sharp (installed with Next)
// is ever unavailable the script just keeps the existing file.
//
//   npm run blur
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const OUT = path.join(ROOT, "src/lib/blur-placeholders.json");
// 8px wide is what next/image uses for imported images: the browser blurs it up anyway.
const WIDTH = 8;

async function photos(dir) {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter((e) => e.isFile() && /\.(jpe?g|webp)$/i.test(e.name) && !e.parentPath.split(path.sep).includes("thumbs"))
    .map((e) => path.join(e.parentPath, e.name))
    .sort();
}

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.warn("blur placeholders: sharp isn't available, keeping the existing file");
  process.exit(0);
}

const files = await photos(path.join(PUBLIC, "images"));
const entries = await Promise.all(
  files.map(async (file) => {
    const buf = await sharp(await readFile(file)).rotate().resize(WIDTH).webp({ quality: 70 }).toBuffer();
    const key = "/" + path.relative(PUBLIC, file).split(path.sep).join("/");
    return [key, `data:image/webp;base64,${buf.toString("base64")}`];
  }),
);

const json = JSON.stringify(Object.fromEntries(entries), null, 2) + "\n";
const previous = await readFile(OUT, "utf8").catch(() => "");
if (json !== previous) await writeFile(OUT, json);
console.log(`blur placeholders: ${entries.length} photos${json === previous ? " (unchanged)" : ", updated"}`);
