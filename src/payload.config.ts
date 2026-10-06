import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Locations } from "./payload/collections/Locations";
import { Media } from "./payload/collections/Media";
import { Pages } from "./payload/collections/Pages";
import { Rooms } from "./payload/collections/Rooms";
import { Users } from "./payload/collections/Users";
import { siteLinks } from "./payload/endpoints/siteLinks";
import { ContactDetails } from "./payload/globals/ContactDetails";
import { LocationPages } from "./payload/globals/LocationPages";
import { Navigation } from "./payload/globals/Navigation";
import { SocialLinksGlobal } from "./payload/globals/SocialLinks";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Payload CMS: the admin at /admin and the content behind Payload pages. Data lives in Postgres
 * on Neon (DATABASE_URI: the "dev" branch locally, "production" when deployed). Schema changes
 * go through migrations in src/migrations, never auto-push, so dev and production stay in step.
 * Uploads are stored in Cloudflare R2 (one bucket per environment, like the database branches)
 * and served from the bucket's public address.
 */
export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: " | The Collective admin", icons: [{ rel: "icon", url: "/favicon.ico" }] },
    // The brand's logo; its font is in app/(payload)/custom.scss
    components: { graphics: { Logo: "/payload/graphics#AdminLogo", Icon: "/payload/graphics#AdminIcon" } },
  },
  collections: [Pages, Locations, Rooms, Media, Users],
  globals: [Navigation, ContactDetails, SocialLinksGlobal, LocationPages],
  endpoints: [siteLinks],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? "",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI },
    push: false,
    migrationDir: path.resolve(dirname, "migrations"),
  }),
  plugins: [
    s3Storage({
      bucket: process.env.R2_BUCKET ?? "",
      config: {
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        region: "auto",
        credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "", secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "" },
      },
      // Uploads go from the browser straight to R2: full-size photos are bigger than a serverless
      // function will accept (about 6MB on Netlify). Needs the bucket's CORS to allow the site.
      clientUploads: true,
      collections: {
        media: {
          disablePayloadAccessControl: true,
          // Browser uploads are stored in a folder of their own (prefix), so the address needs it
          generateFileURL: ({ filename, prefix }) => [process.env.R2_PUBLIC_URL, prefix, filename].filter(Boolean).join("/"),
        },
      },
    }),
  ],
  sharp,
});
