import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_image_position" AS ENUM('top', 'bottom', 'left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_intro_layout" AS ENUM('split', 'stacked');
  CREATE TYPE "public"."enum_pages_blocks_intro_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_pages_blocks_collage_split_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_collage_split_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_pages_blocks_promo_cards_cards_position" AS ENUM('top', 'bottom', 'left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_promo_cards_tone" AS ENUM('white', 'cream');
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"image_id" integer NOT NULL,
  	"image_position" "enum_pages_blocks_hero_image_position",
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"layout" "enum_pages_blocks_intro_layout" DEFAULT 'split',
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"tone" "enum_pages_blocks_intro_tone" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_collage_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"images_main_id" integer NOT NULL,
  	"images_top_id" integer NOT NULL,
  	"images_bottom_id" integer NOT NULL,
  	"side" "enum_pages_blocks_collage_split_side" DEFAULT 'left',
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"tone" "enum_pages_blocks_collage_split_tone" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_promo_cards_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"position" "enum_pages_blocks_promo_cards_cards_position",
  	"cta_label" varchar NOT NULL,
  	"cta_href" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_promo_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tone" "enum_pages_blocks_promo_cards_tone" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Connect with us' NOT NULL,
  	"intro" varchar DEFAULT 'Keep up with what we are up to on social media, and get the chance to get promotions!',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"blur" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_intro" ADD CONSTRAINT "pages_blocks_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_collage_split" ADD CONSTRAINT "pages_blocks_collage_split_images_main_id_media_id_fk" FOREIGN KEY ("images_main_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_collage_split" ADD CONSTRAINT "pages_blocks_collage_split_images_top_id_media_id_fk" FOREIGN KEY ("images_top_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_collage_split" ADD CONSTRAINT "pages_blocks_collage_split_images_bottom_id_media_id_fk" FOREIGN KEY ("images_bottom_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_collage_split" ADD CONSTRAINT "pages_blocks_collage_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_promo_cards_cards" ADD CONSTRAINT "pages_blocks_promo_cards_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_promo_cards_cards" ADD CONSTRAINT "pages_blocks_promo_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_promo_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_promo_cards" ADD CONSTRAINT "pages_blocks_promo_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_social_links" ADD CONSTRAINT "pages_blocks_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_image_idx" ON "pages_blocks_hero" USING btree ("image_id");
  CREATE INDEX "pages_blocks_intro_order_idx" ON "pages_blocks_intro" USING btree ("_order");
  CREATE INDEX "pages_blocks_intro_parent_id_idx" ON "pages_blocks_intro" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_intro_path_idx" ON "pages_blocks_intro" USING btree ("_path");
  CREATE INDEX "pages_blocks_collage_split_order_idx" ON "pages_blocks_collage_split" USING btree ("_order");
  CREATE INDEX "pages_blocks_collage_split_parent_id_idx" ON "pages_blocks_collage_split" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_collage_split_path_idx" ON "pages_blocks_collage_split" USING btree ("_path");
  CREATE INDEX "pages_blocks_collage_split_images_images_main_idx" ON "pages_blocks_collage_split" USING btree ("images_main_id");
  CREATE INDEX "pages_blocks_collage_split_images_images_top_idx" ON "pages_blocks_collage_split" USING btree ("images_top_id");
  CREATE INDEX "pages_blocks_collage_split_images_images_bottom_idx" ON "pages_blocks_collage_split" USING btree ("images_bottom_id");
  CREATE INDEX "pages_blocks_promo_cards_cards_order_idx" ON "pages_blocks_promo_cards_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_promo_cards_cards_parent_id_idx" ON "pages_blocks_promo_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_promo_cards_cards_image_idx" ON "pages_blocks_promo_cards_cards" USING btree ("image_id");
  CREATE INDEX "pages_blocks_promo_cards_order_idx" ON "pages_blocks_promo_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_promo_cards_parent_id_idx" ON "pages_blocks_promo_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_promo_cards_path_idx" ON "pages_blocks_promo_cards" USING btree ("_path");
  CREATE INDEX "pages_blocks_social_links_order_idx" ON "pages_blocks_social_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_social_links_parent_id_idx" ON "pages_blocks_social_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_social_links_path_idx" ON "pages_blocks_social_links" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_intro" CASCADE;
  DROP TABLE "pages_blocks_collage_split" CASCADE;
  DROP TABLE "pages_blocks_promo_cards_cards" CASCADE;
  DROP TABLE "pages_blocks_promo_cards" CASCADE;
  DROP TABLE "pages_blocks_social_links" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_hero_image_position";
  DROP TYPE "public"."enum_pages_blocks_intro_layout";
  DROP TYPE "public"."enum_pages_blocks_intro_tone";
  DROP TYPE "public"."enum_pages_blocks_collage_split_side";
  DROP TYPE "public"."enum_pages_blocks_collage_split_tone";
  DROP TYPE "public"."enum_pages_blocks_promo_cards_cards_position";
  DROP TYPE "public"."enum_pages_blocks_promo_cards_tone";`)
}
