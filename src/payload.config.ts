import path from "node:path";
import { fileURLToPath } from "node:url";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Media } from "./payload/collections/Media";
import { Pages } from "./payload/collections/Pages";
import { Users } from "./payload/collections/Users";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Payload CMS: the admin at /admin and the content behind Payload pages. This proof of concept
 * keeps its data in a local SQLite file; on a host like Netlify you'd switch to Postgres
 * (@payloadcms/db-postgres) and store uploads with a storage adapter.
 */
export default buildConfig({
  admin: { user: Users.slug, importMap: { baseDir: path.resolve(dirname) }, meta: { titleSuffix: " | The Collective admin" } },
  collections: [Pages, Media, Users],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? "",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db: sqliteAdapter({ client: { url: process.env.DATABASE_URI ?? "file:./payload.db" } }),
  sharp,
});
