import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_location_pages_working_standard_icon" AS ENUM('Api', 'Automate', 'BarKitchen', 'Basin', 'Bed', 'Bike', 'Bill', 'Bus', 'Calendar', 'CalendarCheck', 'Car', 'Cctv', 'Check', 'Chef', 'Cocktail', 'Community', 'Crowd', 'Database', 'DealFlow', 'Desk', 'Dining', 'DoorEntry', 'Dumbbell', 'FeasibilityModel', 'FruitBowl', 'Groceries', 'Guard', 'Hack', 'HandsHeart', 'Handshake', 'Help', 'Hob', 'Icon360', 'Info', 'IntegrateData', 'Integrations', 'Lion', 'LocationPin', 'Lock', 'Lounge', 'Mail', 'ManageMembership', 'MeetingTable', 'MemberSupport', 'Membership', 'Microwave', 'Outdoor', 'Oven', 'Padlock', 'People', 'Plane', 'Play', 'PrivateOffice', 'QuoteMark', 'Relationships', 'Reporting', 'Restaurant', 'RestaurantsNearby', 'RoomAllocation', 'RoomPricing', 'Roundel', 'Router', 'Scales', 'Shelves', 'SmartHome', 'SocialNetwork', 'Sofa', 'SprayBottle', 'Sprout', 'Star', 'SunCloud', 'TapeMeasure', 'TeamChat', 'TrackMarket', 'Train', 'WashingMachine', 'Workshop', 'Wrench');
  CREATE TABLE "location_pages_working_standard" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"icon" "enum_location_pages_working_standard_icon" NOT NULL
  );
  
  -- The standard list's items, from its group(s), in order, before the old tables go
  INSERT INTO "location_pages_working_standard" ("_order", "_parent_id", "id", "label", "icon")
    SELECT row_number() OVER (ORDER BY g."_order", i."_order"), g."_parent_id", i."id", i."label", i."icon"::text::"enum_location_pages_working_standard_icon"
    FROM "location_pages_working_included_items" i JOIN "location_pages_working_included" g ON g."id" = i."_parent_id";
  DROP TABLE "location_pages_working_included_items" CASCADE;
  DROP TABLE "location_pages_working_included" CASCADE;
  ALTER TABLE "location_pages_working_standard" ADD CONSTRAINT "location_pages_working_standard_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."location_pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "location_pages_working_standard_order_idx" ON "location_pages_working_standard" USING btree ("_order");
  CREATE INDEX "location_pages_working_standard_parent_id_idx" ON "location_pages_working_standard" USING btree ("_parent_id");
  DROP TYPE "public"."enum_location_pages_working_included_items_icon";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_location_pages_working_included_items_icon" AS ENUM('Api', 'Automate', 'BarKitchen', 'Basin', 'Bed', 'Bike', 'Bill', 'Bus', 'Calendar', 'CalendarCheck', 'Car', 'Cctv', 'Check', 'Chef', 'Cocktail', 'Community', 'Crowd', 'Database', 'DealFlow', 'Desk', 'Dining', 'DoorEntry', 'Dumbbell', 'FeasibilityModel', 'FruitBowl', 'Groceries', 'Guard', 'Hack', 'HandsHeart', 'Handshake', 'Help', 'Hob', 'Icon360', 'Info', 'IntegrateData', 'Integrations', 'Lion', 'LocationPin', 'Lock', 'Lounge', 'Mail', 'ManageMembership', 'MeetingTable', 'MemberSupport', 'Membership', 'Microwave', 'Outdoor', 'Oven', 'Padlock', 'People', 'Plane', 'Play', 'PrivateOffice', 'QuoteMark', 'Relationships', 'Reporting', 'Restaurant', 'RestaurantsNearby', 'RoomAllocation', 'RoomPricing', 'Roundel', 'Router', 'Scales', 'Shelves', 'SmartHome', 'SocialNetwork', 'Sofa', 'SprayBottle', 'Sprout', 'Star', 'SunCloud', 'TapeMeasure', 'TeamChat', 'TrackMarket', 'Train', 'WashingMachine', 'Workshop', 'Wrench');
  CREATE TABLE "location_pages_working_included_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"icon" "enum_location_pages_working_included_items_icon" NOT NULL
  );
  
  CREATE TABLE "location_pages_working_included" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  DROP TABLE "location_pages_working_standard" CASCADE;
  ALTER TABLE "location_pages_working_included_items" ADD CONSTRAINT "location_pages_working_included_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."location_pages_working_included"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "location_pages_working_included" ADD CONSTRAINT "location_pages_working_included_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."location_pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "location_pages_working_included_items_order_idx" ON "location_pages_working_included_items" USING btree ("_order");
  CREATE INDEX "location_pages_working_included_items_parent_id_idx" ON "location_pages_working_included_items" USING btree ("_parent_id");
  CREATE INDEX "location_pages_working_included_order_idx" ON "location_pages_working_included" USING btree ("_order");
  CREATE INDEX "location_pages_working_included_parent_id_idx" ON "location_pages_working_included" USING btree ("_parent_id");
  DROP TYPE "public"."enum_location_pages_working_standard_icon";`)
}
