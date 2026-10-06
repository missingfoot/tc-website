// Imports the old WordPress blog from the HTTrack copy of thecollective.com into MDX posts.
//
//   node scripts/import-blog.mjs <path to the copy's blog folder>
//   e.g. node scripts/import-blog.mjs ~/Documents/Websites/thecollective.com/www.thecollective.com/blog
//
// For each article it writes src/content/blog/<slug>.mdx (metadata + the body as Markdown) and
// copies its images into public/images/blog/<slug>/, at the best quality the copy has (the
// original upload where WordPress kept it, else its largest resized copy; images the posts
// hot-linked from Medium or imgix, which the copy lacks, are downloaded), capped at 2400px (2x the
// widest a blog image is shown) and saved as WebP 90 with smart chroma subsampling: smaller than
// the site's usual 3000px JPEGs, as the blog has hundreds of images. Authors' photos go to
// public/images/blog/authors/ and src/content/blog/authors.json. Run `npm run blur` afterwards
// for the images' sizes and previews.
//
// A one-off migration: once the posts are edited by hand, rerunning it would overwrite them.
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { parse } from "node-html-parser";
import sharp from "sharp";

const BLOG = path.resolve(process.argv[2] ?? "");
if (!process.argv[2] || !existsSync(path.join(BLOG, "index.html"))) {
  console.error("Usage: node scripts/import-blog.mjs <path to the copy's blog folder>");
  process.exit(1);
}
const ROOT = path.resolve(import.meta.dirname, "..");
const CONTENT = path.join(ROOT, "src/content/blog");
const IMAGES = path.join(ROOT, "public/images/blog");
const UPLOADS = path.join(BLOG, "wp-content/uploads");
const SITE = path.dirname(BLOG); // the copy of www.thecollective.com
const MIRROR = path.dirname(SITE); // HTTrack keeps other hosts (Medium's CDN…) beside it

export const categories = {
  news: "News",
  community: "Community",
  innovation: "Innovation",
  "city-living": "City Living",
  "watch-and-listen": "Watch & Listen",
};

// Old main-site paths → their pages on the new site
const sitePages = {
  "": "/",
  "co-living/old-oak": "/locations/old-oak",
  "privacy-notice": "/privacy",
  "privacy-policy.html": "/privacy",
  "terms-and-conditions": "/terms",
  "refer-a-friend/terms-and-conditions": "/refer-a-friend/terms",
};

const warnings = [];
const warn = (slug, message) => warnings.push(`${slug}: ${message}`);

// ---------------------------------------------------------------------------------------------
// Images

// WordPress names resized copies like photo-1024x683.jpg or photo-2000x0-c-center.jpg
const sizeSuffix = /-(\d+)x(\d+)(?:-c-[a-z]+)?$/;
const uploadsIndex = new Map(); // "2018/06/photo" → files of every size and extension
for (const file of readdirSync(UPLOADS, { recursive: true })) {
  const full = path.join(UPLOADS, file);
  if (!statSync(full).isFile()) continue;
  const parsed = path.parse(file);
  const key = path.join(parsed.dir, parsed.name.replace(sizeSuffix, ""));
  if (!uploadsIndex.has(key)) uploadsIndex.set(key, []);
  uploadsIndex.get(key).push(full);
}

/** The best copy of an uploaded image: the original upload if the copy has it, else the largest resize. */
function bestUpload(file) {
  const rel = path.relative(UPLOADS, file);
  if (rel.startsWith("..")) return file;
  const parsed = path.parse(rel);
  const all = uploadsIndex.get(path.join(parsed.dir, parsed.name.replace(sizeSuffix, ""))) ?? [file];
  const original = all.find((f) => !sizeSuffix.test(path.parse(f).name));
  if (original) return original;
  const area = (f) => {
    const m = path.parse(f).name.match(sizeSuffix);
    return m ? Number(m[1]) * (Number(m[2]) || Number(m[1])) : 0;
  };
  return all.toSorted((a, b) => area(b) - area(a) || statSync(b).size - statSync(a).size)[0];
}

