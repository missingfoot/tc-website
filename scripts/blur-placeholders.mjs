// Generates a tiny, inline blur placeholder for every photo in public/images, so <Photo> can
// show a blurred preview straight away (no extra request) while the full image loads.
// Blog images (public/images/blog) go to their own file, with their sizes too, which only blog
// pages load: there are hundreds, and src/lib/blur-placeholders.json is in every page's bundle.
// Runs before `dev` and `build`; the output is committed, so if sharp (installed with Next)
// is ever unavailable the script just keeps the existing file.
//
//   npm run blur
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const OUT = path.join(ROOT, "src/lib/blur-placeholders.json");
const BLOG_OUT = path.join(ROOT, "src/content/blog/images.json");
const BLOG_DIR = path.join(PUBLIC, "images", "blog");
// 8px wide is what next/image uses for imported images: the browser blurs it up anyway.
const WIDTH = 8;

async function photos(dir, extensions = /\.(jpe?g|webp)$/i) {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true }).catch(() => []);
  return entries
    .filter((e) => e.isFile() && extensions.test(e.name) && !e.parentPath.split(path.sep).includes("thumbs"))
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

const key = (file) => "/" + path.relative(PUBLIC, file).split(path.sep).join("/");
const preview = async (file) => {
  const buf = await sharp(await readFile(file)).rotate().resize(WIDTH).webp({ quality: 70 }).toBuffer();
  return `data:image/webp;base64,${buf.toString("base64")}`;
};

/** Writes the file only when it's changed, so it doesn't show as modified after every run. */
async function save(file, data, label, count) {
  const json = JSON.stringify(data, null, 2) + "\n";
  const previous = await readFile(file, "utf8").catch(() => "");
  if (json !== previous) await writeFile(file, json);
  console.log(`${label}: ${count} photos${json === previous ? " (unchanged)" : ", updated"}`);
}

const files = (await photos(path.join(PUBLIC, "images"))).filter((f) => !f.startsWith(BLOG_DIR + path.sep));
const entries = await Promise.all(files.map(async (file) => [key(file), await preview(file)]));
await save(OUT, Object.fromEntries(entries), "blur placeholders", entries.length);

// Blog images: size (for <img> width and height) and preview, PNGs included
const blogFiles = await photos(BLOG_DIR, /\.(jpe?g|webp|png)$/i);
if (blogFiles.length) {
  const blog = await Promise.all(
    blogFiles.map(async (file) => {
      const { width, height } = await sharp(file).rotate().metadata();
      return [key(file), { width, height, blur: await preview(file) }];
    }),
  );
  await save(BLOG_OUT, Object.fromEntries(blog), "blog images", blog.length);
}
