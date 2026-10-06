import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_room_cards_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_pages_blocks_reviews_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_pages_blocks_directions_travel_modes_icon" AS ENUM('underground', 'overground', 'bus', 'car');
  CREATE TYPE "public"."enum_pages_blocks_directions_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_rooms_features_icon" AS ENUM('Api', 'Automate', 'BarKitchen', 'Basin', 'Bed', 'Bike', 'Bill', 'Bus', 'Calendar', 'CalendarCheck', 'Car', 'Cctv', 'Check', 'Chef', 'Cocktail', 'Community', 'Crowd', 'Database', 'DealFlow', 'Desk', 'Dining', 'DoorEntry', 'Dumbbell', 'FeasibilityModel', 'FruitBowl', 'Groceries', 'Guard', 'Hack', 'HandsHeart', 'Handshake', 'Help', 'Hob', 'Icon360', 'Info', 'IntegrateData', 'Integrations', 'Lion', 'LocationPin', 'Lock', 'Lounge', 'Mail', 'ManageMembership', 'MeetingTable', 'MemberSupport', 'Membership', 'Microwave', 'Outdoor', 'Oven', 'Padlock', 'People', 'Plane', 'Play', 'PrivateOffice', 'QuoteMark', 'Relationships', 'Reporting', 'Restaurant', 'RestaurantsNearby', 'RoomAllocation', 'RoomPricing', 'Roundel', 'Router', 'Scales', 'Shelves', 'SmartHome', 'SocialNetwork', 'Sofa', 'SprayBottle', 'Sprout', 'Star', 'SunCloud', 'TapeMeasure', 'TeamChat', 'TrackMarket', 'Train', 'WashingMachine', 'Workshop', 'Wrench');
  CREATE TABLE "pages_blocks_room_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"intro" varchar,
  	"cta_label" varchar DEFAULT 'View Room',
  	"tone" "enum_pages_blocks_room_cards_tone" DEFAULT 'cream',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_reviews_reviews" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"rating" numeric DEFAULT 5 NOT NULL,
  	"photo_id" integer,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_reviews" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"intro" varchar,
  	"tone" "enum_pages_blocks_reviews_tone" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_directions_travel_modes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"icon" "enum_pages_blocks_directions_travel_modes_icon" NOT NULL,
  	"steps" varchar NOT NULL,
  	"maps_url" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_directions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Well connected' NOT NULL,
  	"intro" varchar,
  	"place" varchar NOT NULL,
  	"map_embed_url" varchar NOT NULL,
  	"tone" "enum_pages_blocks_directions_tone" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "rooms_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"icon" "enum_rooms_features_icon" NOT NULL
  );
  
  CREATE TABLE "rooms_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "rooms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"price" varchar NOT NULL,
  	"location" varchar DEFAULT 'Old Oak, Willesden Junction' NOT NULL,
  	"image_id" integer NOT NULL,
  	"about" varchar NOT NULL,
  	"floor_plan_id" integer,
  	"move_in" varchar NOT NULL,
  	"floor" varchar NOT NULL,
  	"periods" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "pages_blocks_gallery" ADD COLUMN "tour_label" varchar DEFAULT 'View 3D Tour';
  ALTER TABLE "pages_blocks_gallery" ADD COLUMN "tour_href" varchar;
  ALTER TABLE "pages_rels" ADD COLUMN "rooms_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "rooms_id" integer;
  ALTER TABLE "pages_blocks_room_cards" ADD CONSTRAINT "pages_blocks_room_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_reviews_reviews" ADD CONSTRAINT "pages_blocks_reviews_reviews_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_reviews_reviews" ADD CONSTRAINT "pages_blocks_reviews_reviews_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_reviews" ADD CONSTRAINT "pages_blocks_reviews_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_directions_travel_modes" ADD CONSTRAINT "pages_blocks_directions_travel_modes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_directions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_directions" ADD CONSTRAINT "pages_blocks_directions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "rooms_features" ADD CONSTRAINT "rooms_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "rooms_photos" ADD CONSTRAINT "rooms_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "rooms_photos" ADD CONSTRAINT "rooms_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "rooms" ADD CONSTRAINT "rooms_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "rooms" ADD CONSTRAINT "rooms_floor_plan_id_media_id_fk" FOREIGN KEY ("floor_plan_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_room_cards_order_idx" ON "pages_blocks_room_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_room_cards_parent_id_idx" ON "pages_blocks_room_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_room_cards_path_idx" ON "pages_blocks_room_cards" USING btree ("_path");
  CREATE INDEX "pages_blocks_reviews_reviews_order_idx" ON "pages_blocks_reviews_reviews" USING btree ("_order");
  CREATE INDEX "pages_blocks_reviews_reviews_parent_id_idx" ON "pages_blocks_reviews_reviews" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_reviews_reviews_photo_idx" ON "pages_blocks_reviews_reviews" USING btree ("photo_id");
  CREATE INDEX "pages_blocks_reviews_order_idx" ON "pages_blocks_reviews" USING btree ("_order");
  CREATE INDEX "pages_blocks_reviews_parent_id_idx" ON "pages_blocks_reviews" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_reviews_path_idx" ON "pages_blocks_reviews" USING btree ("_path");
  CREATE INDEX "pages_blocks_directions_travel_modes_order_idx" ON "pages_blocks_directions_travel_modes" USING btree ("_order");
  CREATE INDEX "pages_blocks_directions_travel_modes_parent_id_idx" ON "pages_blocks_directions_travel_modes" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_directions_order_idx" ON "pages_blocks_directions" USING btree ("_order");
  CREATE INDEX "pages_blocks_directions_parent_id_idx" ON "pages_blocks_directions" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_directions_path_idx" ON "pages_blocks_directions" USING btree ("_path");
  CREATE INDEX "rooms_features_order_idx" ON "rooms_features" USING btree ("_order");
  CREATE INDEX "rooms_features_parent_id_idx" ON "rooms_features" USING btree ("_parent_id");
  CREATE INDEX "rooms_photos_order_idx" ON "rooms_photos" USING btree ("_order");
  CREATE INDEX "rooms_photos_parent_id_idx" ON "rooms_photos" USING btree ("_parent_id");
  CREATE INDEX "rooms_photos_image_idx" ON "rooms_photos" USING btree ("image_id");
  CREATE INDEX "rooms__order_idx" ON "rooms" USING btree ("_order");
  CREATE UNIQUE INDEX "rooms_slug_idx" ON "rooms" USING btree ("slug");
  CREATE INDEX "rooms_image_idx" ON "rooms" USING btree ("image_id");
  CREATE INDEX "rooms_floor_plan_idx" ON "rooms" USING btree ("floor_plan_id");
  CREATE INDEX "rooms_updated_at_idx" ON "rooms" USING btree ("updated_at");
  CREATE INDEX "rooms_created_at_idx" ON "rooms" USING btree ("created_at");
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_rooms_fk" FOREIGN KEY ("rooms_id") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_rooms_fk" FOREIGN KEY ("rooms_id") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_rels_rooms_id_idx" ON "pages_rels" USING btree ("rooms_id");
  CREATE INDEX "payload_locked_documents_rels_rooms_id_idx" ON "payload_locked_documents_rels" USING btree ("rooms_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_room_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_reviews_reviews" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_reviews" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_directions_travel_modes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_directions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "rooms_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "rooms_photos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "rooms" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_room_cards" CASCADE;
  DROP TABLE "pages_blocks_reviews_reviews" CASCADE;
  DROP TABLE "pages_blocks_reviews" CASCADE;
  DROP TABLE "pages_blocks_directions_travel_modes" CASCADE;
  DROP TABLE "pages_blocks_directions" CASCADE;
  DROP TABLE "rooms_features" CASCADE;
  DROP TABLE "rooms_photos" CASCADE;
  DROP TABLE "rooms" CASCADE;
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_rooms_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_rooms_fk";
  
  DROP INDEX "pages_rels_rooms_id_idx";
  DROP INDEX "payload_locked_documents_rels_rooms_id_idx";
  ALTER TABLE "pages_blocks_gallery" DROP COLUMN "tour_label";
  ALTER TABLE "pages_blocks_gallery" DROP COLUMN "tour_href";
  ALTER TABLE "pages_rels" DROP COLUMN "rooms_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "rooms_id";
  DROP TYPE "public"."enum_pages_blocks_room_cards_tone";
  DROP TYPE "public"."enum_pages_blocks_reviews_tone";
  DROP TYPE "public"."enum_pages_blocks_directions_travel_modes_icon";
  DROP TYPE "public"."enum_pages_blocks_directions_tone";
  DROP TYPE "public"."enum_rooms_features_icon";`)
}
