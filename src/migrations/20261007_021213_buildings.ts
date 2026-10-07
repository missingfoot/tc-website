import { buildingFromPage } from '../payload/buildingFromPage'
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_buildings_travel_modes_icon" AS ENUM('underground', 'overground', 'bus', 'car');
  CREATE TYPE "public"."enum_buildings_coliving_included_items_icon" AS ENUM('Api', 'Automate', 'BarKitchen', 'Basin', 'Bed', 'Bike', 'Bill', 'Bus', 'Calendar', 'CalendarCheck', 'Car', 'Cctv', 'Check', 'Chef', 'Cocktail', 'Community', 'Crowd', 'Database', 'DealFlow', 'Desk', 'Dining', 'DoorEntry', 'Dumbbell', 'FeasibilityModel', 'FruitBowl', 'Groceries', 'Guard', 'Hack', 'HandsHeart', 'Handshake', 'Help', 'Hob', 'Icon360', 'Info', 'IntegrateData', 'Integrations', 'Lion', 'LocationPin', 'Lock', 'Lounge', 'Mail', 'ManageMembership', 'MeetingTable', 'MemberSupport', 'Membership', 'Microwave', 'Outdoor', 'Oven', 'Padlock', 'People', 'Plane', 'Play', 'PrivateOffice', 'QuoteMark', 'Relationships', 'Reporting', 'Restaurant', 'RestaurantsNearby', 'RoomAllocation', 'RoomPricing', 'Roundel', 'Router', 'Scales', 'Shelves', 'SmartHome', 'SocialNetwork', 'Sofa', 'SprayBottle', 'Sprout', 'Star', 'SunCloud', 'TapeMeasure', 'TeamChat', 'TrackMarket', 'Train', 'WashingMachine', 'Workshop', 'Wrench');
  CREATE TYPE "public"."enum_buildings_coliving_rooms_included_icon" AS ENUM('Api', 'Automate', 'BarKitchen', 'Basin', 'Bed', 'Bike', 'Bill', 'Bus', 'Calendar', 'CalendarCheck', 'Car', 'Cctv', 'Check', 'Chef', 'Cocktail', 'Community', 'Crowd', 'Database', 'DealFlow', 'Desk', 'Dining', 'DoorEntry', 'Dumbbell', 'FeasibilityModel', 'FruitBowl', 'Groceries', 'Guard', 'Hack', 'HandsHeart', 'Handshake', 'Help', 'Hob', 'Icon360', 'Info', 'IntegrateData', 'Integrations', 'Lion', 'LocationPin', 'Lock', 'Lounge', 'Mail', 'ManageMembership', 'MeetingTable', 'MemberSupport', 'Membership', 'Microwave', 'Outdoor', 'Oven', 'Padlock', 'People', 'Plane', 'Play', 'PrivateOffice', 'QuoteMark', 'Relationships', 'Reporting', 'Restaurant', 'RestaurantsNearby', 'RoomAllocation', 'RoomPricing', 'Roundel', 'Router', 'Scales', 'Shelves', 'SmartHome', 'SocialNetwork', 'Sofa', 'SprayBottle', 'Sprout', 'Star', 'SunCloud', 'TapeMeasure', 'TeamChat', 'TrackMarket', 'Train', 'WashingMachine', 'Workshop', 'Wrench');
  CREATE TYPE "public"."enum_buildings_working_features_icon" AS ENUM('Api', 'Automate', 'BarKitchen', 'Basin', 'Bed', 'Bike', 'Bill', 'Bus', 'Calendar', 'CalendarCheck', 'Car', 'Cctv', 'Check', 'Chef', 'Cocktail', 'Community', 'Crowd', 'Database', 'DealFlow', 'Desk', 'Dining', 'DoorEntry', 'Dumbbell', 'FeasibilityModel', 'FruitBowl', 'Groceries', 'Guard', 'Hack', 'HandsHeart', 'Handshake', 'Help', 'Hob', 'Icon360', 'Info', 'IntegrateData', 'Integrations', 'Lion', 'LocationPin', 'Lock', 'Lounge', 'Mail', 'ManageMembership', 'MeetingTable', 'MemberSupport', 'Membership', 'Microwave', 'Outdoor', 'Oven', 'Padlock', 'People', 'Plane', 'Play', 'PrivateOffice', 'QuoteMark', 'Relationships', 'Reporting', 'Restaurant', 'RestaurantsNearby', 'RoomAllocation', 'RoomPricing', 'Roundel', 'Router', 'Scales', 'Shelves', 'SmartHome', 'SocialNetwork', 'Sofa', 'SprayBottle', 'Sprout', 'Star', 'SunCloud', 'TapeMeasure', 'TeamChat', 'TrackMarket', 'Train', 'WashingMachine', 'Workshop', 'Wrench');
  CREATE TYPE "public"."enum_buildings_working_included_items_icon" AS ENUM('Api', 'Automate', 'BarKitchen', 'Basin', 'Bed', 'Bike', 'Bill', 'Bus', 'Calendar', 'CalendarCheck', 'Car', 'Cctv', 'Check', 'Chef', 'Cocktail', 'Community', 'Crowd', 'Database', 'DealFlow', 'Desk', 'Dining', 'DoorEntry', 'Dumbbell', 'FeasibilityModel', 'FruitBowl', 'Groceries', 'Guard', 'Hack', 'HandsHeart', 'Handshake', 'Help', 'Hob', 'Icon360', 'Info', 'IntegrateData', 'Integrations', 'Lion', 'LocationPin', 'Lock', 'Lounge', 'Mail', 'ManageMembership', 'MeetingTable', 'MemberSupport', 'Membership', 'Microwave', 'Outdoor', 'Oven', 'Padlock', 'People', 'Plane', 'Play', 'PrivateOffice', 'QuoteMark', 'Relationships', 'Reporting', 'Restaurant', 'RestaurantsNearby', 'RoomAllocation', 'RoomPricing', 'Roundel', 'Router', 'Scales', 'Shelves', 'SmartHome', 'SocialNetwork', 'Sofa', 'SprayBottle', 'Sprout', 'Star', 'SunCloud', 'TapeMeasure', 'TeamChat', 'TrackMarket', 'Train', 'WashingMachine', 'Workshop', 'Wrench');
  CREATE TYPE "public"."enum_buildings_serviced_features_icon" AS ENUM('Api', 'Automate', 'BarKitchen', 'Basin', 'Bed', 'Bike', 'Bill', 'Bus', 'Calendar', 'CalendarCheck', 'Car', 'Cctv', 'Check', 'Chef', 'Cocktail', 'Community', 'Crowd', 'Database', 'DealFlow', 'Desk', 'Dining', 'DoorEntry', 'Dumbbell', 'FeasibilityModel', 'FruitBowl', 'Groceries', 'Guard', 'Hack', 'HandsHeart', 'Handshake', 'Help', 'Hob', 'Icon360', 'Info', 'IntegrateData', 'Integrations', 'Lion', 'LocationPin', 'Lock', 'Lounge', 'Mail', 'ManageMembership', 'MeetingTable', 'MemberSupport', 'Membership', 'Microwave', 'Outdoor', 'Oven', 'Padlock', 'People', 'Plane', 'Play', 'PrivateOffice', 'QuoteMark', 'Relationships', 'Reporting', 'Restaurant', 'RestaurantsNearby', 'RoomAllocation', 'RoomPricing', 'Roundel', 'Router', 'Scales', 'Shelves', 'SmartHome', 'SocialNetwork', 'Sofa', 'SprayBottle', 'Sprout', 'Star', 'SunCloud', 'TapeMeasure', 'TeamChat', 'TrackMarket', 'Train', 'WashingMachine', 'Workshop', 'Wrench');
  CREATE TYPE "public"."enum_buildings_serviced_included_items_icon" AS ENUM('Api', 'Automate', 'BarKitchen', 'Basin', 'Bed', 'Bike', 'Bill', 'Bus', 'Calendar', 'CalendarCheck', 'Car', 'Cctv', 'Check', 'Chef', 'Cocktail', 'Community', 'Crowd', 'Database', 'DealFlow', 'Desk', 'Dining', 'DoorEntry', 'Dumbbell', 'FeasibilityModel', 'FruitBowl', 'Groceries', 'Guard', 'Hack', 'HandsHeart', 'Handshake', 'Help', 'Hob', 'Icon360', 'Info', 'IntegrateData', 'Integrations', 'Lion', 'LocationPin', 'Lock', 'Lounge', 'Mail', 'ManageMembership', 'MeetingTable', 'MemberSupport', 'Membership', 'Microwave', 'Outdoor', 'Oven', 'Padlock', 'People', 'Plane', 'Play', 'PrivateOffice', 'QuoteMark', 'Relationships', 'Reporting', 'Restaurant', 'RestaurantsNearby', 'RoomAllocation', 'RoomPricing', 'Roundel', 'Router', 'Scales', 'Shelves', 'SmartHome', 'SocialNetwork', 'Sofa', 'SprayBottle', 'Sprout', 'Star', 'SunCloud', 'TapeMeasure', 'TeamChat', 'TrackMarket', 'Train', 'WashingMachine', 'Workshop', 'Wrench');
  CREATE TYPE "public"."enum_venues_features_icon" AS ENUM('Api', 'Automate', 'BarKitchen', 'Basin', 'Bed', 'Bike', 'Bill', 'Bus', 'Calendar', 'CalendarCheck', 'Car', 'Cctv', 'Check', 'Chef', 'Cocktail', 'Community', 'Crowd', 'Database', 'DealFlow', 'Desk', 'Dining', 'DoorEntry', 'Dumbbell', 'FeasibilityModel', 'FruitBowl', 'Groceries', 'Guard', 'Hack', 'HandsHeart', 'Handshake', 'Help', 'Hob', 'Icon360', 'Info', 'IntegrateData', 'Integrations', 'Lion', 'LocationPin', 'Lock', 'Lounge', 'Mail', 'ManageMembership', 'MeetingTable', 'MemberSupport', 'Membership', 'Microwave', 'Outdoor', 'Oven', 'Padlock', 'People', 'Plane', 'Play', 'PrivateOffice', 'QuoteMark', 'Relationships', 'Reporting', 'Restaurant', 'RestaurantsNearby', 'RoomAllocation', 'RoomPricing', 'Roundel', 'Router', 'Scales', 'Shelves', 'SmartHome', 'SocialNetwork', 'Sofa', 'SprayBottle', 'Sprout', 'Star', 'SunCloud', 'TapeMeasure', 'TeamChat', 'TrackMarket', 'Train', 'WashingMachine', 'Workshop', 'Wrench');
  CREATE TYPE "public"."enum_venues_included_items_icon" AS ENUM('Api', 'Automate', 'BarKitchen', 'Basin', 'Bed', 'Bike', 'Bill', 'Bus', 'Calendar', 'CalendarCheck', 'Car', 'Cctv', 'Check', 'Chef', 'Cocktail', 'Community', 'Crowd', 'Database', 'DealFlow', 'Desk', 'Dining', 'DoorEntry', 'Dumbbell', 'FeasibilityModel', 'FruitBowl', 'Groceries', 'Guard', 'Hack', 'HandsHeart', 'Handshake', 'Help', 'Hob', 'Icon360', 'Info', 'IntegrateData', 'Integrations', 'Lion', 'LocationPin', 'Lock', 'Lounge', 'Mail', 'ManageMembership', 'MeetingTable', 'MemberSupport', 'Membership', 'Microwave', 'Outdoor', 'Oven', 'Padlock', 'People', 'Plane', 'Play', 'PrivateOffice', 'QuoteMark', 'Relationships', 'Reporting', 'Restaurant', 'RestaurantsNearby', 'RoomAllocation', 'RoomPricing', 'Roundel', 'Router', 'Scales', 'Shelves', 'SmartHome', 'SocialNetwork', 'Sofa', 'SprayBottle', 'Sprout', 'Star', 'SunCloud', 'TapeMeasure', 'TeamChat', 'TrackMarket', 'Train', 'WashingMachine', 'Workshop', 'Wrench');
  CREATE TYPE "public"."enum_pages_blocks_location_cards_kind" AS ENUM('working', 'serviced', 'venue');
  CREATE TYPE "public"."enum_templates_blocks_location_cards_kind" AS ENUM('working', 'serviced', 'venue');
  CREATE TABLE "buildings_travel_modes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"icon" "enum_buildings_travel_modes_icon" NOT NULL,
  	"steps" varchar NOT NULL,
  	"maps_url" varchar NOT NULL
  );
  
  CREATE TABLE "buildings_coliving_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar
  );
  
  CREATE TABLE "buildings_coliving_included_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"icon" "enum_buildings_coliving_included_items_icon"
  );
  
  CREATE TABLE "buildings_coliving_included" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "buildings_coliving_rooms_included" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"icon" "enum_buildings_coliving_rooms_included_icon"
  );
  
  CREATE TABLE "buildings_coliving_room_lengths" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"months" numeric
  );
  
  CREATE TABLE "buildings_working_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"icon" "enum_buildings_working_features_icon"
  );
  
  CREATE TABLE "buildings_working_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar
  );
  
  CREATE TABLE "buildings_working_prices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"plan" varchar,
  	"amount" numeric
  );
  
  CREATE TABLE "buildings_working_included_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"icon" "enum_buildings_working_included_items_icon"
  );
  
  CREATE TABLE "buildings_working_included" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "buildings_serviced_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"icon" "enum_buildings_serviced_features_icon"
  );
  
  CREATE TABLE "buildings_serviced_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar
  );
  
  CREATE TABLE "buildings_serviced_prices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"plan" varchar,
  	"amount" numeric
  );
  
  CREATE TABLE "buildings_serviced_included_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"icon" "enum_buildings_serviced_included_items_icon"
  );
  
  CREATE TABLE "buildings_serviced_included" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "buildings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"address" varchar,
  	"coliving_enabled" boolean,
  	"coliving_coming_soon" boolean,
  	"coliving_slug" varchar,
  	"coliving_area" varchar,
  	"coliving_postcode" varchar,
  	"coliving_image_id" integer,
  	"coliving_intro" varchar,
  	"coliving_about_heading" varchar,
  	"coliving_about_text" varchar,
  	"coliving_about_poster_id" integer,
  	"coliving_about_video" varchar,
  	"coliving_directions_intro" varchar,
  	"working_enabled" boolean,
  	"working_slug" varchar,
  	"working_area" varchar,
  	"working_postcode" varchar,
  	"working_pill" varchar,
  	"working_image_id" integer,
  	"working_intro" varchar,
  	"working_directions_intro" varchar,
  	"serviced_enabled" boolean,
  	"serviced_slug" varchar,
  	"serviced_area" varchar,
  	"serviced_postcode" varchar,
  	"serviced_pill" varchar,
  	"serviced_image_id" integer,
  	"serviced_intro" varchar,
  	"serviced_directions_intro" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "venues_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"icon" "enum_venues_features_icon" NOT NULL
  );
  
  CREATE TABLE "venues_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "venues_included_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"icon" "enum_venues_included_items_icon" NOT NULL
  );
  
  CREATE TABLE "venues_included" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "venues" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"name" varchar NOT NULL,
  	"building_id" integer NOT NULL,
  	"slug" varchar NOT NULL,
  	"area" varchar NOT NULL,
  	"postcode" varchar NOT NULL,
  	"pill" varchar,
  	"image_id" integer NOT NULL,
  	"intro" varchar NOT NULL,
  	"directions_intro" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "templates_blocks_location_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"subtitle" varchar,
  	"enquiry_button" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "templates_blocks_location_text_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"enquiry_button" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "templates_blocks_location_rooms" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Explore the rooms' NOT NULL,
  	"intro" varchar,
  	"cta_label" varchar DEFAULT 'View Room',
  	"block_name" varchar
  );
  
  
  
  
  
  ALTER TABLE "templates" ALTER COLUMN "type" SET DATA TYPE text;
  DROP TYPE "public"."enum_templates_type";
  CREATE TYPE "public"."enum_templates_type" AS ENUM('coliving', 'room', 'working', 'serviced', 'venue');
  ALTER TABLE "templates" ALTER COLUMN "type" SET DATA TYPE "public"."enum_templates_type" USING "type"::"public"."enum_templates_type";
  DROP INDEX "rooms_slug_idx";
  ALTER TABLE "pages_blocks_location_cards" ADD COLUMN "kind" "enum_pages_blocks_location_cards_kind" DEFAULT 'working' NOT NULL;
  ALTER TABLE "pages_rels" ADD COLUMN "buildings_id" integer;
  ALTER TABLE "pages_rels" ADD COLUMN "venues_id" integer;
  ALTER TABLE "templates_blocks_location_gallery" ADD COLUMN "intro" varchar;
  ALTER TABLE "templates_blocks_location_cards" ADD COLUMN "kind" "enum_templates_blocks_location_cards_kind" DEFAULT 'working' NOT NULL;
  ALTER TABLE "templates_rels" ADD COLUMN "buildings_id" integer;
  ALTER TABLE "templates_rels" ADD COLUMN "venues_id" integer;
  ALTER TABLE "rooms" ADD COLUMN "building_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "buildings_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "venues_id" integer;
  ALTER TABLE "buildings_travel_modes" ADD CONSTRAINT "buildings_travel_modes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."buildings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "buildings_coliving_gallery" ADD CONSTRAINT "buildings_coliving_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "buildings_coliving_gallery" ADD CONSTRAINT "buildings_coliving_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."buildings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "buildings_coliving_included_items" ADD CONSTRAINT "buildings_coliving_included_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."buildings_coliving_included"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "buildings_coliving_included" ADD CONSTRAINT "buildings_coliving_included_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."buildings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "buildings_coliving_rooms_included" ADD CONSTRAINT "buildings_coliving_rooms_included_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."buildings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "buildings_coliving_room_lengths" ADD CONSTRAINT "buildings_coliving_room_lengths_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."buildings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "buildings_working_features" ADD CONSTRAINT "buildings_working_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."buildings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "buildings_working_gallery" ADD CONSTRAINT "buildings_working_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "buildings_working_gallery" ADD CONSTRAINT "buildings_working_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."buildings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "buildings_working_prices" ADD CONSTRAINT "buildings_working_prices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."buildings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "buildings_working_included_items" ADD CONSTRAINT "buildings_working_included_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."buildings_working_included"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "buildings_working_included" ADD CONSTRAINT "buildings_working_included_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."buildings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "buildings_serviced_features" ADD CONSTRAINT "buildings_serviced_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."buildings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "buildings_serviced_gallery" ADD CONSTRAINT "buildings_serviced_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "buildings_serviced_gallery" ADD CONSTRAINT "buildings_serviced_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."buildings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "buildings_serviced_prices" ADD CONSTRAINT "buildings_serviced_prices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."buildings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "buildings_serviced_included_items" ADD CONSTRAINT "buildings_serviced_included_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."buildings_serviced_included"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "buildings_serviced_included" ADD CONSTRAINT "buildings_serviced_included_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."buildings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "buildings" ADD CONSTRAINT "buildings_coliving_image_id_media_id_fk" FOREIGN KEY ("coliving_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "buildings" ADD CONSTRAINT "buildings_coliving_about_poster_id_media_id_fk" FOREIGN KEY ("coliving_about_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "buildings" ADD CONSTRAINT "buildings_working_image_id_media_id_fk" FOREIGN KEY ("working_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "buildings" ADD CONSTRAINT "buildings_serviced_image_id_media_id_fk" FOREIGN KEY ("serviced_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "venues_features" ADD CONSTRAINT "venues_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."venues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "venues_gallery" ADD CONSTRAINT "venues_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "venues_gallery" ADD CONSTRAINT "venues_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."venues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "venues_included_items" ADD CONSTRAINT "venues_included_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."venues_included"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "venues_included" ADD CONSTRAINT "venues_included_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."venues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "venues" ADD CONSTRAINT "venues_building_id_buildings_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."buildings"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "venues" ADD CONSTRAINT "venues_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "templates_blocks_location_hero" ADD CONSTRAINT "templates_blocks_location_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_location_text_intro" ADD CONSTRAINT "templates_blocks_location_text_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_location_rooms" ADD CONSTRAINT "templates_blocks_location_rooms_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "buildings_travel_modes_order_idx" ON "buildings_travel_modes" USING btree ("_order");
  CREATE INDEX "buildings_travel_modes_parent_id_idx" ON "buildings_travel_modes" USING btree ("_parent_id");
  CREATE INDEX "buildings_coliving_gallery_order_idx" ON "buildings_coliving_gallery" USING btree ("_order");
  CREATE INDEX "buildings_coliving_gallery_parent_id_idx" ON "buildings_coliving_gallery" USING btree ("_parent_id");
  CREATE INDEX "buildings_coliving_gallery_image_idx" ON "buildings_coliving_gallery" USING btree ("image_id");
  CREATE INDEX "buildings_coliving_included_items_order_idx" ON "buildings_coliving_included_items" USING btree ("_order");
  CREATE INDEX "buildings_coliving_included_items_parent_id_idx" ON "buildings_coliving_included_items" USING btree ("_parent_id");
  CREATE INDEX "buildings_coliving_included_order_idx" ON "buildings_coliving_included" USING btree ("_order");
  CREATE INDEX "buildings_coliving_included_parent_id_idx" ON "buildings_coliving_included" USING btree ("_parent_id");
  CREATE INDEX "buildings_coliving_rooms_included_order_idx" ON "buildings_coliving_rooms_included" USING btree ("_order");
  CREATE INDEX "buildings_coliving_rooms_included_parent_id_idx" ON "buildings_coliving_rooms_included" USING btree ("_parent_id");
  CREATE INDEX "buildings_coliving_room_lengths_order_idx" ON "buildings_coliving_room_lengths" USING btree ("_order");
  CREATE INDEX "buildings_coliving_room_lengths_parent_id_idx" ON "buildings_coliving_room_lengths" USING btree ("_parent_id");
  CREATE INDEX "buildings_working_features_order_idx" ON "buildings_working_features" USING btree ("_order");
  CREATE INDEX "buildings_working_features_parent_id_idx" ON "buildings_working_features" USING btree ("_parent_id");
  CREATE INDEX "buildings_working_gallery_order_idx" ON "buildings_working_gallery" USING btree ("_order");
  CREATE INDEX "buildings_working_gallery_parent_id_idx" ON "buildings_working_gallery" USING btree ("_parent_id");
  CREATE INDEX "buildings_working_gallery_image_idx" ON "buildings_working_gallery" USING btree ("image_id");
  CREATE INDEX "buildings_working_prices_order_idx" ON "buildings_working_prices" USING btree ("_order");
  CREATE INDEX "buildings_working_prices_parent_id_idx" ON "buildings_working_prices" USING btree ("_parent_id");
  CREATE INDEX "buildings_working_included_items_order_idx" ON "buildings_working_included_items" USING btree ("_order");
  CREATE INDEX "buildings_working_included_items_parent_id_idx" ON "buildings_working_included_items" USING btree ("_parent_id");
  CREATE INDEX "buildings_working_included_order_idx" ON "buildings_working_included" USING btree ("_order");
  CREATE INDEX "buildings_working_included_parent_id_idx" ON "buildings_working_included" USING btree ("_parent_id");
  CREATE INDEX "buildings_serviced_features_order_idx" ON "buildings_serviced_features" USING btree ("_order");
  CREATE INDEX "buildings_serviced_features_parent_id_idx" ON "buildings_serviced_features" USING btree ("_parent_id");
  CREATE INDEX "buildings_serviced_gallery_order_idx" ON "buildings_serviced_gallery" USING btree ("_order");
  CREATE INDEX "buildings_serviced_gallery_parent_id_idx" ON "buildings_serviced_gallery" USING btree ("_parent_id");
  CREATE INDEX "buildings_serviced_gallery_image_idx" ON "buildings_serviced_gallery" USING btree ("image_id");
  CREATE INDEX "buildings_serviced_prices_order_idx" ON "buildings_serviced_prices" USING btree ("_order");
  CREATE INDEX "buildings_serviced_prices_parent_id_idx" ON "buildings_serviced_prices" USING btree ("_parent_id");
  CREATE INDEX "buildings_serviced_included_items_order_idx" ON "buildings_serviced_included_items" USING btree ("_order");
  CREATE INDEX "buildings_serviced_included_items_parent_id_idx" ON "buildings_serviced_included_items" USING btree ("_parent_id");
  CREATE INDEX "buildings_serviced_included_order_idx" ON "buildings_serviced_included" USING btree ("_order");
  CREATE INDEX "buildings_serviced_included_parent_id_idx" ON "buildings_serviced_included" USING btree ("_parent_id");
  CREATE INDEX "buildings_coliving_coliving_image_idx" ON "buildings" USING btree ("coliving_image_id");
  CREATE INDEX "buildings_coliving_about_coliving_about_poster_idx" ON "buildings" USING btree ("coliving_about_poster_id");
  CREATE INDEX "buildings_working_working_image_idx" ON "buildings" USING btree ("working_image_id");
  CREATE INDEX "buildings_serviced_serviced_image_idx" ON "buildings" USING btree ("serviced_image_id");
  CREATE INDEX "buildings_updated_at_idx" ON "buildings" USING btree ("updated_at");
  CREATE INDEX "buildings_created_at_idx" ON "buildings" USING btree ("created_at");
  CREATE INDEX "venues_features_order_idx" ON "venues_features" USING btree ("_order");
  CREATE INDEX "venues_features_parent_id_idx" ON "venues_features" USING btree ("_parent_id");
  CREATE INDEX "venues_gallery_order_idx" ON "venues_gallery" USING btree ("_order");
  CREATE INDEX "venues_gallery_parent_id_idx" ON "venues_gallery" USING btree ("_parent_id");
  CREATE INDEX "venues_gallery_image_idx" ON "venues_gallery" USING btree ("image_id");
  CREATE INDEX "venues_included_items_order_idx" ON "venues_included_items" USING btree ("_order");
  CREATE INDEX "venues_included_items_parent_id_idx" ON "venues_included_items" USING btree ("_parent_id");
  CREATE INDEX "venues_included_order_idx" ON "venues_included" USING btree ("_order");
  CREATE INDEX "venues_included_parent_id_idx" ON "venues_included" USING btree ("_parent_id");
  CREATE INDEX "venues__order_idx" ON "venues" USING btree ("_order");
  CREATE INDEX "venues_building_idx" ON "venues" USING btree ("building_id");
  CREATE UNIQUE INDEX "venues_slug_idx" ON "venues" USING btree ("slug");
  CREATE INDEX "venues_image_idx" ON "venues" USING btree ("image_id");
  CREATE INDEX "venues_updated_at_idx" ON "venues" USING btree ("updated_at");
  CREATE INDEX "venues_created_at_idx" ON "venues" USING btree ("created_at");
  CREATE INDEX "templates_blocks_location_hero_order_idx" ON "templates_blocks_location_hero" USING btree ("_order");
  CREATE INDEX "templates_blocks_location_hero_parent_id_idx" ON "templates_blocks_location_hero" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_location_hero_path_idx" ON "templates_blocks_location_hero" USING btree ("_path");
  CREATE INDEX "templates_blocks_location_text_intro_order_idx" ON "templates_blocks_location_text_intro" USING btree ("_order");
  CREATE INDEX "templates_blocks_location_text_intro_parent_id_idx" ON "templates_blocks_location_text_intro" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_location_text_intro_path_idx" ON "templates_blocks_location_text_intro" USING btree ("_path");
  CREATE INDEX "templates_blocks_location_rooms_order_idx" ON "templates_blocks_location_rooms" USING btree ("_order");
  CREATE INDEX "templates_blocks_location_rooms_parent_id_idx" ON "templates_blocks_location_rooms" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_location_rooms_path_idx" ON "templates_blocks_location_rooms" USING btree ("_path");
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_buildings_fk" FOREIGN KEY ("buildings_id") REFERENCES "public"."buildings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_venues_fk" FOREIGN KEY ("venues_id") REFERENCES "public"."venues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_rels" ADD CONSTRAINT "templates_rels_buildings_fk" FOREIGN KEY ("buildings_id") REFERENCES "public"."buildings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_rels" ADD CONSTRAINT "templates_rels_venues_fk" FOREIGN KEY ("venues_id") REFERENCES "public"."venues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "rooms" ADD CONSTRAINT "rooms_building_id_buildings_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."buildings"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_buildings_fk" FOREIGN KEY ("buildings_id") REFERENCES "public"."buildings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_venues_fk" FOREIGN KEY ("venues_id") REFERENCES "public"."venues"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_rels_buildings_id_idx" ON "pages_rels" USING btree ("buildings_id");
  CREATE INDEX "pages_rels_venues_id_idx" ON "pages_rels" USING btree ("venues_id");
  CREATE INDEX "templates_rels_buildings_id_idx" ON "templates_rels" USING btree ("buildings_id");
  CREATE INDEX "templates_rels_venues_id_idx" ON "templates_rels" USING btree ("venues_id");
  CREATE INDEX "rooms_building_idx" ON "rooms" USING btree ("building_id");
  CREATE INDEX "payload_locked_documents_rels_buildings_id_idx" ON "payload_locked_documents_rels" USING btree ("buildings_id");
  CREATE INDEX "payload_locked_documents_rels_venues_id_idx" ON "payload_locked_documents_rels" USING btree ("venues_id");
  CREATE INDEX "rooms_slug_idx" ON "rooms" USING btree ("slug");`)

  // Each place's content, from the Locations collection this replaces
  const rows = async <T>(query: ReturnType<typeof sql>) => (await db.execute(query)).rows as T[];
  type Old = {
    id: number; type: string; name: string; slug: string; area: string; postcode: string; pill: string | null;
    image: number; intro: string; address: string | null; directionsIntro: string | null;
  };
  const olds = await rows<Old>(sql`
    SELECT "id", "type"::text AS "type", "name", "slug", "area", "postcode", "pill", "image_id" AS "image", "intro", "address", "directions_intro" AS "directionsIntro"
    FROM "locations" ORDER BY "_order"`);
  const features = await rows<{ parent: number; label: string; icon: string }>(sql`SELECT "_parent_id" AS "parent", "label", "icon"::text AS "icon" FROM "locations_features" ORDER BY "_order"`);
  const gallery = await rows<{ parent: number; image: number; name: string | null }>(sql`SELECT "_parent_id" AS "parent", "image_id" AS "image", "name" FROM "locations_gallery" ORDER BY "_order"`);
  const prices = await rows<{ parent: number; plan: string; amount: string | null }>(sql`SELECT "_parent_id" AS "parent", "plan", "amount" FROM "locations_prices" ORDER BY "_order"`);
  const groups = await rows<{ id: string; parent: number; label: string | null }>(sql`SELECT "id", "_parent_id" AS "parent", "label" FROM "locations_included" ORDER BY "_order"`);
  const items = await rows<{ parent: string; label: string; icon: string }>(sql`SELECT "_parent_id" AS "parent", "label", "icon"::text AS "icon" FROM "locations_included_items" ORDER BY "_order"`);
  const modes = await rows<{ parent: number; label: string; icon: string; steps: string; mapsUrl: string }>(sql`
    SELECT "_parent_id" AS "parent", "label", "icon"::text AS "icon", "steps", "maps_url" AS "mapsUrl" FROM "locations_travel_modes" ORDER BY "_order"`);
  const of = <T extends { parent: unknown }>(list: T[], parent: unknown) => list.filter((r) => r.parent === parent).map(({ parent: _, ...rest }) => rest);
  const place = (old: Old) => ({
    slug: old.slug,
    area: old.area,
    postcode: old.postcode,
    pill: old.pill,
    image: old.image,
    features: of(features, old.id),
    intro: old.intro,
    gallery: of(gallery, old.id),
    included: groups.filter((g) => g.parent === old.id).map((g) => ({ label: g.label, items: of(items, g.id) })),
    directionsIntro: old.directionsIntro,
  });

  // The physical buildings: one per address (named after the working space or house there, or
  // else its venues' area), or per place without one. A building takes its places' address and
  // ways to get there, and its working space or house becomes its offering; venues become venue rooms.
  const byAddress = new Map<string, Old[]>();
  for (const old of olds) {
    const key = old.address ?? `place:${old.id}`;
    byAddress.set(key, [...(byAddress.get(key) ?? []), old]);
  }
  const newIds = new Map<number, { kind: string; id: number }>();
  const buildingAt = new Map<string, number>();
  for (const [key, group] of byAddress) {
    const main = group.find((o) => o.type === "working" || o.type === "serviced");
    const withModes = [main, ...group].find((o) => o && modes.some((m) => m.parent === o.id));
    const building = await payload.create({
      collection: "buildings",
      data: {
        name: main?.name ?? (group[0].type === "venue" ? group[0].area : group[0].name),
        address: group[0].address ?? undefined,
        travelModes: withModes ? of(modes, withModes.id) : [],
        ...(main && { [main.type]: { enabled: true, ...place(main), prices: of(prices, main.id).map((p) => ({ plan: p.plan, amount: p.amount == null ? null : Number(p.amount) })) } }),
      } as never,
      req,
    });
    buildingAt.set(key, building.id);
    if (main) newIds.set(main.id, { kind: "buildings", id: building.id });
    for (const venue of group.filter((o) => o.type === "venue")) {
      const doc = await payload.create({ collection: "venues", data: { name: venue.name, building: building.id, ...place(venue) } as never, req });
      newIds.set(venue.id, { kind: "venues", id: doc.id });
    }
  }

  // Location cards on pages now name buildings (working spaces, serviced living) or venue rooms
  const rels = await rows<{ id: number; parent: number; path: string; location: number }>(sql`
    SELECT "id", "parent_id" AS "parent", "path", "locations_id" AS "location" FROM "pages_rels" WHERE "locations_id" IS NOT NULL`);
  for (const rel of rels) {
    const target = newIds.get(rel.location);
    if (!target) continue;
    const path = rel.path.replace(/locations$/, target.kind);
    if (target.kind === "venues") await db.execute(sql`UPDATE "pages_rels" SET "venues_id" = ${target.id}, "path" = ${path} WHERE "id" = ${rel.id}`);
    else await db.execute(sql`UPDATE "pages_rels" SET "buildings_id" = ${target.id}, "path" = ${path} WHERE "id" = ${rel.id}`);
    // The section's kind, from what its cards were (its place in the layout is its order, from 1)
    const order = Number(rel.path.split(".")[1]) + 1;
    const kind = olds.find((o) => o.id === rel.location)!.type;
    await db.execute(sql`UPDATE "pages_blocks_location_cards" SET "kind" = ${kind}::"enum_pages_blocks_location_cards_kind" WHERE "_parent_id" = ${rel.parent} AND "_order" = ${order}`);
  }

  // Old Oak's co-living: its page splits into the building's co-living (with the room template's
  // "What's included" and "About the building", and the shared room lengths) and the co-living
  // template. Its bedrooms join the building; the page goes.
  const lengths = await rows<{ months: string }>(sql`SELECT "months" FROM "pricing_structure_room_lengths" ORDER BY "_order"`);
  const roomsIncluded = await rows<{ label: string; icon: string }>(sql`
    SELECT i."label", i."icon"::text AS "icon" FROM "templates_room_column_included" i JOIN "templates" t ON t."id" = i."_parent_id"
    WHERE t."type" = 'room' ORDER BY i."_order"`);
  const [about] = await rows<{ heading: string | null; text: string | null; poster: number | null; video: string | null }>(sql`
    SELECT "room_column_about_heading" AS "heading", "room_column_about_text" AS "text", "room_column_about_poster_id" AS "poster", "room_column_about_video" AS "video"
    FROM "templates" WHERE "type" = 'room'`);

  const page = (await payload.find({ collection: "pages", where: { slug: { equals: "old-oak" } }, limit: 1, depth: 0, req })).docs[0];
  if (page) {
    const { place: coliving, gettingThere, layout } = buildingFromPage(page.layout as never, "Old Oak");
    const id = buildingAt.get(gettingThere.address ?? "") ?? (await payload.create({ collection: "buildings", data: { name: "Old Oak", ...gettingThere } as never, req })).id;
    // Only its Co-living tab: the rest of the building stays as it is
    await payload.update({
      collection: "buildings",
      id,
      data: {
        coliving: {
          ...coliving,
          enabled: true,
          slug: "old-oak",
          postcode: "NW10",
          roomLengths: lengths.map((l) => ({ months: Number(l.months) })),
          roomsIncluded,
          about: about ?? {},
        },
      } as never,
      req,
    });
    await db.execute(sql`UPDATE "rooms" SET "building_id" = ${id}`);

    const template = await payload.find({ collection: "templates", where: { type: { equals: "coliving" } }, limit: 1, req });
    if (!template.docs[0])
      await payload.create({ collection: "templates", data: { name: "Co-living page", type: "coliving", floatingEnquiry: Boolean(page.floatingEnquiry), layout } as never, req });
    await payload.delete({ collection: "pages", id: page.id, req });

    // Canary Wharf: a building with co-living coming soon, with the photo from its card on the co-living page
    const [card] = await rows<{ image: number }>(sql`SELECT "image_id" AS "image" FROM "pages_blocks_link_cards_cards" WHERE "title" = 'Canary Wharf' LIMIT 1`);
    if (card)
      await payload.create({
        collection: "buildings",
        data: {
          name: "Canary Wharf",
          coliving: {
            enabled: true,
            slug: "canary-wharf",
            comingSoon: true,
            area: "East London",
            postcode: "E14",
            image: card.image,
            intro: "The Collective Canary Wharf, opening soon, will offer the option to stop in or stay a while, with stays from just one night. Join the waitlist to hear as soon as rooms are available.",
            gallery: [{ image: card.image }],
          },
        } as never,
        req,
      });
  }

  await db.execute(sql`
  ALTER TABLE "rooms" ALTER COLUMN "building_id" SET NOT NULL;
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_locations_fk";
  ALTER TABLE "templates_rels" DROP CONSTRAINT "templates_rels_locations_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_locations_fk";
  ALTER TABLE "templates_room_column_included" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "locations_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "locations_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "locations_prices" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "locations_included_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "locations_included" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "locations_travel_modes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "locations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pricing_structure_room_lengths" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "templates_room_column_included" CASCADE;
  DROP TABLE "locations_features" CASCADE;
  DROP TABLE "locations_gallery" CASCADE;
  DROP TABLE "locations_prices" CASCADE;
  DROP TABLE "locations_included_items" CASCADE;
  DROP TABLE "locations_included" CASCADE;
  DROP TABLE "locations_travel_modes" CASCADE;
  DROP TABLE "locations" CASCADE;
  DROP TABLE "pricing_structure_room_lengths" CASCADE;
  ALTER TABLE "templates" DROP CONSTRAINT "templates_room_column_about_poster_id_media_id_fk";
  DROP INDEX "pages_rels_locations_id_idx";
  DROP INDEX "templates_room_column_about_room_column_about_poster_idx";
  DROP INDEX "templates_rels_locations_id_idx";
  DROP INDEX "payload_locked_documents_rels_locations_id_idx";
  ALTER TABLE "pages_rels" DROP COLUMN "locations_id";
  ALTER TABLE "templates" DROP COLUMN "room_column_about_heading";
  ALTER TABLE "templates" DROP COLUMN "room_column_about_text";
  ALTER TABLE "templates" DROP COLUMN "room_column_about_poster_id";
  ALTER TABLE "templates" DROP COLUMN "room_column_about_video";
  ALTER TABLE "templates_rels" DROP COLUMN "locations_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "locations_id";
  DROP TYPE "public"."enum_templates_room_column_included_icon";
  DROP TYPE "public"."enum_locations_features_icon";
  DROP TYPE "public"."enum_locations_included_items_icon";
  DROP TYPE "public"."enum_locations_travel_modes_icon";
  DROP TYPE "public"."enum_locations_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_templates_room_column_included_icon" AS ENUM('Api', 'Automate', 'BarKitchen', 'Basin', 'Bed', 'Bike', 'Bill', 'Bus', 'Calendar', 'CalendarCheck', 'Car', 'Cctv', 'Check', 'Chef', 'Cocktail', 'Community', 'Crowd', 'Database', 'DealFlow', 'Desk', 'Dining', 'DoorEntry', 'Dumbbell', 'FeasibilityModel', 'FruitBowl', 'Groceries', 'Guard', 'Hack', 'HandsHeart', 'Handshake', 'Help', 'Hob', 'Icon360', 'Info', 'IntegrateData', 'Integrations', 'Lion', 'LocationPin', 'Lock', 'Lounge', 'Mail', 'ManageMembership', 'MeetingTable', 'MemberSupport', 'Membership', 'Microwave', 'Outdoor', 'Oven', 'Padlock', 'People', 'Plane', 'Play', 'PrivateOffice', 'QuoteMark', 'Relationships', 'Reporting', 'Restaurant', 'RestaurantsNearby', 'RoomAllocation', 'RoomPricing', 'Roundel', 'Router', 'Scales', 'Shelves', 'SmartHome', 'SocialNetwork', 'Sofa', 'SprayBottle', 'Sprout', 'Star', 'SunCloud', 'TapeMeasure', 'TeamChat', 'TrackMarket', 'Train', 'WashingMachine', 'Workshop', 'Wrench');
  CREATE TYPE "public"."enum_locations_features_icon" AS ENUM('Api', 'Automate', 'BarKitchen', 'Basin', 'Bed', 'Bike', 'Bill', 'Bus', 'Calendar', 'CalendarCheck', 'Car', 'Cctv', 'Check', 'Chef', 'Cocktail', 'Community', 'Crowd', 'Database', 'DealFlow', 'Desk', 'Dining', 'DoorEntry', 'Dumbbell', 'FeasibilityModel', 'FruitBowl', 'Groceries', 'Guard', 'Hack', 'HandsHeart', 'Handshake', 'Help', 'Hob', 'Icon360', 'Info', 'IntegrateData', 'Integrations', 'Lion', 'LocationPin', 'Lock', 'Lounge', 'Mail', 'ManageMembership', 'MeetingTable', 'MemberSupport', 'Membership', 'Microwave', 'Outdoor', 'Oven', 'Padlock', 'People', 'Plane', 'Play', 'PrivateOffice', 'QuoteMark', 'Relationships', 'Reporting', 'Restaurant', 'RestaurantsNearby', 'RoomAllocation', 'RoomPricing', 'Roundel', 'Router', 'Scales', 'Shelves', 'SmartHome', 'SocialNetwork', 'Sofa', 'SprayBottle', 'Sprout', 'Star', 'SunCloud', 'TapeMeasure', 'TeamChat', 'TrackMarket', 'Train', 'WashingMachine', 'Workshop', 'Wrench');
  CREATE TYPE "public"."enum_locations_included_items_icon" AS ENUM('Api', 'Automate', 'BarKitchen', 'Basin', 'Bed', 'Bike', 'Bill', 'Bus', 'Calendar', 'CalendarCheck', 'Car', 'Cctv', 'Check', 'Chef', 'Cocktail', 'Community', 'Crowd', 'Database', 'DealFlow', 'Desk', 'Dining', 'DoorEntry', 'Dumbbell', 'FeasibilityModel', 'FruitBowl', 'Groceries', 'Guard', 'Hack', 'HandsHeart', 'Handshake', 'Help', 'Hob', 'Icon360', 'Info', 'IntegrateData', 'Integrations', 'Lion', 'LocationPin', 'Lock', 'Lounge', 'Mail', 'ManageMembership', 'MeetingTable', 'MemberSupport', 'Membership', 'Microwave', 'Outdoor', 'Oven', 'Padlock', 'People', 'Plane', 'Play', 'PrivateOffice', 'QuoteMark', 'Relationships', 'Reporting', 'Restaurant', 'RestaurantsNearby', 'RoomAllocation', 'RoomPricing', 'Roundel', 'Router', 'Scales', 'Shelves', 'SmartHome', 'SocialNetwork', 'Sofa', 'SprayBottle', 'Sprout', 'Star', 'SunCloud', 'TapeMeasure', 'TeamChat', 'TrackMarket', 'Train', 'WashingMachine', 'Workshop', 'Wrench');
  CREATE TYPE "public"."enum_locations_travel_modes_icon" AS ENUM('underground', 'overground', 'bus', 'car');
  CREATE TYPE "public"."enum_locations_type" AS ENUM('working', 'serviced', 'venue');
  CREATE TABLE "templates_room_column_included" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"icon" "enum_templates_room_column_included_icon"
  );
  
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
  	"image_id" integer NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "locations_prices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"plan" varchar NOT NULL,
  	"amount" numeric
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
  	"pill" varchar,
  	"image_id" integer NOT NULL,
  	"intro" varchar NOT NULL,
  	"address" varchar,
  	"directions_intro" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pricing_structure_room_lengths" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"months" numeric NOT NULL
  );
  
  ALTER TABLE "buildings_travel_modes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "buildings_coliving_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "buildings_coliving_included_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "buildings_coliving_included" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "buildings_coliving_rooms_included" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "buildings_coliving_room_lengths" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "buildings_working_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "buildings_working_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "buildings_working_prices" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "buildings_working_included_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "buildings_working_included" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "buildings_serviced_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "buildings_serviced_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "buildings_serviced_prices" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "buildings_serviced_included_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "buildings_serviced_included" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "buildings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "venues_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "venues_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "venues_included_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "venues_included" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "venues" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_location_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_location_text_intro" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_location_rooms" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "buildings_travel_modes" CASCADE;
  DROP TABLE "buildings_coliving_gallery" CASCADE;
  DROP TABLE "buildings_coliving_included_items" CASCADE;
  DROP TABLE "buildings_coliving_included" CASCADE;
  DROP TABLE "buildings_coliving_rooms_included" CASCADE;
  DROP TABLE "buildings_coliving_room_lengths" CASCADE;
  DROP TABLE "buildings_working_features" CASCADE;
  DROP TABLE "buildings_working_gallery" CASCADE;
  DROP TABLE "buildings_working_prices" CASCADE;
  DROP TABLE "buildings_working_included_items" CASCADE;
  DROP TABLE "buildings_working_included" CASCADE;
  DROP TABLE "buildings_serviced_features" CASCADE;
  DROP TABLE "buildings_serviced_gallery" CASCADE;
  DROP TABLE "buildings_serviced_prices" CASCADE;
  DROP TABLE "buildings_serviced_included_items" CASCADE;
  DROP TABLE "buildings_serviced_included" CASCADE;
  DROP TABLE "buildings" CASCADE;
  DROP TABLE "venues_features" CASCADE;
  DROP TABLE "venues_gallery" CASCADE;
  DROP TABLE "venues_included_items" CASCADE;
  DROP TABLE "venues_included" CASCADE;
  DROP TABLE "venues" CASCADE;
  DROP TABLE "templates_blocks_location_hero" CASCADE;
  DROP TABLE "templates_blocks_location_text_intro" CASCADE;
  DROP TABLE "templates_blocks_location_rooms" CASCADE;
  ALTER TABLE "rooms" DROP CONSTRAINT "rooms_building_id_buildings_id_fk";
  
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_buildings_fk";
  
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_venues_fk";
  
  ALTER TABLE "templates_rels" DROP CONSTRAINT "templates_rels_buildings_fk";
  
  ALTER TABLE "templates_rels" DROP CONSTRAINT "templates_rels_venues_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_buildings_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_venues_fk";
  
  ALTER TABLE "templates" ALTER COLUMN "type" SET DATA TYPE text;
  DROP TYPE "public"."enum_templates_type";
  CREATE TYPE "public"."enum_templates_type" AS ENUM('working', 'serviced', 'venue', 'room');
  ALTER TABLE "templates" ALTER COLUMN "type" SET DATA TYPE "public"."enum_templates_type" USING "type"::"public"."enum_templates_type";
  DROP INDEX "rooms_building_idx";
  DROP INDEX "pages_rels_buildings_id_idx";
  DROP INDEX "pages_rels_venues_id_idx";
  DROP INDEX "templates_rels_buildings_id_idx";
  DROP INDEX "templates_rels_venues_id_idx";
  DROP INDEX "payload_locked_documents_rels_buildings_id_idx";
  DROP INDEX "payload_locked_documents_rels_venues_id_idx";
  DROP INDEX "rooms_slug_idx";
  ALTER TABLE "pages_rels" ADD COLUMN "locations_id" integer;
  ALTER TABLE "templates" ADD COLUMN "room_column_about_heading" varchar;
  ALTER TABLE "templates" ADD COLUMN "room_column_about_text" varchar;
  ALTER TABLE "templates" ADD COLUMN "room_column_about_poster_id" integer;
  ALTER TABLE "templates" ADD COLUMN "room_column_about_video" varchar;
  ALTER TABLE "templates_rels" ADD COLUMN "locations_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "locations_id" integer;
  ALTER TABLE "templates_room_column_included" ADD CONSTRAINT "templates_room_column_included_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations_features" ADD CONSTRAINT "locations_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations_gallery" ADD CONSTRAINT "locations_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "locations_gallery" ADD CONSTRAINT "locations_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations_prices" ADD CONSTRAINT "locations_prices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations_included_items" ADD CONSTRAINT "locations_included_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations_included"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations_included" ADD CONSTRAINT "locations_included_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations_travel_modes" ADD CONSTRAINT "locations_travel_modes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations" ADD CONSTRAINT "locations_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pricing_structure_room_lengths" ADD CONSTRAINT "pricing_structure_room_lengths_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pricing_structure"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "templates_room_column_included_order_idx" ON "templates_room_column_included" USING btree ("_order");
  CREATE INDEX "templates_room_column_included_parent_id_idx" ON "templates_room_column_included" USING btree ("_parent_id");
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
  CREATE INDEX "pricing_structure_room_lengths_order_idx" ON "pricing_structure_room_lengths" USING btree ("_order");
  CREATE INDEX "pricing_structure_room_lengths_parent_id_idx" ON "pricing_structure_room_lengths" USING btree ("_parent_id");
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates" ADD CONSTRAINT "templates_room_column_about_poster_id_media_id_fk" FOREIGN KEY ("room_column_about_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "templates_rels" ADD CONSTRAINT "templates_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_rels_locations_id_idx" ON "pages_rels" USING btree ("locations_id");
  CREATE INDEX "templates_room_column_about_room_column_about_poster_idx" ON "templates" USING btree ("room_column_about_poster_id");
  CREATE INDEX "templates_rels_locations_id_idx" ON "templates_rels" USING btree ("locations_id");
  CREATE INDEX "payload_locked_documents_rels_locations_id_idx" ON "payload_locked_documents_rels" USING btree ("locations_id");
  CREATE UNIQUE INDEX "rooms_slug_idx" ON "rooms" USING btree ("slug");
  ALTER TABLE "rooms" DROP COLUMN "building_id";
  ALTER TABLE "pages_blocks_location_cards" DROP COLUMN "kind";
  ALTER TABLE "pages_rels" DROP COLUMN "buildings_id";
  ALTER TABLE "pages_rels" DROP COLUMN "venues_id";
  ALTER TABLE "templates_blocks_location_gallery" DROP COLUMN "intro";
  ALTER TABLE "templates_blocks_location_cards" DROP COLUMN "kind";
  ALTER TABLE "templates_rels" DROP COLUMN "buildings_id";
  ALTER TABLE "templates_rels" DROP COLUMN "venues_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "buildings_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "venues_id";
  DROP TYPE "public"."enum_buildings_travel_modes_icon";
  DROP TYPE "public"."enum_buildings_coliving_included_items_icon";
  DROP TYPE "public"."enum_buildings_coliving_rooms_included_icon";
  DROP TYPE "public"."enum_buildings_working_features_icon";
  DROP TYPE "public"."enum_buildings_working_included_items_icon";
  DROP TYPE "public"."enum_buildings_serviced_features_icon";
  DROP TYPE "public"."enum_buildings_serviced_included_items_icon";
  DROP TYPE "public"."enum_venues_features_icon";
  DROP TYPE "public"."enum_venues_included_items_icon";
  DROP TYPE "public"."enum_pages_blocks_location_cards_kind";
  DROP TYPE "public"."enum_templates_blocks_location_cards_kind";`)
}
