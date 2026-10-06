import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_enquiry" AS ENUM('living', 'working', 'serviced', 'events', 'waitlist');
  CREATE TYPE "public"."enum_pages_blocks_intro_enquiry" AS ENUM('living', 'working', 'serviced', 'events', 'waitlist');
  CREATE TYPE "public"."enum_pages_blocks_gallery_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_pages_blocks_feature_groups_groups_items_icon" AS ENUM('Api', 'Automate', 'BarKitchen', 'Basin', 'Bed', 'Bike', 'Bill', 'Bus', 'Calendar', 'CalendarCheck', 'Car', 'Cctv', 'Check', 'Chef', 'Cocktail', 'Community', 'Crowd', 'Database', 'DealFlow', 'Desk', 'Dining', 'DoorEntry', 'Dumbbell', 'FeasibilityModel', 'FruitBowl', 'Groceries', 'Guard', 'Hack', 'HandsHeart', 'Handshake', 'Help', 'Hob', 'Icon360', 'Info', 'IntegrateData', 'Integrations', 'Lion', 'LocationPin', 'Lock', 'Lounge', 'Mail', 'ManageMembership', 'MeetingTable', 'MemberSupport', 'Membership', 'Microwave', 'Outdoor', 'Oven', 'Padlock', 'People', 'Plane', 'Play', 'PrivateOffice', 'QuoteMark', 'Relationships', 'Reporting', 'Restaurant', 'RestaurantsNearby', 'RoomAllocation', 'RoomPricing', 'Roundel', 'Router', 'Scales', 'Shelves', 'SmartHome', 'SocialNetwork', 'Sofa', 'SprayBottle', 'Sprout', 'Star', 'SunCloud', 'TapeMeasure', 'TeamChat', 'TrackMarket', 'Train', 'WashingMachine', 'Workshop', 'Wrench');
  CREATE TYPE "public"."enum_pages_blocks_feature_groups_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_pages_blocks_location_cards_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_pages_blocks_download_card_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_pages_floating_enquiry" AS ENUM('living', 'working', 'serviced', 'events');
  ALTER TYPE "public"."enum_pages_blocks_intro_buttons" ADD VALUE 'enquiry';
  CREATE TABLE "pages_blocks_gallery_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "pages_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"intro" varchar,
  	"tone" "enum_pages_blocks_gallery_tone" DEFAULT 'cream',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_groups_groups_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"icon" "enum_pages_blocks_feature_groups_groups_items_icon" NOT NULL
  );
  
  CREATE TABLE "pages_blocks_feature_groups_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"intro" varchar,
  	"tone" "enum_pages_blocks_feature_groups_tone" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_location_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"intro" varchar,
  	"cta_label" varchar DEFAULT 'More info',
  	"tone" "enum_pages_blocks_location_cards_tone" DEFAULT 'cream',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_download_card" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"intro" varchar NOT NULL,
  	"file_label" varchar NOT NULL,
  	"file_href" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"tone" "enum_pages_blocks_download_card_tone" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locations_id" integer
  );
  
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "enquiry" "enum_pages_blocks_hero_enquiry";
  ALTER TABLE "pages_blocks_intro" ADD COLUMN "enquiry" "enum_pages_blocks_intro_enquiry";
  ALTER TABLE "pages" ADD COLUMN "floating_enquiry" "enum_pages_floating_enquiry";
  ALTER TABLE "pages_blocks_gallery_photos" ADD CONSTRAINT "pages_blocks_gallery_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_photos" ADD CONSTRAINT "pages_blocks_gallery_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery" ADD CONSTRAINT "pages_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_groups_groups_items" ADD CONSTRAINT "pages_blocks_feature_groups_groups_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_groups_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_groups_groups" ADD CONSTRAINT "pages_blocks_feature_groups_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_groups" ADD CONSTRAINT "pages_blocks_feature_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_location_cards" ADD CONSTRAINT "pages_blocks_location_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_download_card" ADD CONSTRAINT "pages_blocks_download_card_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_download_card" ADD CONSTRAINT "pages_blocks_download_card_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_gallery_photos_order_idx" ON "pages_blocks_gallery_photos" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_photos_parent_id_idx" ON "pages_blocks_gallery_photos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_photos_image_idx" ON "pages_blocks_gallery_photos" USING btree ("image_id");
  CREATE INDEX "pages_blocks_gallery_order_idx" ON "pages_blocks_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_parent_id_idx" ON "pages_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_path_idx" ON "pages_blocks_gallery" USING btree ("_path");
  CREATE INDEX "pages_blocks_feature_groups_groups_items_order_idx" ON "pages_blocks_feature_groups_groups_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_groups_groups_items_parent_id_idx" ON "pages_blocks_feature_groups_groups_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_groups_groups_order_idx" ON "pages_blocks_feature_groups_groups" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_groups_groups_parent_id_idx" ON "pages_blocks_feature_groups_groups" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_groups_order_idx" ON "pages_blocks_feature_groups" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_groups_parent_id_idx" ON "pages_blocks_feature_groups" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_groups_path_idx" ON "pages_blocks_feature_groups" USING btree ("_path");
  CREATE INDEX "pages_blocks_location_cards_order_idx" ON "pages_blocks_location_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_location_cards_parent_id_idx" ON "pages_blocks_location_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_location_cards_path_idx" ON "pages_blocks_location_cards" USING btree ("_path");
  CREATE INDEX "pages_blocks_download_card_order_idx" ON "pages_blocks_download_card" USING btree ("_order");
  CREATE INDEX "pages_blocks_download_card_parent_id_idx" ON "pages_blocks_download_card" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_download_card_path_idx" ON "pages_blocks_download_card" USING btree ("_path");
  CREATE INDEX "pages_blocks_download_card_image_idx" ON "pages_blocks_download_card" USING btree ("image_id");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_locations_id_idx" ON "pages_rels" USING btree ("locations_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_gallery_photos" CASCADE;
  DROP TABLE "pages_blocks_gallery" CASCADE;
  DROP TABLE "pages_blocks_feature_groups_groups_items" CASCADE;
  DROP TABLE "pages_blocks_feature_groups_groups" CASCADE;
  DROP TABLE "pages_blocks_feature_groups" CASCADE;
  DROP TABLE "pages_blocks_location_cards" CASCADE;
  DROP TABLE "pages_blocks_download_card" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  ALTER TABLE "pages_blocks_intro" ALTER COLUMN "buttons" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_intro" ALTER COLUMN "buttons" SET DEFAULT 'light'::text;
  DROP TYPE "public"."enum_pages_blocks_intro_buttons";
  CREATE TYPE "public"."enum_pages_blocks_intro_buttons" AS ENUM('light', 'dark', 'contact');
  ALTER TABLE "pages_blocks_intro" ALTER COLUMN "buttons" SET DEFAULT 'light'::"public"."enum_pages_blocks_intro_buttons";
  ALTER TABLE "pages_blocks_intro" ALTER COLUMN "buttons" SET DATA TYPE "public"."enum_pages_blocks_intro_buttons" USING "buttons"::"public"."enum_pages_blocks_intro_buttons";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "enquiry";
  ALTER TABLE "pages_blocks_intro" DROP COLUMN "enquiry";
  ALTER TABLE "pages" DROP COLUMN "floating_enquiry";
  DROP TYPE "public"."enum_pages_blocks_hero_enquiry";
  DROP TYPE "public"."enum_pages_blocks_intro_enquiry";
  DROP TYPE "public"."enum_pages_blocks_gallery_tone";
  DROP TYPE "public"."enum_pages_blocks_feature_groups_groups_items_icon";
  DROP TYPE "public"."enum_pages_blocks_feature_groups_tone";
  DROP TYPE "public"."enum_pages_blocks_location_cards_tone";
  DROP TYPE "public"."enum_pages_blocks_download_card_tone";
  DROP TYPE "public"."enum_pages_floating_enquiry";`)
}
