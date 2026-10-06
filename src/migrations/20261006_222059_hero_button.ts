import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_button_type" AS ENUM('none', 'button', 'video');
  CREATE TYPE "public"."enum_pages_blocks_hero_button_opens" AS ENUM('link', 'enquiry');
  CREATE TYPE "public"."enum_pages_blocks_hero_button_enquiry" AS ENUM('living', 'working', 'serviced', 'events', 'waitlist');
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "button_type" "enum_pages_blocks_hero_button_type" DEFAULT 'none';
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "button_label" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "button_opens" "enum_pages_blocks_hero_button_opens" DEFAULT 'link';
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "button_href" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "button_enquiry" "enum_pages_blocks_hero_button_enquiry";
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "button_arrow" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "button_video_url" varchar;
  -- Each hero's button, moved from the old fields (a video, an enquiry form or a link button) before they go
  UPDATE "pages_blocks_hero" SET
    "button_type" = (CASE
      WHEN coalesce("video_url", '') <> '' THEN 'video'
      WHEN "enquiry" IS NOT NULL OR (coalesce("cta_label", '') <> '' AND coalesce("cta_href", '') <> '') THEN 'button'
      ELSE 'none' END)::"enum_pages_blocks_hero_button_type",
    "button_label" = CASE WHEN coalesce("video_url", '') <> '' THEN "video_label" WHEN "enquiry" IS NULL THEN "cta_label" END,
    "button_opens" = (CASE WHEN "enquiry" IS NOT NULL THEN 'enquiry' ELSE 'link' END)::"enum_pages_blocks_hero_button_opens",
    "button_href" = CASE WHEN "enquiry" IS NULL THEN "cta_href" END,
    "button_enquiry" = "enquiry"::text::"enum_pages_blocks_hero_button_enquiry",
    "button_video_url" = nullif("video_url", '');
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "cta_label";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "cta_href";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "enquiry";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "video_label";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "video_url";
  DROP TYPE "public"."enum_pages_blocks_hero_enquiry";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_enquiry" AS ENUM('living', 'working', 'serviced', 'events', 'waitlist');
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "cta_href" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "enquiry" "enum_pages_blocks_hero_enquiry";
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "video_label" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "video_url" varchar;
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "button_type";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "button_label";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "button_opens";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "button_href";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "button_enquiry";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "button_arrow";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "button_video_url";
  DROP TYPE "public"."enum_pages_blocks_hero_button_type";
  DROP TYPE "public"."enum_pages_blocks_hero_button_opens";
  DROP TYPE "public"."enum_pages_blocks_hero_button_enquiry";`)
}
