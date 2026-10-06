import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_locations_features_icon" AS ENUM('Api', 'Automate', 'BarKitchen', 'Basin', 'Bed', 'Bike', 'Bill', 'Bus', 'Calendar', 'CalendarCheck', 'Car', 'Cctv', 'Check', 'Chef', 'Cocktail', 'Community', 'Crowd', 'Database', 'DealFlow', 'Desk', 'Dining', 'DoorEntry', 'Dumbbell', 'FeasibilityModel', 'FruitBowl', 'Groceries', 'Guard', 'Hack', 'HandsHeart', 'Handshake', 'Help', 'Hob', 'Icon360', 'Info', 'IntegrateData', 'Integrations', 'Lion', 'LocationPin', 'Lock', 'Lounge', 'Mail', 'ManageMembership', 'MeetingTable', 'MemberSupport', 'Membership', 'Microwave', 'Outdoor', 'Oven', 'Padlock', 'People', 'Plane', 'Play', 'PrivateOffice', 'QuoteMark', 'Relationships', 'Reporting', 'Restaurant', 'RestaurantsNearby', 'RoomAllocation', 'RoomPricing', 'Roundel', 'Router', 'Scales', 'Shelves', 'SmartHome', 'SocialNetwork', 'Sofa', 'SprayBottle', 'Sprout', 'Star', 'SunCloud', 'TapeMeasure', 'TeamChat', 'TrackMarket', 'Train', 'WashingMachine', 'Workshop', 'Wrench');
  CREATE TYPE "public"."enum_locations_included_items_icon" AS ENUM('Api', 'Automate', 'BarKitchen', 'Basin', 'Bed', 'Bike', 'Bill', 'Bus', 'Calendar', 'CalendarCheck', 'Car', 'Cctv', 'Check', 'Chef', 'Cocktail', 'Community', 'Crowd', 'Database', 'DealFlow', 'Desk', 'Dining', 'DoorEntry', 'Dumbbell', 'FeasibilityModel', 'FruitBowl', 'Groceries', 'Guard', 'Hack', 'HandsHeart', 'Handshake', 'Help', 'Hob', 'Icon360', 'Info', 'IntegrateData', 'Integrations', 'Lion', 'LocationPin', 'Lock', 'Lounge', 'Mail', 'ManageMembership', 'MeetingTable', 'MemberSupport', 'Membership', 'Microwave', 'Outdoor', 'Oven', 'Padlock', 'People', 'Plane', 'Play', 'PrivateOffice', 'QuoteMark', 'Relationships', 'Reporting', 'Restaurant', 'RestaurantsNearby', 'RoomAllocation', 'RoomPricing', 'Roundel', 'Router', 'Scales', 'Shelves', 'SmartHome', 'SocialNetwork', 'Sofa', 'SprayBottle', 'Sprout', 'Star', 'SunCloud', 'TapeMeasure', 'TeamChat', 'TrackMarket', 'Train', 'WashingMachine', 'Workshop', 'Wrench');
  CREATE TYPE "public"."enum_locations_travel_modes_icon" AS ENUM('underground', 'overground', 'bus', 'car');
  CREATE TYPE "public"."enum_locations_type" AS ENUM('working', 'serviced', 'venue');
  CREATE TABLE "locations_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"icon" "enum_locations_features_icon" NOT NULL
  );
  
  CREATE TABLE "locations_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "locations_prices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"amount" varchar NOT NULL,
  	"period" varchar NOT NULL
  );
  
  CREATE TABLE "locations_included_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"icon" "enum_locations_included_items_icon" NOT NULL
  );
  
  CREATE TABLE "locations_included" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "locations_travel_modes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"icon" "enum_locations_travel_modes_icon" NOT NULL,
  	"steps" varchar NOT NULL,
  	"maps_url" varchar NOT NULL
  );
  
  CREATE TABLE "locations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"type" "enum_locations_type" NOT NULL,
  	"area" varchar NOT NULL,
  	"postcode" varchar NOT NULL,
  	"from_price" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"intro" varchar NOT NULL,
  	"address" varchar,
  	"directions_intro" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "media" ADD COLUMN "source" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "locations_id" integer;
  ALTER TABLE "locations_features" ADD CONSTRAINT "locations_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations_gallery" ADD CONSTRAINT "locations_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "locations_gallery" ADD CONSTRAINT "locations_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations_prices" ADD CONSTRAINT "locations_prices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations_included_items" ADD CONSTRAINT "locations_included_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations_included"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations_included" ADD CONSTRAINT "locations_included_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations_travel_modes" ADD CONSTRAINT "locations_travel_modes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations" ADD CONSTRAINT "locations_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "locations_features_order_idx" ON "locations_features" USING btree ("_order");
  CREATE INDEX "locations_features_parent_id_idx" ON "locations_features" USING btree ("_parent_id");
  CREATE INDEX "locations_gallery_order_idx" ON "locations_gallery" USING btree ("_order");
  CREATE INDEX "locations_gallery_parent_id_idx" ON "locations_gallery" USING btree ("_parent_id");
  CREATE INDEX "locations_gallery_image_idx" ON "locations_gallery" USING btree ("image_id");
  CREATE INDEX "locations_prices_order_idx" ON "locations_prices" USING btree ("_order");
  CREATE INDEX "locations_prices_parent_id_idx" ON "locations_prices" USING btree ("_parent_id");
  CREATE INDEX "locations_included_items_order_idx" ON "locations_included_items" USING btree ("_order");
  CREATE INDEX "locations_included_items_parent_id_idx" ON "locations_included_items" USING btree ("_parent_id");
  CREATE INDEX "locations_included_order_idx" ON "locations_included" USING btree ("_order");
  CREATE INDEX "locations_included_parent_id_idx" ON "locations_included" USING btree ("_parent_id");
  CREATE INDEX "locations_travel_modes_order_idx" ON "locations_travel_modes" USING btree ("_order");
  CREATE INDEX "locations_travel_modes_parent_id_idx" ON "locations_travel_modes" USING btree ("_parent_id");
  CREATE INDEX "locations__order_idx" ON "locations" USING btree ("_order");
  CREATE UNIQUE INDEX "locations_slug_idx" ON "locations" USING btree ("slug");
  CREATE INDEX "locations_image_idx" ON "locations" USING btree ("image_id");
  CREATE INDEX "locations_updated_at_idx" ON "locations" USING btree ("updated_at");
  CREATE INDEX "locations_created_at_idx" ON "locations" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "media_source_idx" ON "media" USING btree ("source");
  CREATE INDEX "payload_locked_documents_rels_locations_id_idx" ON "payload_locked_documents_rels" USING btree ("locations_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "locations_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "locations_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "locations_prices" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "locations_included_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "locations_included" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "locations_travel_modes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "locations" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "locations_features" CASCADE;
  DROP TABLE "locations_gallery" CASCADE;
  DROP TABLE "locations_prices" CASCADE;
  DROP TABLE "locations_included_items" CASCADE;
  DROP TABLE "locations_included" CASCADE;
  DROP TABLE "locations_travel_modes" CASCADE;
  DROP TABLE "locations" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_locations_fk";
  
  DROP INDEX "media_source_idx";
  DROP INDEX "payload_locked_documents_rels_locations_id_idx";
  ALTER TABLE "media" DROP COLUMN "source";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "locations_id";
  DROP TYPE "public"."enum_locations_features_icon";
  DROP TYPE "public"."enum_locations_included_items_icon";
  DROP TYPE "public"."enum_locations_travel_modes_icon";
  DROP TYPE "public"."enum_locations_type";`)
}
