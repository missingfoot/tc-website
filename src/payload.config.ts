import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Media } from "./payload/collections/Media";
import { Pages } from "./payload/collections/Pages";
import { Users } from "./payload/collections/Users";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Payload CMS: the admin at /admin and the content behind Payload pages. Data lives in Postgres
 * on Neon (DATABASE_URI: the "dev" branch locally, "production" when deployed). Schema changes
 * go through migrations in src/migrations, never auto-push, so dev and production stay in step.
 */
export default buildConfig({
  admin: { user: Users.slug, importMap: { baseDir: path.resolve(dirname) }, meta: { titleSuffix: " | The Collective admin" } },
  collections: [Pages, Media, Users],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? "",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI },
    push: false,
    migrationDir: path.resolve(dirname, "migrations"),
  }),
  sharp,
});
