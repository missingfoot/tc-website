import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_location_pages_working_pricing_button_opens" AS ENUM('enquiry', 'link', 'none');
  CREATE TYPE "public"."enum_location_pages_serviced_pricing_button_opens" AS ENUM('enquiry', 'link', 'none');
  CREATE TYPE "public"."enum_location_pages_venues_pricing_button_opens" AS ENUM('enquiry', 'link', 'none');
  ALTER TABLE "location_pages" ADD COLUMN "working_pricing_heading" varchar DEFAULT 'Pricing' NOT NULL;
  ALTER TABLE "location_pages" ADD COLUMN "working_pricing_note" varchar;
  ALTER TABLE "location_pages" ADD COLUMN "working_pricing_button_opens" "enum_location_pages_working_pricing_button_opens" DEFAULT 'enquiry';
  ALTER TABLE "location_pages" ADD COLUMN "working_pricing_button_href" varchar;
  ALTER TABLE "location_pages" ADD COLUMN "working_pricing_button_label" varchar;
  ALTER TABLE "location_pages" ADD COLUMN "serviced_pricing_heading" varchar DEFAULT 'Pricing' NOT NULL;
  ALTER TABLE "location_pages" ADD COLUMN "serviced_pricing_note" varchar;
  ALTER TABLE "location_pages" ADD COLUMN "serviced_pricing_button_opens" "enum_location_pages_serviced_pricing_button_opens" DEFAULT 'enquiry';
  ALTER TABLE "location_pages" ADD COLUMN "serviced_pricing_button_href" varchar;
  ALTER TABLE "location_pages" ADD COLUMN "serviced_pricing_button_label" varchar;
  ALTER TABLE "location_pages" ADD COLUMN "venues_pricing_heading" varchar DEFAULT 'Pricing' NOT NULL;
  ALTER TABLE "location_pages" ADD COLUMN "venues_pricing_intro" varchar;
  ALTER TABLE "location_pages" ADD COLUMN "venues_pricing_note" varchar;
  ALTER TABLE "location_pages" ADD COLUMN "venues_pricing_button_opens" "enum_location_pages_venues_pricing_button_opens" DEFAULT 'enquiry';
  ALTER TABLE "location_pages" ADD COLUMN "venues_pricing_button_href" varchar;
  ALTER TABLE "location_pages" ADD COLUMN "venues_pricing_button_label" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "location_pages" DROP COLUMN "working_pricing_heading";
  ALTER TABLE "location_pages" DROP COLUMN "working_pricing_note";
  ALTER TABLE "location_pages" DROP COLUMN "working_pricing_button_opens";
  ALTER TABLE "location_pages" DROP COLUMN "working_pricing_button_href";
  ALTER TABLE "location_pages" DROP COLUMN "working_pricing_button_label";
  ALTER TABLE "location_pages" DROP COLUMN "serviced_pricing_heading";
  ALTER TABLE "location_pages" DROP COLUMN "serviced_pricing_note";
  ALTER TABLE "location_pages" DROP COLUMN "serviced_pricing_button_opens";
  ALTER TABLE "location_pages" DROP COLUMN "serviced_pricing_button_href";
  ALTER TABLE "location_pages" DROP COLUMN "serviced_pricing_button_label";
  ALTER TABLE "location_pages" DROP COLUMN "venues_pricing_heading";
  ALTER TABLE "location_pages" DROP COLUMN "venues_pricing_intro";
  ALTER TABLE "location_pages" DROP COLUMN "venues_pricing_note";
  ALTER TABLE "location_pages" DROP COLUMN "venues_pricing_button_opens";
  ALTER TABLE "location_pages" DROP COLUMN "venues_pricing_button_href";
  ALTER TABLE "location_pages" DROP COLUMN "venues_pricing_button_label";
  DROP TYPE "public"."enum_location_pages_working_pricing_button_opens";
  DROP TYPE "public"."enum_location_pages_serviced_pricing_button_opens";
  DROP TYPE "public"."enum_location_pages_venues_pricing_button_opens";`)
}
