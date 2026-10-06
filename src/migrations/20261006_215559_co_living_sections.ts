import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_image_carousel_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_pages_blocks_perk_cards_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_pages_blocks_promo_cards_mobile_shape" AS ENUM('short', 'tall');
  CREATE TABLE "pages_blocks_image_carousel_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_blocks_image_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"intro" varchar,
  	"footer_text" varchar,
  	"footer_link_label" varchar,
  	"footer_link_href" varchar,
  	"tone" "enum_pages_blocks_image_carousel_tone" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_perk_cards_perks" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"logo_id" integer
  );
  
  CREATE TABLE "pages_blocks_perk_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"intro" varchar,
  	"tone" "enum_pages_blocks_perk_cards_tone" DEFAULT 'cream',
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_faq" ADD COLUMN "outro" varchar;
  ALTER TABLE "pages_blocks_faq" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "pages_blocks_faq" ADD COLUMN "cta_href" varchar;
  ALTER TABLE "pages_blocks_faq" ADD COLUMN "anchor" varchar;
  ALTER TABLE "pages_blocks_promo_cards" ADD COLUMN "mobile_shape" "enum_pages_blocks_promo_cards_mobile_shape" DEFAULT 'short';
  ALTER TABLE "pages_blocks_image_carousel_photos" ADD CONSTRAINT "pages_blocks_image_carousel_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_carousel_photos" ADD CONSTRAINT "pages_blocks_image_carousel_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_image_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_carousel" ADD CONSTRAINT "pages_blocks_image_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_perk_cards_perks" ADD CONSTRAINT "pages_blocks_perk_cards_perks_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_perk_cards_perks" ADD CONSTRAINT "pages_blocks_perk_cards_perks_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_perk_cards_perks" ADD CONSTRAINT "pages_blocks_perk_cards_perks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_perk_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_perk_cards" ADD CONSTRAINT "pages_blocks_perk_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_image_carousel_photos_order_idx" ON "pages_blocks_image_carousel_photos" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_carousel_photos_parent_id_idx" ON "pages_blocks_image_carousel_photos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_carousel_photos_image_idx" ON "pages_blocks_image_carousel_photos" USING btree ("image_id");
  CREATE INDEX "pages_blocks_image_carousel_order_idx" ON "pages_blocks_image_carousel" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_carousel_parent_id_idx" ON "pages_blocks_image_carousel" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_carousel_path_idx" ON "pages_blocks_image_carousel" USING btree ("_path");
  CREATE INDEX "pages_blocks_perk_cards_perks_order_idx" ON "pages_blocks_perk_cards_perks" USING btree ("_order");
  CREATE INDEX "pages_blocks_perk_cards_perks_parent_id_idx" ON "pages_blocks_perk_cards_perks" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_perk_cards_perks_image_idx" ON "pages_blocks_perk_cards_perks" USING btree ("image_id");
  CREATE INDEX "pages_blocks_perk_cards_perks_logo_idx" ON "pages_blocks_perk_cards_perks" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_perk_cards_order_idx" ON "pages_blocks_perk_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_perk_cards_parent_id_idx" ON "pages_blocks_perk_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_perk_cards_path_idx" ON "pages_blocks_perk_cards" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_image_carousel_photos" CASCADE;
  DROP TABLE "pages_blocks_image_carousel" CASCADE;
  DROP TABLE "pages_blocks_perk_cards_perks" CASCADE;
  DROP TABLE "pages_blocks_perk_cards" CASCADE;
  ALTER TABLE "pages_blocks_faq" DROP COLUMN "outro";
  ALTER TABLE "pages_blocks_faq" DROP COLUMN "cta_label";
  ALTER TABLE "pages_blocks_faq" DROP COLUMN "cta_href";
  ALTER TABLE "pages_blocks_faq" DROP COLUMN "anchor";
  ALTER TABLE "pages_blocks_promo_cards" DROP COLUMN "mobile_shape";
  DROP TYPE "public"."enum_pages_blocks_image_carousel_tone";
  DROP TYPE "public"."enum_pages_blocks_perk_cards_tone";
  DROP TYPE "public"."enum_pages_blocks_promo_cards_mobile_shape";`)
}
