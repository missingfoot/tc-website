import path from "node:path";
import { fileURLToPath } from "node:url";
import type { CollectionConfig } from "payload";
import sharp from "sharp";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Uploaded images. Kept full size: next/image resizes and converts them for each screen, as with
 * the site's own photos. Saved to public/media for this proof of concept (served at /media/…);
 * a deployed site would use a storage adapter (e.g. Cloudflare R2), as serverless hosts have no
 * lasting disk. A tiny blurred preview is made on upload, for the photo to show while it loads.
 */
export const Media: CollectionConfig = {
  slug: "media",
  access: { read: () => true },
  upload: {
    staticDir: path.resolve(dirname, "../../../public/media"),
    mimeTypes: ["image/*"],
  },
  fields: [
    { name: "alt", type: "text", required: true, admin: { description: "Describe the image for people who can't see it." } },
    { name: "blur", type: "text", admin: { hidden: true } },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (!req.file?.data) return data;
        const preview = await sharp(req.file.data).rotate().resize(8).webp({ quality: 70 }).toBuffer();
        return { ...data, blur: `data:image/webp;base64,${preview.toString("base64")}` };
      },
    ],
  },
};
