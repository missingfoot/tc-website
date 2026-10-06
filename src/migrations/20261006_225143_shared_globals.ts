import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_social_links_accounts_platform" AS ENUM('youtube', 'twitter', 'facebook', 'instagram', 'email');
  CREATE TYPE "public"."enum_location_pages_working_included_items_icon" AS ENUM('Api', 'Automate', 'BarKitchen', 'Basin', 'Bed', 'Bike', 'Bill', 'Bus', 'Calendar', 'CalendarCheck', 'Car', 'Cctv', 'Check', 'Chef', 'Cocktail', 'Community', 'Crowd', 'Database', 'DealFlow', 'Desk', 'Dining', 'DoorEntry', 'Dumbbell', 'FeasibilityModel', 'FruitBowl', 'Groceries', 'Guard', 'Hack', 'HandsHeart', 'Handshake', 'Help', 'Hob', 'Icon360', 'Info', 'IntegrateData', 'Integrations', 'Lion', 'LocationPin', 'Lock', 'Lounge', 'Mail', 'ManageMembership', 'MeetingTable', 'MemberSupport', 'Membership', 'Microwave', 'Outdoor', 'Oven', 'Padlock', 'People', 'Plane', 'Play', 'PrivateOffice', 'QuoteMark', 'Relationships', 'Reporting', 'Restaurant', 'RestaurantsNearby', 'RoomAllocation', 'RoomPricing', 'Roundel', 'Router', 'Scales', 'Shelves', 'SmartHome', 'SocialNetwork', 'Sofa', 'SprayBottle', 'Sprout', 'Star', 'SunCloud', 'TapeMeasure', 'TeamChat', 'TrackMarket', 'Train', 'WashingMachine', 'Workshop', 'Wrench');
  CREATE TYPE "public"."enum_location_pages_working_promos_position" AS ENUM('top', 'bottom', 'left', 'right');
  CREATE TYPE "public"."enum_location_pages_working_promos_enquiry" AS ENUM('living', 'working', 'serviced', 'events', 'waitlist');
  CREATE TYPE "public"."enum_location_pages_serviced_promos_position" AS ENUM('top', 'bottom', 'left', 'right');
  CREATE TYPE "public"."enum_location_pages_serviced_promos_enquiry" AS ENUM('living', 'working', 'serviced', 'events', 'waitlist');
  CREATE TYPE "public"."enum_location_pages_venues_promos_position" AS ENUM('top', 'bottom', 'left', 'right');
  CREATE TYPE "public"."enum_location_pages_venues_promos_enquiry" AS ENUM('living', 'working', 'serviced', 'events', 'waitlist');
  CREATE TYPE "public"."enum_location_pages_rooms_included_icon" AS ENUM('Api', 'Automate', 'BarKitchen', 'Basin', 'Bed', 'Bike', 'Bill', 'Bus', 'Calendar', 'CalendarCheck', 'Car', 'Cctv', 'Check', 'Chef', 'Cocktail', 'Community', 'Crowd', 'Database', 'DealFlow', 'Desk', 'Dining', 'DoorEntry', 'Dumbbell', 'FeasibilityModel', 'FruitBowl', 'Groceries', 'Guard', 'Hack', 'HandsHeart', 'Handshake', 'Help', 'Hob', 'Icon360', 'Info', 'IntegrateData', 'Integrations', 'Lion', 'LocationPin', 'Lock', 'Lounge', 'Mail', 'ManageMembership', 'MeetingTable', 'MemberSupport', 'Membership', 'Microwave', 'Outdoor', 'Oven', 'Padlock', 'People', 'Plane', 'Play', 'PrivateOffice', 'QuoteMark', 'Relationships', 'Reporting', 'Restaurant', 'RestaurantsNearby', 'RoomAllocation', 'RoomPricing', 'Roundel', 'Router', 'Scales', 'Shelves', 'SmartHome', 'SocialNetwork', 'Sofa', 'SprayBottle', 'Sprout', 'Star', 'SunCloud', 'TapeMeasure', 'TeamChat', 'TrackMarket', 'Train', 'WashingMachine', 'Workshop', 'Wrench');
  CREATE TYPE "public"."enum_location_pages_rooms_promos_position" AS ENUM('top', 'bottom', 'left', 'right');
  CREATE TYPE "public"."enum_location_pages_rooms_promos_enquiry" AS ENUM('living', 'working', 'serviced', 'events', 'waitlist');
  CREATE TABLE "social_links_accounts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_social_links_accounts_platform" NOT NULL,
  	"href" varchar,
  	"label" varchar NOT NULL,
  	"show" boolean DEFAULT true
  );
  
  CREATE TABLE "social_links" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"newsletter_label" varchar,
  	"newsletter_href" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
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
  
  CREATE TABLE "location_pages_working_promos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"position" "enum_location_pages_working_promos_position",
  	"cta_label" varchar NOT NULL,
  	"cta_href" varchar NOT NULL,
  	"enquiry" "enum_location_pages_working_promos_enquiry"
  );
  
  CREATE TABLE "location_pages_serviced_promos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"position" "enum_location_pages_serviced_promos_position",
  	"cta_label" varchar NOT NULL,
  	"cta_href" varchar NOT NULL,
  	"enquiry" "enum_location_pages_serviced_promos_enquiry"
  );
  
  CREATE TABLE "location_pages_venues_promos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"position" "enum_location_pages_venues_promos_position",
  	"cta_label" varchar NOT NULL,
  	"cta_href" varchar NOT NULL,
  	"enquiry" "enum_location_pages_venues_promos_enquiry"
  );
  
  CREATE TABLE "location_pages_rooms_included" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"icon" "enum_location_pages_rooms_included_icon" NOT NULL
  );
  
  CREATE TABLE "location_pages_rooms_promos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"position" "enum_location_pages_rooms_promos_position",
  	"cta_label" varchar NOT NULL,
  	"cta_href" varchar NOT NULL,
  	"enquiry" "enum_location_pages_rooms_promos_enquiry"
  );
  
  CREATE TABLE "location_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"working_included_intro" varchar NOT NULL,
  	"working_pricing_intro" varchar NOT NULL,
  	"working_tour_label" varchar DEFAULT 'View 3D Tour',
  	"working_tour_href" varchar,
  	"serviced_included_intro" varchar NOT NULL,
  	"serviced_pricing_intro" varchar NOT NULL,
  	"venues_included_heading" varchar NOT NULL,
  	"venues_included_intro" varchar NOT NULL,
  	"rooms_about_heading" varchar NOT NULL,
  	"rooms_about_text" varchar NOT NULL,
  	"rooms_about_poster_id" integer NOT NULL,
  	"rooms_about_video" varchar NOT NULL,
  	"rooms_co_living_about" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "social_links_accounts" ADD CONSTRAINT "social_links_accounts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."social_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "location_pages_working_included_items" ADD CONSTRAINT "location_pages_working_included_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."location_pages_working_included"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "location_pages_working_included" ADD CONSTRAINT "location_pages_working_included_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."location_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "location_pages_working_promos" ADD CONSTRAINT "location_pages_working_promos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "location_pages_working_promos" ADD CONSTRAINT "location_pages_working_promos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."location_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "location_pages_serviced_promos" ADD CONSTRAINT "location_pages_serviced_promos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "location_pages_serviced_promos" ADD CONSTRAINT "location_pages_serviced_promos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."location_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "location_pages_venues_promos" ADD CONSTRAINT "location_pages_venues_promos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "location_pages_venues_promos" ADD CONSTRAINT "location_pages_venues_promos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."location_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "location_pages_rooms_included" ADD CONSTRAINT "location_pages_rooms_included_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."location_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "location_pages_rooms_promos" ADD CONSTRAINT "location_pages_rooms_promos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "location_pages_rooms_promos" ADD CONSTRAINT "location_pages_rooms_promos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."location_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "location_pages" ADD CONSTRAINT "location_pages_rooms_about_poster_id_media_id_fk" FOREIGN KEY ("rooms_about_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "social_links_accounts_order_idx" ON "social_links_accounts" USING btree ("_order");
  CREATE INDEX "social_links_accounts_parent_id_idx" ON "social_links_accounts" USING btree ("_parent_id");
  CREATE INDEX "location_pages_working_included_items_order_idx" ON "location_pages_working_included_items" USING btree ("_order");
  CREATE INDEX "location_pages_working_included_items_parent_id_idx" ON "location_pages_working_included_items" USING btree ("_parent_id");
  CREATE INDEX "location_pages_working_included_order_idx" ON "location_pages_working_included" USING btree ("_order");
  CREATE INDEX "location_pages_working_included_parent_id_idx" ON "location_pages_working_included" USING btree ("_parent_id");
  CREATE INDEX "location_pages_working_promos_order_idx" ON "location_pages_working_promos" USING btree ("_order");
  CREATE INDEX "location_pages_working_promos_parent_id_idx" ON "location_pages_working_promos" USING btree ("_parent_id");
  CREATE INDEX "location_pages_working_promos_image_idx" ON "location_pages_working_promos" USING btree ("image_id");
  CREATE INDEX "location_pages_serviced_promos_order_idx" ON "location_pages_serviced_promos" USING btree ("_order");
  CREATE INDEX "location_pages_serviced_promos_parent_id_idx" ON "location_pages_serviced_promos" USING btree ("_parent_id");
  CREATE INDEX "location_pages_serviced_promos_image_idx" ON "location_pages_serviced_promos" USING btree ("image_id");
  CREATE INDEX "location_pages_venues_promos_order_idx" ON "location_pages_venues_promos" USING btree ("_order");
  CREATE INDEX "location_pages_venues_promos_parent_id_idx" ON "location_pages_venues_promos" USING btree ("_parent_id");
  CREATE INDEX "location_pages_venues_promos_image_idx" ON "location_pages_venues_promos" USING btree ("image_id");
  CREATE INDEX "location_pages_rooms_included_order_idx" ON "location_pages_rooms_included" USING btree ("_order");
  CREATE INDEX "location_pages_rooms_included_parent_id_idx" ON "location_pages_rooms_included" USING btree ("_parent_id");
  CREATE INDEX "location_pages_rooms_promos_order_idx" ON "location_pages_rooms_promos" USING btree ("_order");
  CREATE INDEX "location_pages_rooms_promos_parent_id_idx" ON "location_pages_rooms_promos" USING btree ("_parent_id");
  CREATE INDEX "location_pages_rooms_promos_image_idx" ON "location_pages_rooms_promos" USING btree ("image_id");
  CREATE INDEX "location_pages_rooms_about_rooms_about_poster_idx" ON "location_pages" USING btree ("rooms_about_poster_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "social_links_accounts" CASCADE;
  DROP TABLE "social_links" CASCADE;
  DROP TABLE "location_pages_working_included_items" CASCADE;
  DROP TABLE "location_pages_working_included" CASCADE;
  DROP TABLE "location_pages_working_promos" CASCADE;
  DROP TABLE "location_pages_serviced_promos" CASCADE;
  DROP TABLE "location_pages_venues_promos" CASCADE;
  DROP TABLE "location_pages_rooms_included" CASCADE;
  DROP TABLE "location_pages_rooms_promos" CASCADE;
  DROP TABLE "location_pages" CASCADE;
  DROP TYPE "public"."enum_social_links_accounts_platform";
  DROP TYPE "public"."enum_location_pages_working_included_items_icon";
  DROP TYPE "public"."enum_location_pages_working_promos_position";
  DROP TYPE "public"."enum_location_pages_working_promos_enquiry";
  DROP TYPE "public"."enum_location_pages_serviced_promos_position";
  DROP TYPE "public"."enum_location_pages_serviced_promos_enquiry";
  DROP TYPE "public"."enum_location_pages_venues_promos_position";
  DROP TYPE "public"."enum_location_pages_venues_promos_enquiry";
  DROP TYPE "public"."enum_location_pages_rooms_included_icon";
  DROP TYPE "public"."enum_location_pages_rooms_promos_position";
  DROP TYPE "public"."enum_location_pages_rooms_promos_enquiry";`)
}
