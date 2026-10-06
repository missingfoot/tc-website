# Payload CMS proof of concept

The site with [Payload](https://payloadcms.com) built in: an admin at `/admin` where pages are put
together from the site's own sections. Foundation (`/foundation`) is served from Payload as the
example; every other page is still written in code.

## Try it

```bash
npm install
# .env needs PAYLOAD_SECRET and DATABASE_URI: the Neon "dev" branch's direct address (no -pooler)
npx payload migrate                    # brings the database up to date
npx payload run src/payload/seed.ts   # the Foundation page (safe to rerun)
npm run dev                            # then open http://localhost:3000/admin
```

1. On first visit, `/admin` asks you to create a user: that's your login.
2. **Pages → Foundation**: edit a heading or paragraph, reorder sections by dragging, swap a photo,
   then **Save** and reload `/foundation`.
3. **Pages → Create new**: give it a title and slug (e.g. `our-story`), add a Hero and an Intro, save,
   and it's live at `/our-story`.

## How it fits together

| What | Where |
| --- | --- |
| Payload config (collections, database) | `src/payload.config.ts` |
| Database migrations | `src/migrations/` |
| Page sections editors can add | `src/payload/blocks.ts`, one per section component |
| Pages and Media collections | `src/payload/collections/` |
| Blocks → section components | `src/components/payload/RenderBlocks.tsx` |
| Payload pages at `/<slug>` | `src/app/(frontend)/(site)/[slug]/page.tsx` |
| Admin and API routes (generated) | `src/app/(payload)/` |
| The site's pages | `src/app/(frontend)/` (moved here: Payload's admin needs its own root layout) |

- **Adding a section type**: add a block in `blocks.ts` with the fields its component takes, a case
  in `RenderBlocks.tsx`, then `npx payload generate:types`.
- **Changing fields or collections** changes the database: run `npx payload migrate:create <name>`,
  then `npx payload migrate`, and commit the migration. The database never updates itself.
- **Edits show straight away**: saving a page refreshes its pre-built HTML (the Pages collection's
  `afterChange` hook).
- **Uploads** get a blurred preview made automatically, and are resized per screen by `next/image`,
  like the site's own photos.
- Pages written in code (e.g. `/co-living`) win over a Payload page with the same slug.

## Deploying (e.g. Netlify)

- **Database**: Postgres on Neon (project `tcweb`): the `production` branch for the live site, `dev`
  for local work. Set `DATABASE_URI` (production's pooled address, with `-pooler`) and
  `PAYLOAD_SECRET` in Netlify's environment variables, and run `npx payload migrate` against
  production (its direct address) before deploying a change that adds migrations.
- **Uploads**: serverless hosts have no lasting disk, so add a storage adapter, e.g.
  `@payloadcms/storage-s3` pointed at Cloudflare R2, and build image URLs from it in
  `src/lib/payload.ts` (`mediaImage`) instead of `/media/…`.
- **Email** (password resets): add an email adapter (e.g. Resend).
- The admin and API run as Netlify Functions; the site's pages stay pre-built.
