import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_intro_buttons" AS ENUM('light', 'dark', 'contact');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_pages_blocks_faq_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_pages_blocks_faq_directory_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_pages_blocks_open_positions_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_pages_blocks_media_kit_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_pages_blocks_promo_cards_cards_enquiry" AS ENUM('living', 'working', 'serviced', 'events', 'waitlist');
  CREATE TABLE "pages_blocks_testimonials_people" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"photo_id" integer NOT NULL,
  	"video" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"intro" varchar,
  	"tone" "enum_pages_blocks_testimonials_tone" DEFAULT 'cream',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"numbered" boolean
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"intro" varchar,
  	"tone" "enum_pages_blocks_faq_tone" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_directory_topics_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"numbered" boolean
  );
  
  CREATE TABLE "pages_blocks_faq_directory_topics" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"topic" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq_directory" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tone" "enum_pages_blocks_faq_directory_tone" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_open_positions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Open positions' NOT NULL,
  	"tone" "enum_pages_blocks_open_positions_tone" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_media_kit" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"intro" varchar,
  	"tone" "enum_pages_blocks_media_kit_tone" DEFAULT 'cream',
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "cta_href" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "video_label" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "video_url" varchar;
  ALTER TABLE "pages_blocks_intro" ADD COLUMN "buttons" "enum_pages_blocks_intro_buttons" DEFAULT 'light';
  ALTER TABLE "pages_blocks_link_cards" ADD COLUMN "more_link_label" varchar;
  ALTER TABLE "pages_blocks_link_cards" ADD COLUMN "more_link_href" varchar;
  ALTER TABLE "pages_blocks_promo_cards_cards" ADD COLUMN "enquiry" "enum_pages_blocks_promo_cards_cards_enquiry";
  ALTER TABLE "pages_blocks_testimonials_people" ADD CONSTRAINT "pages_blocks_testimonials_people_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_people" ADD CONSTRAINT "pages_blocks_testimonials_people_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_directory_topics_items" ADD CONSTRAINT "pages_blocks_faq_directory_topics_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_directory_topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_directory_topics" ADD CONSTRAINT "pages_blocks_faq_directory_topics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_directory"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_directory" ADD CONSTRAINT "pages_blocks_faq_directory_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_open_positions" ADD CONSTRAINT "pages_blocks_open_positions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_kit" ADD CONSTRAINT "pages_blocks_media_kit_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_testimonials_people_order_idx" ON "pages_blocks_testimonials_people" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_people_parent_id_idx" ON "pages_blocks_testimonials_people" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_people_photo_idx" ON "pages_blocks_testimonials_people" USING btree ("photo_id");
  CREATE INDEX "pages_blocks_testimonials_order_idx" ON "pages_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_parent_id_idx" ON "pages_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_path_idx" ON "pages_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_items_order_idx" ON "pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_items_parent_id_idx" ON "pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_directory_topics_items_order_idx" ON "pages_blocks_faq_directory_topics_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_directory_topics_items_parent_id_idx" ON "pages_blocks_faq_directory_topics_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_directory_topics_order_idx" ON "pages_blocks_faq_directory_topics" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_directory_topics_parent_id_idx" ON "pages_blocks_faq_directory_topics" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_directory_order_idx" ON "pages_blocks_faq_directory" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_directory_parent_id_idx" ON "pages_blocks_faq_directory" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_directory_path_idx" ON "pages_blocks_faq_directory" USING btree ("_path");
  CREATE INDEX "pages_blocks_open_positions_order_idx" ON "pages_blocks_open_positions" USING btree ("_order");
  CREATE INDEX "pages_blocks_open_positions_parent_id_idx" ON "pages_blocks_open_positions" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_open_positions_path_idx" ON "pages_blocks_open_positions" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_kit_order_idx" ON "pages_blocks_media_kit" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_kit_parent_id_idx" ON "pages_blocks_media_kit" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_kit_path_idx" ON "pages_blocks_media_kit" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_testimonials_people" CASCADE;
  DROP TABLE "pages_blocks_testimonials" CASCADE;
  DROP TABLE "pages_blocks_faq_items" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_faq_directory_topics_items" CASCADE;
  DROP TABLE "pages_blocks_faq_directory_topics" CASCADE;
  DROP TABLE "pages_blocks_faq_directory" CASCADE;
  DROP TABLE "pages_blocks_open_positions" CASCADE;
  DROP TABLE "pages_blocks_media_kit" CASCADE;
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "cta_label";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "cta_href";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "video_label";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "video_url";
  ALTER TABLE "pages_blocks_intro" DROP COLUMN "buttons";
  ALTER TABLE "pages_blocks_link_cards" DROP COLUMN "more_link_label";
  ALTER TABLE "pages_blocks_link_cards" DROP COLUMN "more_link_href";
  ALTER TABLE "pages_blocks_promo_cards_cards" DROP COLUMN "enquiry";
  DROP TYPE "public"."enum_pages_blocks_intro_buttons";
  DROP TYPE "public"."enum_pages_blocks_testimonials_tone";
  DROP TYPE "public"."enum_pages_blocks_faq_tone";
  DROP TYPE "public"."enum_pages_blocks_faq_directory_tone";
  DROP TYPE "public"."enum_pages_blocks_open_positions_tone";
  DROP TYPE "public"."enum_pages_blocks_media_kit_tone";
  DROP TYPE "public"."enum_pages_blocks_promo_cards_cards_enquiry";`)
}
