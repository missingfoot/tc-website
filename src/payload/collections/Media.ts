import { APIError, type CollectionConfig, type Field } from "payload";
import sharp from "sharp";
import { pageBlocks } from "../blocks";

/** Whether this data, shaped by these fields, has the photo in one of its image fields. */
function hasPhoto(fields: Field[], data: Record<string, unknown> | undefined, id: number | string): boolean {
  if (!data) return false;
  return fields.some((field) => {
    // Rows and other unnamed layout fields keep their fields' values on the same level
    if (!("name" in field)) return "fields" in field && hasPhoto(field.fields, data, id);
    const value = data[field.name];
    if (field.type === "upload") return value === id;
    if (field.type === "group") return hasPhoto(field.fields, value as Record<string, unknown>, id);
    if (field.type === "array") return Array.isArray(value) && value.some((item) => hasPhoto(field.fields, item, id));
    return false;
  });
}

/**
 * Uploaded images. Kept full size: next/image resizes and converts them for each screen, as with
 * the site's own photos. Stored in Cloudflare R2 (see payload.config.ts), as serverless hosts have
 * no lasting disk. A tiny blurred preview is made on upload, for the photo to show while it loads.
 */
export const Media: CollectionConfig = {
  slug: "media",
  access: { read: () => true },
  // Limiting uploads to images also makes Payload fetch each one back from R2 in full after a
  // browser upload, which the blurred preview below needs.
  upload: { mimeTypes: ["image/*"] },
  fields: [
    { name: "alt", type: "text", required: true, admin: { description: "Describe the image for people who can't see it." } },
    { name: "blur", type: "text", admin: { hidden: true, disableListColumn: true, disableListFilter: true } },
  ],
  hooks: {
    // Page images are required, so the database refuses to delete a photo a page still uses, with
    // an error that means nothing to an editor. Say which pages use it instead.
    beforeDelete: [
      async ({ id, req }) => {
        const { docs } = await req.payload.find({ collection: "pages", depth: 0, pagination: false, req });
        const pages = docs
          .filter((page) => page.layout.some((block) => hasPhoto(pageBlocks.find((b) => b.slug === block.blockType)?.fields ?? [], block, id)))
          .map((page) => `“${page.title}”`);
        if (pages.length) {
          const list = new Intl.ListFormat("en-GB").format(pages);
          throw new APIError(`This photo is used on ${list}. Replace it there first, then delete it.`, 400, undefined, true);
        }
      },
    ],
    beforeChange: [
      async ({ data, req }) => {
        // A browser upload is fetched back from R2 into a temp file, leaving the in-memory data empty
        const input = req.file?.tempFilePath ?? (req.file?.data.length ? req.file.data : undefined);
        if (!input) return data;
        const preview = await sharp(input).rotate().resize(8).webp({ quality: 70 }).toBuffer();
        return { ...data, blur: `data:image/webp;base64,${preview.toString("base64")}` };
      },
    ],
  },
};
