# Payload CMS proof of concept

The site with [Payload](https://payloadcms.com) built in: an admin at `/admin` where pages are put
together from the site's own sections. Home, Old Oak, Co-Living, Working, Serviced Living, Event Spaces,
Mission, Foundation, Careers, Press and FAQ are served from Payload, along with every location, venue
and room page. The rest (blog, Labs, legal pages, referrals, account) are still written in code.

## Try it

```bash
npm install
# .env needs PAYLOAD_SECRET, DATABASE_URI (the Neon "dev" branch's direct address, no -pooler)
# and the R2_* values for the tc-web-dev bucket (see Deploying)
npx payload migrate                    # brings the database up to date
npx payload run src/payload/seed.ts   # the CMS pages (safe to rerun: existing pages are left alone)
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
| Pages, Locations, Rooms and Media collections | `src/payload/collections/` |
| Location pages (`/working/…`, `/serviced-living/…`, `/event-spaces/…`) | their `[slug]` routes, reading Locations |
| Room pages and their apply pages (`/locations/old-oak/rooms/…`) | their `[slug]` routes, reading Rooms |
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
- **Uploads** go from the browser straight to Cloudflare R2, get a blurred preview made
  automatically, and are resized per screen by `next/image`, like the site's own photos.
- **A photo a page uses can't be deleted**: the admin says which pages use it, to replace it there first.
- **Framing photos**: click the photo's focal point in the Media library; crops keep it in view. A
  section's own "position" setting, where it has one, wins.
- Pages written in code (e.g. `/co-living`) win over a Payload page with the same slug.
- **Locations** (working spaces, serviced living houses, event venues) are a collection: each one's
  card and its own page come from the same record, so a price or photo changes in one place. Drag
  to reorder them in the list. What every page of a type shares (e.g. the standard "What's
  included" for working spaces, the promos) is in its `[slug]` route.
- **Rooms** (Old Oak's) work the same way: card, page and booking options from one record.
- **Pages at their own address**: `home` is served at `/` and `old-oak` at `/locations/old-oak`
  (`pagePaths` in the Pages collection); `/home` and `/old-oak` redirect there.
- **Some sections keep part of their content in code**: Open positions lists the job pages
  (`content/careers.ts`), and Media kit's downloads are `content/press.ts`; editors set their headings.
- **Moving a page from code into Payload**: add any missing section types, add the page to
  `seed.ts` (from its content file), delete its `page.tsx`. Before pushing, run the migration and
  seed on production (see Deploying), so the live page exists by the time the code page is gone.

## Deploying (e.g. Netlify)

- **Database**: Postgres on Neon (project `tcweb`): the `production` branch for the live site, `dev`
  for local work. Set `DATABASE_URI` (production's pooled address, with `-pooler`) and
  `PAYLOAD_SECRET` in Netlify's environment variables, and run `npx payload migrate` against
  production (its direct address) before deploying a change that adds migrations.
- **Uploads**: Cloudflare R2 through `@payloadcms/storage-s3`: bucket `tc-web` for the live site,
  `tc-web-dev` for local work. Set `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`
  (an R2 API token with Object Read & Write on both buckets), `R2_BUCKET` and `R2_PUBLIC_URL` (the
  bucket's public address, no trailing slash). The bucket's CORS policy must allow `GET` and `PUT`
  from the site's address, as the admin uploads straight to it. Before launch, swap the r2.dev
  address (rate-limited) for a custom domain: only `R2_PUBLIC_URL` changes.
- **Email** (password resets): add an email adapter (e.g. Resend).
- The admin and API run as Netlify Functions; the site's pages stay pre-built.