/** A URL from the copied page → the local file it was saved as, if the copy has it. */
function localFile(pageFile, url) {
  if (!url || url.startsWith("data:")) return null;
  const tries = [];
  const absolute = url.match(/^(?:https?:)?\/\/([^/]+)(\/[^?#]*)/);
  if (absolute) {
    const [, host, p] = absolute;
    if (/(^|\.)thecollective\.com$/.test(host)) tries.push(path.join(SITE, p));
    // HTTrack saves other hosts beside the site, swapping characters like * for _
    tries.push(path.join(MIRROR, host, p), path.join(MIRROR, host, p.replace(/\*/g, "_")));
  } else {
    const clean = decodeURIComponent(url.split(/[?#]/)[0]);
    tries.push(path.resolve(path.dirname(pageFile), clean));
  }
  return tries.find((f) => existsSync(f) && statSync(f).isFile()) ?? null;
}

/** The image's original address, for images the copy didn't save (hot-linked from other hosts). */
function remoteUrl(pageFile, url) {
  if (!url || url.startsWith("data:")) return null;
  let address = url.startsWith("//") ? `https:${url}` : url;
  if (!/^https?:/.test(address)) {
    // A relative path into a host HTTrack would have saved beside the site
    const rel = path.relative(MIRROR, path.resolve(path.dirname(pageFile), url.split(/[?#]/)[0])).split(path.sep);
    if (!rel[0] || rel[0].startsWith("..") || !rel[0].includes(".")) return null;
    address = `https://${rel.join("/")}`;
  }
  // Medium serves larger sizes of the same image
  return address.replace(/(cdn-images-1\.medium\.com\/max\/)\d+/, "$12000");
}

const DOWNLOADS = path.join(tmpdir(), "import-blog-downloads");
/** Downloads an image (cached between runs), or null if it's gone. */
async function download(url) {
  mkdirSync(DOWNLOADS, { recursive: true });
  const cached = path.join(DOWNLOADS, fileName(url) + path.extname(new URL(url).pathname));
  if (existsSync(cached)) return cached;
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) return null;
    writeFileSync(cached, Buffer.from(await response.arrayBuffer()));
    return cached;
  } catch {
    return null;
  }
}

const savedImages = new Map(); // source file → public path, so an image used twice is saved once

/** Copies an image into public/images/blog/<folder>/ and returns its public path. */
async function saveImage(source, folder, name) {
  source = bestUpload(source);
  if (savedImages.has(source)) return savedImages.get(source);
  const image = sharp(readFileSync(source), { failOn: "none" }).rotate();
  const meta = await image.metadata();
  // Graphics with transparency (logos, PNG artwork) stay lossless, so their edges stay crisp
  const graphic = meta.format === "png" && meta.hasAlpha;
  const file = `${name}.webp`;
  mkdirSync(path.join(IMAGES, folder), { recursive: true });
  await image
    .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
    .webp(graphic ? { lossless: true, effort: 6 } : { quality: 90, smartSubsample: true, effort: 6 })
    .toFile(path.join(IMAGES, folder, file));
  const publicPath = `/images/blog/${folder}/${file}`;
  savedImages.set(source, publicPath);
  return publicPath;
}

const fileName = (text) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50) || "image";

// ---------------------------------------------------------------------------------------------
// Links

/** Rewrites a link from the copied page to where it lives now. */
function rewriteLink(pageFile, href) {
  if (!href || href.startsWith("#") || /^(mailto|tel):/.test(href)) return href;
  let sitePath = null;
  const absolute = href.match(/^(?:https?:)?\/\/([^/]+)(\/[^?#]*)?([?#].*)?$/);
  if (absolute) {
    if (!/(^|\.)thecollective\.com$/.test(absolute[1])) return href.startsWith("//") ? `https:${href}` : href;
    sitePath = (absolute[2] ?? "/").replace(/^\//, "");
  } else {
    const resolved = path.resolve(path.dirname(pageFile), href.split(/[?#]/)[0]);
    if (!resolved.startsWith(SITE + path.sep) && resolved !== SITE) {
      // A page HTTrack saved from another host: rebuild its address
      const rel = path.relative(MIRROR, resolved).split(path.sep);
      if (rel[0] && !rel[0].startsWith("..")) return `https://${rel[0]}/${rel.slice(1).join("/").replace(/index\.html$/, "")}`;
      return href;
    }
    sitePath = path.relative(SITE, resolved).split(path.sep).join("/");
  }
  sitePath = sitePath.replace(/(^|\/)index(?:[0-9a-f]{4})?\.html$/, "").replace(/\/$/, "");
  const parts = sitePath.split("/");
  if (parts[0] === "blog") {
    if (parts.length === 1) return "/blog";
    if (parts[1] === "category" && categories[parts[2]]) return `/blog/category/${parts[2]}`;
    if (categories[parts[1]] && parts[2] && parts[2] !== "page") return `/blog/${parts[2]}`;
    if (/^\d{4}$/.test(parts[1]) && parts[4]) return `/blog/${parts[4]}`;
    return "/blog";
  }
  if (sitePath in sitePages) return sitePages[sitePath];
  return `/${sitePath}`;
}

// ---------------------------------------------------------------------------------------------
// HTML → Markdown (MDX)

/** Escapes text so Markdown and MDX read it literally (MDX treats { } < as code and tags). */
const escapeText = (s) => s.replace(/[\\`*_{}[\]<>|]/g, "\\$&");
const decode = (s) => parse(`<p>${s}</p>`).text;

/** Inline content as Markdown on one line. */
function inline(node, ctx) {
  if (node.nodeType === 3) return escapeText(node.text.replace(/\s+/g, " "));
  if (node.nodeType !== 1) return "";
  const tag = node.tagName?.toLowerCase();
  const inner = () => node.childNodes.map((c) => inline(c, ctx)).join("");
  // Bold/italic markers must hug the text, so spaces move outside them. Markdown ignores markers
  // next to punctuation when a letter follows ("**Hello –**We"), so that text gets tags instead.
  const wrap = (mark, tagName, text) => {
    const m = text.match(/^(\s*)([\s\S]*?)(\s*)$/);
    if (!m[2]) return text;
    const risky = /^[^\p{L}\p{N}]|[^\p{L}\p{N}]$/u.test(m[2]);
    return risky ? `${m[1]}<${tagName}>${m[2]}</${tagName}>${m[3]}` : `${m[1]}${mark}${m[2]}${mark}${m[3]}`;
  };
  switch (tag) {
    case "strong":
    case "b":
      return wrap("**", "strong", inner());
    case "em":
    case "i":
      // * rather than _, which Markdown ignores inside words
      return wrap("*", "em", inner());
    case "br":
      return "<br />";
    case "a": {
      const text = inner();
      const href = rewriteLink(ctx.file, node.getAttribute("href"));
      return href && text.trim() ? `[${text.trim()}](${href.replace(/[()\s]/g, encodeURIComponent)})` : text;
    }
    case "img":
    case "script":
    case "style":
    case "canvas":
    case "svg":
    case "iframe":
      return "";
    default:
      return inner();
  }
}

const jsxString = (s) => JSON.stringify(s.replace(/\s+/g, " ").trim());

/** Block content as Markdown paragraphs. */
async function blocks(node, ctx) {
  const out = [];
  let run = []; // inline nodes waiting to become a paragraph
  const flush = () => {
    const text = run.map((c) => inline(c, ctx)).join("").trim();
    if (text) out.push(text);
    run = [];
  };
  for (const child of node.childNodes) {
    if (child.nodeType === 3) {
      run.push(child);
      continue;
    }
    if (child.nodeType !== 1) continue;
    const tag = child.tagName.toLowerCase();
    const cls = child.getAttribute("class") ?? "";
    if (["p", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "ul", "ol", "figure", "div", "section", "iframe", "hr", "img", "nav", "script", "style", "canvas", "svg"].includes(tag)) flush();
    else {
      // Inline element: an image inside a link or span still becomes its own block
      if (child.querySelector("img")) {
        flush();
        out.push(...(await blocks(child, ctx)));
      } else run.push(child);
      continue;
    }
    switch (tag) {
      case "p": {
        if (child.querySelector("img, iframe")) {
          out.push(...(await blocks(child, ctx)));
          break;
        }
        const text = inline(child, ctx).trim();
        if (text && text !== "&nbsp;") out.push(text);
        break;
      }
      // The old posts used big h1s for pull quotes, like their blockquotes
      case "h1":
      case "blockquote": {
        if (cls.includes("instagram-media")) {
          const link = child.querySelector("a[href*='instagram.com']")?.getAttribute("href");
          if (link) out.push(`[See this post on Instagram](${rewriteLink(ctx.file, link)})`);
          break;
        }
        const inner = (await blocks(child, ctx)).join("\n\n");
        if (inner) out.push(inner.split("\n").map((l) => (l ? `> ${l}` : ">")).join("\n"));
        break;
      }
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6": {
        const text = inline(child, ctx).replace(/\*\*/g, "").trim();
        if (text) out.push(`${tag === "h2" ? "##" : "###"} ${text}`);
        break;
      }
      case "ul":
      case "ol": {
        const items = child.querySelectorAll(":scope > li");
        const lines = [];
        for (const [i, li] of items.entries()) {
          const text = (await blocks(li, ctx)).join(" ").replace(/\n+/g, " ").trim();
          if (text) lines.push(`${tag === "ol" ? `${i + 1}.` : "-"} ${text}`);
        }
        if (lines.length) out.push(lines.join("\n"));
        break;
      }
      case "figure":
      case "img": {
        const img = tag === "img" ? child : child.querySelector("img");
        if (!img) {
          out.push(...(await blocks(child, ctx)));
          break;
        }
        const caption = tag === "figure" ? child.querySelector("figcaption")?.text.trim() : "";
        const src = await ctx.image(img);
        if (!src) break;
        const alt = (img.getAttribute("alt") ?? "").trim();
        out.push(caption ? `<Figure src="${src}" alt=${jsxString(alt || caption)} caption=${jsxString(caption)} />` : `![${escapeText(alt)}](${src})`);
        break;
      }
      case "iframe": {
        const src = child.getAttribute("src") || child.getAttribute("data-src");
        if (src) out.push(`<Embed src="${src.startsWith("//") ? `https:${src}` : src.replace(/&amp;/g, "&")}" title=${jsxString(child.getAttribute("title") || "Embedded media")} />`);
        else warn(ctx.slug, "iframe without a src");
        break;
      }
      case "hr":
        out.push("---");
        break;
      case "div":
      case "section":
        out.push(...(await blocks(child, ctx)));
        break;
      default:
        // nav, script, style, canvas, svg: page furniture, not content
        break;
    }
  }
  flush();
  return out;
}

// ---------------------------------------------------------------------------------------------
// Posts

const months = { January: 1, February: 2, March: 3, April: 4, May: 5, June: 6, July: 7, August: 8, September: 9, October: 10, November: 11, December: 12 };
function isoDate(text, slug) {
  const m = text.match(/^(\w+) (\d+), (\d{4})$/);
  if (!m || !months[m[1]]) {
    warn(slug, `unreadable date "${text}"`);
    return text;
  }
  return `${m[3]}-${String(months[m[1]]).padStart(2, "0")}-${m[2].padStart(2, "0")}`;
}

const posts = [];
for (const category of Object.keys(categories)) {
  for (const slug of readdirSync(path.join(BLOG, category))) {
    const file = path.join(BLOG, category, slug, "index.html");
    if (slug === "page" || !existsSync(file)) continue;
    if (posts.some((p) => p.slug === slug)) {
      warn(slug, `also filed under ${category}; kept the first category`);
      continue;
    }
    posts.push({ slug, category, file });
  }
}

rmSync(CONTENT, { recursive: true, force: true });
rmSync(IMAGES, { recursive: true, force: true });
mkdirSync(CONTENT, { recursive: true });

const authors = {};
let imageCount = 0;
for (const post of posts) {
  const { slug, category, file } = post;
  const doc = parse(readFileSync(file, "utf8"));
  const article = doc.querySelector("article.article-full");
  const content = article?.querySelector(".content");
  if (!content) {
    warn(slug, "no article body found; skipped");
    continue;
  }
  const meta = (property) => decode(doc.querySelector(`meta[property="${property}"]`)?.getAttribute("content") ?? "");
  const title = article.querySelector("header h2")?.text.trim() || meta("og:title");
  const date = isoDate(article.querySelector("header h6")?.text.trim() ?? "", slug);
  const author = article.querySelector("a.author h6")?.text.trim() || "The Collective";
  const tags = article.querySelectorAll("nav.tags a").map((a) => a.text.trim());

  // Everything in the body up to "Tags from the story" (then the tags list and share links)
  const tagTitle = content.querySelector("p.tag-title");
  if (tagTitle) {
    let next = tagTitle;
    while (next) {
      const after = next.nextElementSibling;
      next.remove();
      next = after;
    }
  }

  let n = 0;
  const ctx = {
    slug,
    file,
    async image(img) {
      // Medium-style images keep the real source in data-src; srcset lists the larger sizes
      const candidates = [img.getAttribute("data-src"), img.getAttribute("src"), ...(img.getAttribute("srcset") ?? "").split(",").map((s) => s.trim().split(/\s+/)[0])];
      let source = candidates.map((c) => localFile(file, c)).find(Boolean);
      for (const url of source ? [] : candidates.map((c) => remoteUrl(file, c)).filter(Boolean)) {
        source = await download(url);
        if (source) break;
      }
      if (!source) {
        warn(slug, `image not in the copy and not online: ${candidates.filter(Boolean)[0]}`);
        return null;
      }
      imageCount++;
      return saveImage(source, slug, `${String(++n).padStart(2, "0")}-${fileName(img.getAttribute("alt") || path.parse(source).name)}`);
    },
  };

  const coverImg = article.querySelector("img.featured-image");
  const coverSource = coverImg && localFile(file, coverImg.getAttribute("src"));
  const cover = coverSource ? await saveImage(coverSource, slug, "cover") : null;
  if (!cover) warn(slug, "no cover image");

  if (!authors[author]) {
    const avatar = article.querySelector("a.author img");
    const avatarSource = avatar && localFile(file, avatar.getAttribute("src"));
    authors[author] = { avatar: avatarSource ? await saveImage(avatarSource, "authors", fileName(author)) : null };
  }

  const body = (await blocks(content, ctx)).join("\n\n");
  const metadata = { title, date, category, author, excerpt: meta("og:description"), tags, cover };
  const mdx = `export const metadata = ${JSON.stringify(metadata, null, 2)};\n\n${body}\n`;
  writeFileSync(path.join(CONTENT, `${slug}.mdx`), mdx);
}

writeFileSync(path.join(CONTENT, "authors.json"), JSON.stringify(authors, null, 2) + "\n");
console.log(`blog: ${posts.length} posts, ${imageCount} images in posts, ${Object.keys(authors).length} authors`);
if (warnings.length) console.log(`\n${warnings.length} warnings:\n  ${warnings.join("\n  ")}`);
