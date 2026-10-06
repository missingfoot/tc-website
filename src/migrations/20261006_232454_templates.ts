import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_templates_room_column_included_icon" AS ENUM('Api', 'Automate', 'BarKitchen', 'Basin', 'Bed', 'Bike', 'Bill', 'Bus', 'Calendar', 'CalendarCheck', 'Car', 'Cctv', 'Check', 'Chef', 'Cocktail', 'Community', 'Crowd', 'Database', 'DealFlow', 'Desk', 'Dining', 'DoorEntry', 'Dumbbell', 'FeasibilityModel', 'FruitBowl', 'Groceries', 'Guard', 'Hack', 'HandsHeart', 'Handshake', 'Help', 'Hob', 'Icon360', 'Info', 'IntegrateData', 'Integrations', 'Lion', 'LocationPin', 'Lock', 'Lounge', 'Mail', 'ManageMembership', 'MeetingTable', 'MemberSupport', 'Membership', 'Microwave', 'Outdoor', 'Oven', 'Padlock', 'People', 'Plane', 'Play', 'PrivateOffice', 'QuoteMark', 'Relationships', 'Reporting', 'Restaurant', 'RestaurantsNearby', 'RoomAllocation', 'RoomPricing', 'Roundel', 'Router', 'Scales', 'Shelves', 'SmartHome', 'SocialNetwork', 'Sofa', 'SprayBottle', 'Sprout', 'Star', 'SunCloud', 'TapeMeasure', 'TeamChat', 'TrackMarket', 'Train', 'WashingMachine', 'Workshop', 'Wrench');
  CREATE TYPE "public"."enum_templates_blocks_location_included_standard_icon" AS ENUM('Api', 'Automate', 'BarKitchen', 'Basin', 'Bed', 'Bike', 'Bill', 'Bus', 'Calendar', 'CalendarCheck', 'Car', 'Cctv', 'Check', 'Chef', 'Cocktail', 'Community', 'Crowd', 'Database', 'DealFlow', 'Desk', 'Dining', 'DoorEntry', 'Dumbbell', 'FeasibilityModel', 'FruitBowl', 'Groceries', 'Guard', 'Hack', 'HandsHeart', 'Handshake', 'Help', 'Hob', 'Icon360', 'Info', 'IntegrateData', 'Integrations', 'Lion', 'LocationPin', 'Lock', 'Lounge', 'Mail', 'ManageMembership', 'MeetingTable', 'MemberSupport', 'Membership', 'Microwave', 'Outdoor', 'Oven', 'Padlock', 'People', 'Plane', 'Play', 'PrivateOffice', 'QuoteMark', 'Relationships', 'Reporting', 'Restaurant', 'RestaurantsNearby', 'RoomAllocation', 'RoomPricing', 'Roundel', 'Router', 'Scales', 'Shelves', 'SmartHome', 'SocialNetwork', 'Sofa', 'SprayBottle', 'Sprout', 'Star', 'SunCloud', 'TapeMeasure', 'TeamChat', 'TrackMarket', 'Train', 'WashingMachine', 'Workshop', 'Wrench');
  CREATE TYPE "public"."enum_templates_blocks_location_pricing_button_opens" AS ENUM('enquiry', 'link', 'none');
  CREATE TYPE "public"."enum_templates_blocks_hero_image_position" AS ENUM('top', 'bottom', 'left', 'right');
  CREATE TYPE "public"."enum_templates_blocks_hero_button_type" AS ENUM('none', 'button', 'video');
  CREATE TYPE "public"."enum_templates_blocks_hero_button_opens" AS ENUM('link', 'enquiry');
  CREATE TYPE "public"."enum_templates_blocks_hero_button_enquiry" AS ENUM('living', 'working', 'serviced', 'events', 'waitlist');
  CREATE TYPE "public"."enum_templates_blocks_intro_layout" AS ENUM('split', 'stacked');
  CREATE TYPE "public"."enum_templates_blocks_intro_buttons" AS ENUM('light', 'dark', 'contact', 'enquiry');
  CREATE TYPE "public"."enum_templates_blocks_intro_enquiry" AS ENUM('living', 'working', 'serviced', 'events', 'waitlist');
  CREATE TYPE "public"."enum_templates_blocks_intro_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_templates_blocks_checklist_items_icon" AS ENUM('Api', 'Automate', 'BarKitchen', 'Basin', 'Bed', 'Bike', 'Bill', 'Bus', 'Calendar', 'CalendarCheck', 'Car', 'Cctv', 'Check', 'Chef', 'Cocktail', 'Community', 'Crowd', 'Database', 'DealFlow', 'Desk', 'Dining', 'DoorEntry', 'Dumbbell', 'FeasibilityModel', 'FruitBowl', 'Groceries', 'Guard', 'Hack', 'HandsHeart', 'Handshake', 'Help', 'Hob', 'Icon360', 'Info', 'IntegrateData', 'Integrations', 'Lion', 'LocationPin', 'Lock', 'Lounge', 'Mail', 'ManageMembership', 'MeetingTable', 'MemberSupport', 'Membership', 'Microwave', 'Outdoor', 'Oven', 'Padlock', 'People', 'Plane', 'Play', 'PrivateOffice', 'QuoteMark', 'Relationships', 'Reporting', 'Restaurant', 'RestaurantsNearby', 'RoomAllocation', 'RoomPricing', 'Roundel', 'Router', 'Scales', 'Shelves', 'SmartHome', 'SocialNetwork', 'Sofa', 'SprayBottle', 'Sprout', 'Star', 'SunCloud', 'TapeMeasure', 'TeamChat', 'TrackMarket', 'Train', 'WashingMachine', 'Workshop', 'Wrench');
  CREATE TYPE "public"."enum_templates_blocks_checklist_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_templates_blocks_gallery_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_templates_blocks_feature_groups_groups_items_icon" AS ENUM('Api', 'Automate', 'BarKitchen', 'Basin', 'Bed', 'Bike', 'Bill', 'Bus', 'Calendar', 'CalendarCheck', 'Car', 'Cctv', 'Check', 'Chef', 'Cocktail', 'Community', 'Crowd', 'Database', 'DealFlow', 'Desk', 'Dining', 'DoorEntry', 'Dumbbell', 'FeasibilityModel', 'FruitBowl', 'Groceries', 'Guard', 'Hack', 'HandsHeart', 'Handshake', 'Help', 'Hob', 'Icon360', 'Info', 'IntegrateData', 'Integrations', 'Lion', 'LocationPin', 'Lock', 'Lounge', 'Mail', 'ManageMembership', 'MeetingTable', 'MemberSupport', 'Membership', 'Microwave', 'Outdoor', 'Oven', 'Padlock', 'People', 'Plane', 'Play', 'PrivateOffice', 'QuoteMark', 'Relationships', 'Reporting', 'Restaurant', 'RestaurantsNearby', 'RoomAllocation', 'RoomPricing', 'Roundel', 'Router', 'Scales', 'Shelves', 'SmartHome', 'SocialNetwork', 'Sofa', 'SprayBottle', 'Sprout', 'Star', 'SunCloud', 'TapeMeasure', 'TeamChat', 'TrackMarket', 'Train', 'WashingMachine', 'Workshop', 'Wrench');
  CREATE TYPE "public"."enum_templates_blocks_feature_groups_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_templates_blocks_location_cards_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_templates_blocks_room_cards_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_templates_blocks_link_cards_cards_position" AS ENUM('top', 'bottom', 'left', 'right');
  CREATE TYPE "public"."enum_templates_blocks_link_cards_card_style" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum_templates_blocks_link_cards_image_shape" AS ENUM('wide', 'tall');
  CREATE TYPE "public"."enum_templates_blocks_link_cards_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_templates_blocks_collage_split_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_templates_blocks_collage_split_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_templates_blocks_testimonials_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_templates_blocks_press_quotes_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_templates_blocks_team_grid_people_position" AS ENUM('top', 'bottom', 'left', 'right');
  CREATE TYPE "public"."enum_templates_blocks_team_grid_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_templates_blocks_reviews_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_templates_blocks_directions_travel_modes_icon" AS ENUM('underground', 'overground', 'bus', 'car');
  CREATE TYPE "public"."enum_templates_blocks_directions_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_templates_blocks_faq_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_templates_blocks_faq_directory_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_templates_blocks_open_positions_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_templates_blocks_media_kit_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_templates_blocks_image_carousel_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_templates_blocks_perk_cards_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_templates_blocks_download_card_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_templates_blocks_promo_cards_cards_position" AS ENUM('top', 'bottom', 'left', 'right');
  CREATE TYPE "public"."enum_templates_blocks_promo_cards_cards_enquiry" AS ENUM('living', 'working', 'serviced', 'events', 'waitlist');
  CREATE TYPE "public"."enum_templates_blocks_promo_cards_mobile_shape" AS ENUM('short', 'tall');
  CREATE TYPE "public"."enum_templates_blocks_promo_cards_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_templates_type" AS ENUM('working', 'serviced', 'venue', 'room');
  CREATE TABLE "templates_room_column_included" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"icon" "enum_templates_room_column_included_icon"
  );
  
  CREATE TABLE "templates_blocks_location_header" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "templates_blocks_location_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "templates_blocks_location_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"tour_label" varchar DEFAULT 'View 3D Tour',
  	"tour_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "templates_blocks_location_included_standard" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"icon" "enum_templates_blocks_location_included_standard_icon" NOT NULL
  );
  
  CREATE TABLE "templates_blocks_location_included" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'What’s included' NOT NULL,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "templates_blocks_location_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Pricing' NOT NULL,
  	"intro" varchar,
  	"note" varchar,
  	"button_opens" "enum_templates_blocks_location_pricing_button_opens" DEFAULT 'enquiry',
  	"button_href" varchar,
  	"button_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "templates_blocks_location_directions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Well connected' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "templates_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"image_id" integer NOT NULL,
  	"image_position" "enum_templates_blocks_hero_image_position",
  	"button_type" "enum_templates_blocks_hero_button_type" DEFAULT 'none',
  	"button_opens" "enum_templates_blocks_hero_button_opens" DEFAULT 'link',
  	"button_href" varchar,
  	"button_enquiry" "enum_templates_blocks_hero_button_enquiry",
  	"button_video_url" varchar,
  	"button_label" varchar,
  	"button_arrow" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "templates_blocks_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"layout" "enum_templates_blocks_intro_layout" DEFAULT 'split',
  	"buttons" "enum_templates_blocks_intro_buttons" DEFAULT 'light',
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"enquiry" "enum_templates_blocks_intro_enquiry",
  	"tone" "enum_templates_blocks_intro_tone" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "templates_blocks_checklist_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_templates_blocks_checklist_items_icon",
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "templates_blocks_checklist" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"intro" varchar,
  	"tone" "enum_templates_blocks_checklist_tone" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "templates_blocks_gallery_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "templates_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"intro" varchar,
  	"tour_label" varchar DEFAULT 'View 3D Tour',
  	"tour_href" varchar,
  	"tone" "enum_templates_blocks_gallery_tone" DEFAULT 'cream',
  	"block_name" varchar
  );
  
  CREATE TABLE "templates_blocks_feature_groups_groups_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"icon" "enum_templates_blocks_feature_groups_groups_items_icon" NOT NULL
  );
  
  CREATE TABLE "templates_blocks_feature_groups_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "templates_blocks_feature_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"intro" varchar,
  	"tone" "enum_templates_blocks_feature_groups_tone" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "templates_blocks_location_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"intro" varchar,
  	"cta_label" varchar DEFAULT 'More info',
  	"tone" "enum_templates_blocks_location_cards_tone" DEFAULT 'cream',
  	"block_name" varchar
  );
  
  CREATE TABLE "templates_blocks_room_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"intro" varchar,
  	"cta_label" varchar DEFAULT 'View Room',
  	"tone" "enum_templates_blocks_room_cards_tone" DEFAULT 'cream',
  	"block_name" varchar
  );
  
  CREATE TABLE "templates_blocks_link_cards_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"position" "enum_templates_blocks_link_cards_cards_position",
  	"cta_label" varchar NOT NULL,
  	"cta_href" varchar NOT NULL
  );
  
  CREATE TABLE "templates_blocks_link_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"intro" varchar,
  	"more_link_label" varchar,
  	"more_link_href" varchar,
  	"card_style" "enum_templates_blocks_link_cards_card_style" DEFAULT 'dark',
  	"image_shape" "enum_templates_blocks_link_cards_image_shape" DEFAULT 'wide',
  	"tone" "enum_templates_blocks_link_cards_tone" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "templates_blocks_collage_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"images_main_id" integer NOT NULL,
  	"images_top_id" integer NOT NULL,
  	"images_bottom_id" integer NOT NULL,
  	"side" "enum_templates_blocks_collage_split_side" DEFAULT 'left',
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"tone" "enum_templates_blocks_collage_split_tone" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "templates_blocks_testimonials_people" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"photo_id" integer NOT NULL,
  	"video" varchar
  );
  
  CREATE TABLE "templates_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"intro" varchar,
  	"tone" "enum_templates_blocks_testimonials_tone" DEFAULT 'cream',
  	"block_name" varchar
  );
  
  CREATE TABLE "templates_blocks_press_quotes_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"publication" varchar NOT NULL,
  	"logo_id" integer
  );
  
  CREATE TABLE "templates_blocks_press_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"intro" varchar,
  	"tone" "enum_templates_blocks_press_quotes_tone" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "templates_blocks_team_grid_people" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"photo_id" integer NOT NULL,
  	"position" "enum_templates_blocks_team_grid_people_position"
  );
  
  CREATE TABLE "templates_blocks_team_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"intro" varchar,
  	"tone" "enum_templates_blocks_team_grid_tone" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "templates_blocks_reviews_reviews" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"rating" numeric DEFAULT 5 NOT NULL,
  	"photo_id" integer,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "templates_blocks_reviews" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"intro" varchar,
  	"tone" "enum_templates_blocks_reviews_tone" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "templates_blocks_directions_travel_modes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"icon" "enum_templates_blocks_directions_travel_modes_icon" NOT NULL,
  	"steps" varchar NOT NULL,
  	"maps_url" varchar NOT NULL
  );
  
  CREATE TABLE "templates_blocks_directions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Well connected' NOT NULL,
  	"intro" varchar,
  	"place" varchar NOT NULL,
  	"map_embed_url" varchar NOT NULL,
  	"tone" "enum_templates_blocks_directions_tone" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "templates_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"numbered" boolean
  );
  
  CREATE TABLE "templates_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"intro" varchar,
  	"outro" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"anchor" varchar,
  	"tone" "enum_templates_blocks_faq_tone" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "templates_blocks_faq_directory_topics_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"numbered" boolean
  );
  
  CREATE TABLE "templates_blocks_faq_directory_topics" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"topic" varchar NOT NULL
  );
  
  CREATE TABLE "templates_blocks_faq_directory" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tone" "enum_templates_blocks_faq_directory_tone" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "templates_blocks_open_positions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Open positions' NOT NULL,
  	"tone" "enum_templates_blocks_open_positions_tone" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "templates_blocks_media_kit" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"intro" varchar,
  	"tone" "enum_templates_blocks_media_kit_tone" DEFAULT 'cream',
  	"block_name" varchar
  );
  
  CREATE TABLE "templates_blocks_image_carousel_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "templates_blocks_image_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"intro" varchar,
  	"footer_text" varchar,
  	"footer_link_label" varchar,
  	"footer_link_href" varchar,
  	"tone" "enum_templates_blocks_image_carousel_tone" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "templates_blocks_perk_cards_perks" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"logo_id" integer
  );
  
  CREATE TABLE "templates_blocks_perk_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"intro" varchar,
  	"tone" "enum_templates_blocks_perk_cards_tone" DEFAULT 'cream',
  	"block_name" varchar
  );
  
  CREATE TABLE "templates_blocks_download_card" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"intro" varchar NOT NULL,
  	"file_label" varchar NOT NULL,
  	"file_href" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"tone" "enum_templates_blocks_download_card_tone" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "templates_blocks_promo_cards_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"position" "enum_templates_blocks_promo_cards_cards_position",
  	"cta_label" varchar NOT NULL,
  	"cta_href" varchar NOT NULL,
  	"enquiry" "enum_templates_blocks_promo_cards_cards_enquiry"
  );
  
  CREATE TABLE "templates_blocks_promo_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"mobile_shape" "enum_templates_blocks_promo_cards_mobile_shape" DEFAULT 'short',
  	"tone" "enum_templates_blocks_promo_cards_tone" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "templates_blocks_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Connect with us' NOT NULL,
  	"intro" varchar DEFAULT 'Keep up with what we are up to on social media, and get the chance to get promotions!',
  	"block_name" varchar
  );
  
  CREATE TABLE "templates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"type" "enum_templates_type" NOT NULL,
  	"floating_enquiry" boolean DEFAULT true,
  	"room_column_about_heading" varchar,
  	"room_column_about_text" varchar,
  	"room_column_about_poster_id" integer,
  	"room_column_about_video" varchar,
  	"room_column_co_living_about" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "templates_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locations_id" integer,
  	"rooms_id" integer
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "templates_id" integer;
  ALTER TABLE "templates_room_column_included" ADD CONSTRAINT "templates_room_column_included_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_location_header" ADD CONSTRAINT "templates_blocks_location_header_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_location_intro" ADD CONSTRAINT "templates_blocks_location_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_location_gallery" ADD CONSTRAINT "templates_blocks_location_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_location_included_standard" ADD CONSTRAINT "templates_blocks_location_included_standard_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates_blocks_location_included"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_location_included" ADD CONSTRAINT "templates_blocks_location_included_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_location_pricing" ADD CONSTRAINT "templates_blocks_location_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_location_directions" ADD CONSTRAINT "templates_blocks_location_directions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_hero" ADD CONSTRAINT "templates_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "templates_blocks_hero" ADD CONSTRAINT "templates_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_intro" ADD CONSTRAINT "templates_blocks_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_checklist_items" ADD CONSTRAINT "templates_blocks_checklist_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates_blocks_checklist"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_checklist" ADD CONSTRAINT "templates_blocks_checklist_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_gallery_photos" ADD CONSTRAINT "templates_blocks_gallery_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "templates_blocks_gallery_photos" ADD CONSTRAINT "templates_blocks_gallery_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_gallery" ADD CONSTRAINT "templates_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_feature_groups_groups_items" ADD CONSTRAINT "templates_blocks_feature_groups_groups_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates_blocks_feature_groups_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_feature_groups_groups" ADD CONSTRAINT "templates_blocks_feature_groups_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates_blocks_feature_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_feature_groups" ADD CONSTRAINT "templates_blocks_feature_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_location_cards" ADD CONSTRAINT "templates_blocks_location_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_room_cards" ADD CONSTRAINT "templates_blocks_room_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_link_cards_cards" ADD CONSTRAINT "templates_blocks_link_cards_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "templates_blocks_link_cards_cards" ADD CONSTRAINT "templates_blocks_link_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates_blocks_link_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_link_cards" ADD CONSTRAINT "templates_blocks_link_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_collage_split" ADD CONSTRAINT "templates_blocks_collage_split_images_main_id_media_id_fk" FOREIGN KEY ("images_main_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "templates_blocks_collage_split" ADD CONSTRAINT "templates_blocks_collage_split_images_top_id_media_id_fk" FOREIGN KEY ("images_top_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "templates_blocks_collage_split" ADD CONSTRAINT "templates_blocks_collage_split_images_bottom_id_media_id_fk" FOREIGN KEY ("images_bottom_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "templates_blocks_collage_split" ADD CONSTRAINT "templates_blocks_collage_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_testimonials_people" ADD CONSTRAINT "templates_blocks_testimonials_people_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "templates_blocks_testimonials_people" ADD CONSTRAINT "templates_blocks_testimonials_people_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_testimonials" ADD CONSTRAINT "templates_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_press_quotes_quotes" ADD CONSTRAINT "templates_blocks_press_quotes_quotes_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "templates_blocks_press_quotes_quotes" ADD CONSTRAINT "templates_blocks_press_quotes_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates_blocks_press_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_press_quotes" ADD CONSTRAINT "templates_blocks_press_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_team_grid_people" ADD CONSTRAINT "templates_blocks_team_grid_people_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "templates_blocks_team_grid_people" ADD CONSTRAINT "templates_blocks_team_grid_people_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates_blocks_team_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_team_grid" ADD CONSTRAINT "templates_blocks_team_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_reviews_reviews" ADD CONSTRAINT "templates_blocks_reviews_reviews_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "templates_blocks_reviews_reviews" ADD CONSTRAINT "templates_blocks_reviews_reviews_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates_blocks_reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_reviews" ADD CONSTRAINT "templates_blocks_reviews_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_directions_travel_modes" ADD CONSTRAINT "templates_blocks_directions_travel_modes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates_blocks_directions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_directions" ADD CONSTRAINT "templates_blocks_directions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_faq_items" ADD CONSTRAINT "templates_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_faq" ADD CONSTRAINT "templates_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_faq_directory_topics_items" ADD CONSTRAINT "templates_blocks_faq_directory_topics_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates_blocks_faq_directory_topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_faq_directory_topics" ADD CONSTRAINT "templates_blocks_faq_directory_topics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates_blocks_faq_directory"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_faq_directory" ADD CONSTRAINT "templates_blocks_faq_directory_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_open_positions" ADD CONSTRAINT "templates_blocks_open_positions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_media_kit" ADD CONSTRAINT "templates_blocks_media_kit_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_image_carousel_photos" ADD CONSTRAINT "templates_blocks_image_carousel_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "templates_blocks_image_carousel_photos" ADD CONSTRAINT "templates_blocks_image_carousel_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates_blocks_image_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_image_carousel" ADD CONSTRAINT "templates_blocks_image_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_perk_cards_perks" ADD CONSTRAINT "templates_blocks_perk_cards_perks_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "templates_blocks_perk_cards_perks" ADD CONSTRAINT "templates_blocks_perk_cards_perks_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "templates_blocks_perk_cards_perks" ADD CONSTRAINT "templates_blocks_perk_cards_perks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates_blocks_perk_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_perk_cards" ADD CONSTRAINT "templates_blocks_perk_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_download_card" ADD CONSTRAINT "templates_blocks_download_card_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "templates_blocks_download_card" ADD CONSTRAINT "templates_blocks_download_card_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_promo_cards_cards" ADD CONSTRAINT "templates_blocks_promo_cards_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "templates_blocks_promo_cards_cards" ADD CONSTRAINT "templates_blocks_promo_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates_blocks_promo_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_promo_cards" ADD CONSTRAINT "templates_blocks_promo_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_blocks_social_links" ADD CONSTRAINT "templates_blocks_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates" ADD CONSTRAINT "templates_room_column_about_poster_id_media_id_fk" FOREIGN KEY ("room_column_about_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "templates_rels" ADD CONSTRAINT "templates_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_rels" ADD CONSTRAINT "templates_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_rels" ADD CONSTRAINT "templates_rels_rooms_fk" FOREIGN KEY ("rooms_id") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "templates_room_column_included_order_idx" ON "templates_room_column_included" USING btree ("_order");
  CREATE INDEX "templates_room_column_included_parent_id_idx" ON "templates_room_column_included" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_location_header_order_idx" ON "templates_blocks_location_header" USING btree ("_order");
  CREATE INDEX "templates_blocks_location_header_parent_id_idx" ON "templates_blocks_location_header" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_location_header_path_idx" ON "templates_blocks_location_header" USING btree ("_path");
  CREATE INDEX "templates_blocks_location_intro_order_idx" ON "templates_blocks_location_intro" USING btree ("_order");
  CREATE INDEX "templates_blocks_location_intro_parent_id_idx" ON "templates_blocks_location_intro" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_location_intro_path_idx" ON "templates_blocks_location_intro" USING btree ("_path");
  CREATE INDEX "templates_blocks_location_gallery_order_idx" ON "templates_blocks_location_gallery" USING btree ("_order");
  CREATE INDEX "templates_blocks_location_gallery_parent_id_idx" ON "templates_blocks_location_gallery" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_location_gallery_path_idx" ON "templates_blocks_location_gallery" USING btree ("_path");
  CREATE INDEX "templates_blocks_location_included_standard_order_idx" ON "templates_blocks_location_included_standard" USING btree ("_order");
  CREATE INDEX "templates_blocks_location_included_standard_parent_id_idx" ON "templates_blocks_location_included_standard" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_location_included_order_idx" ON "templates_blocks_location_included" USING btree ("_order");
  CREATE INDEX "templates_blocks_location_included_parent_id_idx" ON "templates_blocks_location_included" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_location_included_path_idx" ON "templates_blocks_location_included" USING btree ("_path");
  CREATE INDEX "templates_blocks_location_pricing_order_idx" ON "templates_blocks_location_pricing" USING btree ("_order");
  CREATE INDEX "templates_blocks_location_pricing_parent_id_idx" ON "templates_blocks_location_pricing" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_location_pricing_path_idx" ON "templates_blocks_location_pricing" USING btree ("_path");
  CREATE INDEX "templates_blocks_location_directions_order_idx" ON "templates_blocks_location_directions" USING btree ("_order");
  CREATE INDEX "templates_blocks_location_directions_parent_id_idx" ON "templates_blocks_location_directions" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_location_directions_path_idx" ON "templates_blocks_location_directions" USING btree ("_path");
  CREATE INDEX "templates_blocks_hero_order_idx" ON "templates_blocks_hero" USING btree ("_order");
  CREATE INDEX "templates_blocks_hero_parent_id_idx" ON "templates_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_hero_path_idx" ON "templates_blocks_hero" USING btree ("_path");
  CREATE INDEX "templates_blocks_hero_image_idx" ON "templates_blocks_hero" USING btree ("image_id");
  CREATE INDEX "templates_blocks_intro_order_idx" ON "templates_blocks_intro" USING btree ("_order");
  CREATE INDEX "templates_blocks_intro_parent_id_idx" ON "templates_blocks_intro" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_intro_path_idx" ON "templates_blocks_intro" USING btree ("_path");
  CREATE INDEX "templates_blocks_checklist_items_order_idx" ON "templates_blocks_checklist_items" USING btree ("_order");
  CREATE INDEX "templates_blocks_checklist_items_parent_id_idx" ON "templates_blocks_checklist_items" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_checklist_order_idx" ON "templates_blocks_checklist" USING btree ("_order");
  CREATE INDEX "templates_blocks_checklist_parent_id_idx" ON "templates_blocks_checklist" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_checklist_path_idx" ON "templates_blocks_checklist" USING btree ("_path");
  CREATE INDEX "templates_blocks_gallery_photos_order_idx" ON "templates_blocks_gallery_photos" USING btree ("_order");
  CREATE INDEX "templates_blocks_gallery_photos_parent_id_idx" ON "templates_blocks_gallery_photos" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_gallery_photos_image_idx" ON "templates_blocks_gallery_photos" USING btree ("image_id");
  CREATE INDEX "templates_blocks_gallery_order_idx" ON "templates_blocks_gallery" USING btree ("_order");
  CREATE INDEX "templates_blocks_gallery_parent_id_idx" ON "templates_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_gallery_path_idx" ON "templates_blocks_gallery" USING btree ("_path");
  CREATE INDEX "templates_blocks_feature_groups_groups_items_order_idx" ON "templates_blocks_feature_groups_groups_items" USING btree ("_order");
  CREATE INDEX "templates_blocks_feature_groups_groups_items_parent_id_idx" ON "templates_blocks_feature_groups_groups_items" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_feature_groups_groups_order_idx" ON "templates_blocks_feature_groups_groups" USING btree ("_order");
  CREATE INDEX "templates_blocks_feature_groups_groups_parent_id_idx" ON "templates_blocks_feature_groups_groups" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_feature_groups_order_idx" ON "templates_blocks_feature_groups" USING btree ("_order");
  CREATE INDEX "templates_blocks_feature_groups_parent_id_idx" ON "templates_blocks_feature_groups" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_feature_groups_path_idx" ON "templates_blocks_feature_groups" USING btree ("_path");
  CREATE INDEX "templates_blocks_location_cards_order_idx" ON "templates_blocks_location_cards" USING btree ("_order");
  CREATE INDEX "templates_blocks_location_cards_parent_id_idx" ON "templates_blocks_location_cards" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_location_cards_path_idx" ON "templates_blocks_location_cards" USING btree ("_path");
  CREATE INDEX "templates_blocks_room_cards_order_idx" ON "templates_blocks_room_cards" USING btree ("_order");
  CREATE INDEX "templates_blocks_room_cards_parent_id_idx" ON "templates_blocks_room_cards" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_room_cards_path_idx" ON "templates_blocks_room_cards" USING btree ("_path");
  CREATE INDEX "templates_blocks_link_cards_cards_order_idx" ON "templates_blocks_link_cards_cards" USING btree ("_order");
  CREATE INDEX "templates_blocks_link_cards_cards_parent_id_idx" ON "templates_blocks_link_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_link_cards_cards_image_idx" ON "templates_blocks_link_cards_cards" USING btree ("image_id");
  CREATE INDEX "templates_blocks_link_cards_order_idx" ON "templates_blocks_link_cards" USING btree ("_order");
  CREATE INDEX "templates_blocks_link_cards_parent_id_idx" ON "templates_blocks_link_cards" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_link_cards_path_idx" ON "templates_blocks_link_cards" USING btree ("_path");
  CREATE INDEX "templates_blocks_collage_split_order_idx" ON "templates_blocks_collage_split" USING btree ("_order");
  CREATE INDEX "templates_blocks_collage_split_parent_id_idx" ON "templates_blocks_collage_split" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_collage_split_path_idx" ON "templates_blocks_collage_split" USING btree ("_path");
  CREATE INDEX "templates_blocks_collage_split_images_images_main_idx" ON "templates_blocks_collage_split" USING btree ("images_main_id");
  CREATE INDEX "templates_blocks_collage_split_images_images_top_idx" ON "templates_blocks_collage_split" USING btree ("images_top_id");
  CREATE INDEX "templates_blocks_collage_split_images_images_bottom_idx" ON "templates_blocks_collage_split" USING btree ("images_bottom_id");
  CREATE INDEX "templates_blocks_testimonials_people_order_idx" ON "templates_blocks_testimonials_people" USING btree ("_order");
  CREATE INDEX "templates_blocks_testimonials_people_parent_id_idx" ON "templates_blocks_testimonials_people" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_testimonials_people_photo_idx" ON "templates_blocks_testimonials_people" USING btree ("photo_id");
  CREATE INDEX "templates_blocks_testimonials_order_idx" ON "templates_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "templates_blocks_testimonials_parent_id_idx" ON "templates_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_testimonials_path_idx" ON "templates_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "templates_blocks_press_quotes_quotes_order_idx" ON "templates_blocks_press_quotes_quotes" USING btree ("_order");
  CREATE INDEX "templates_blocks_press_quotes_quotes_parent_id_idx" ON "templates_blocks_press_quotes_quotes" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_press_quotes_quotes_logo_idx" ON "templates_blocks_press_quotes_quotes" USING btree ("logo_id");
  CREATE INDEX "templates_blocks_press_quotes_order_idx" ON "templates_blocks_press_quotes" USING btree ("_order");
  CREATE INDEX "templates_blocks_press_quotes_parent_id_idx" ON "templates_blocks_press_quotes" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_press_quotes_path_idx" ON "templates_blocks_press_quotes" USING btree ("_path");
  CREATE INDEX "templates_blocks_team_grid_people_order_idx" ON "templates_blocks_team_grid_people" USING btree ("_order");
  CREATE INDEX "templates_blocks_team_grid_people_parent_id_idx" ON "templates_blocks_team_grid_people" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_team_grid_people_photo_idx" ON "templates_blocks_team_grid_people" USING btree ("photo_id");
  CREATE INDEX "templates_blocks_team_grid_order_idx" ON "templates_blocks_team_grid" USING btree ("_order");
  CREATE INDEX "templates_blocks_team_grid_parent_id_idx" ON "templates_blocks_team_grid" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_team_grid_path_idx" ON "templates_blocks_team_grid" USING btree ("_path");
  CREATE INDEX "templates_blocks_reviews_reviews_order_idx" ON "templates_blocks_reviews_reviews" USING btree ("_order");
  CREATE INDEX "templates_blocks_reviews_reviews_parent_id_idx" ON "templates_blocks_reviews_reviews" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_reviews_reviews_photo_idx" ON "templates_blocks_reviews_reviews" USING btree ("photo_id");
  CREATE INDEX "templates_blocks_reviews_order_idx" ON "templates_blocks_reviews" USING btree ("_order");
  CREATE INDEX "templates_blocks_reviews_parent_id_idx" ON "templates_blocks_reviews" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_reviews_path_idx" ON "templates_blocks_reviews" USING btree ("_path");
  CREATE INDEX "templates_blocks_directions_travel_modes_order_idx" ON "templates_blocks_directions_travel_modes" USING btree ("_order");
  CREATE INDEX "templates_blocks_directions_travel_modes_parent_id_idx" ON "templates_blocks_directions_travel_modes" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_directions_order_idx" ON "templates_blocks_directions" USING btree ("_order");
  CREATE INDEX "templates_blocks_directions_parent_id_idx" ON "templates_blocks_directions" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_directions_path_idx" ON "templates_blocks_directions" USING btree ("_path");
  CREATE INDEX "templates_blocks_faq_items_order_idx" ON "templates_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "templates_blocks_faq_items_parent_id_idx" ON "templates_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_faq_order_idx" ON "templates_blocks_faq" USING btree ("_order");
  CREATE INDEX "templates_blocks_faq_parent_id_idx" ON "templates_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_faq_path_idx" ON "templates_blocks_faq" USING btree ("_path");
  CREATE INDEX "templates_blocks_faq_directory_topics_items_order_idx" ON "templates_blocks_faq_directory_topics_items" USING btree ("_order");
  CREATE INDEX "templates_blocks_faq_directory_topics_items_parent_id_idx" ON "templates_blocks_faq_directory_topics_items" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_faq_directory_topics_order_idx" ON "templates_blocks_faq_directory_topics" USING btree ("_order");
  CREATE INDEX "templates_blocks_faq_directory_topics_parent_id_idx" ON "templates_blocks_faq_directory_topics" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_faq_directory_order_idx" ON "templates_blocks_faq_directory" USING btree ("_order");
  CREATE INDEX "templates_blocks_faq_directory_parent_id_idx" ON "templates_blocks_faq_directory" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_faq_directory_path_idx" ON "templates_blocks_faq_directory" USING btree ("_path");
  CREATE INDEX "templates_blocks_open_positions_order_idx" ON "templates_blocks_open_positions" USING btree ("_order");
  CREATE INDEX "templates_blocks_open_positions_parent_id_idx" ON "templates_blocks_open_positions" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_open_positions_path_idx" ON "templates_blocks_open_positions" USING btree ("_path");
  CREATE INDEX "templates_blocks_media_kit_order_idx" ON "templates_blocks_media_kit" USING btree ("_order");
  CREATE INDEX "templates_blocks_media_kit_parent_id_idx" ON "templates_blocks_media_kit" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_media_kit_path_idx" ON "templates_blocks_media_kit" USING btree ("_path");
  CREATE INDEX "templates_blocks_image_carousel_photos_order_idx" ON "templates_blocks_image_carousel_photos" USING btree ("_order");
  CREATE INDEX "templates_blocks_image_carousel_photos_parent_id_idx" ON "templates_blocks_image_carousel_photos" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_image_carousel_photos_image_idx" ON "templates_blocks_image_carousel_photos" USING btree ("image_id");
  CREATE INDEX "templates_blocks_image_carousel_order_idx" ON "templates_blocks_image_carousel" USING btree ("_order");
  CREATE INDEX "templates_blocks_image_carousel_parent_id_idx" ON "templates_blocks_image_carousel" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_image_carousel_path_idx" ON "templates_blocks_image_carousel" USING btree ("_path");
  CREATE INDEX "templates_blocks_perk_cards_perks_order_idx" ON "templates_blocks_perk_cards_perks" USING btree ("_order");
  CREATE INDEX "templates_blocks_perk_cards_perks_parent_id_idx" ON "templates_blocks_perk_cards_perks" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_perk_cards_perks_image_idx" ON "templates_blocks_perk_cards_perks" USING btree ("image_id");
  CREATE INDEX "templates_blocks_perk_cards_perks_logo_idx" ON "templates_blocks_perk_cards_perks" USING btree ("logo_id");
  CREATE INDEX "templates_blocks_perk_cards_order_idx" ON "templates_blocks_perk_cards" USING btree ("_order");
  CREATE INDEX "templates_blocks_perk_cards_parent_id_idx" ON "templates_blocks_perk_cards" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_perk_cards_path_idx" ON "templates_blocks_perk_cards" USING btree ("_path");
  CREATE INDEX "templates_blocks_download_card_order_idx" ON "templates_blocks_download_card" USING btree ("_order");
  CREATE INDEX "templates_blocks_download_card_parent_id_idx" ON "templates_blocks_download_card" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_download_card_path_idx" ON "templates_blocks_download_card" USING btree ("_path");
  CREATE INDEX "templates_blocks_download_card_image_idx" ON "templates_blocks_download_card" USING btree ("image_id");
  CREATE INDEX "templates_blocks_promo_cards_cards_order_idx" ON "templates_blocks_promo_cards_cards" USING btree ("_order");
  CREATE INDEX "templates_blocks_promo_cards_cards_parent_id_idx" ON "templates_blocks_promo_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_promo_cards_cards_image_idx" ON "templates_blocks_promo_cards_cards" USING btree ("image_id");
  CREATE INDEX "templates_blocks_promo_cards_order_idx" ON "templates_blocks_promo_cards" USING btree ("_order");
  CREATE INDEX "templates_blocks_promo_cards_parent_id_idx" ON "templates_blocks_promo_cards" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_promo_cards_path_idx" ON "templates_blocks_promo_cards" USING btree ("_path");
  CREATE INDEX "templates_blocks_social_links_order_idx" ON "templates_blocks_social_links" USING btree ("_order");
  CREATE INDEX "templates_blocks_social_links_parent_id_idx" ON "templates_blocks_social_links" USING btree ("_parent_id");
  CREATE INDEX "templates_blocks_social_links_path_idx" ON "templates_blocks_social_links" USING btree ("_path");
  CREATE UNIQUE INDEX "templates_type_idx" ON "templates" USING btree ("type");
  CREATE INDEX "templates_room_column_about_room_column_about_poster_idx" ON "templates" USING btree ("room_column_about_poster_id");
  CREATE INDEX "templates_updated_at_idx" ON "templates" USING btree ("updated_at");
  CREATE INDEX "templates_created_at_idx" ON "templates" USING btree ("created_at");
  CREATE INDEX "templates_rels_order_idx" ON "templates_rels" USING btree ("order");
  CREATE INDEX "templates_rels_parent_idx" ON "templates_rels" USING btree ("parent_id");
  CREATE INDEX "templates_rels_path_idx" ON "templates_rels" USING btree ("path");
  CREATE INDEX "templates_rels_locations_id_idx" ON "templates_rels" USING btree ("locations_id");
  CREATE INDEX "templates_rels_rooms_id_idx" ON "templates_rels" USING btree ("rooms_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_templates_fk" FOREIGN KEY ("templates_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_templates_id_idx" ON "payload_locked_documents_rels" USING btree ("templates_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "templates_room_column_included" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_location_header" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_location_intro" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_location_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_location_included_standard" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_location_included" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_location_pricing" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_location_directions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_intro" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_checklist_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_checklist" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_gallery_photos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_feature_groups_groups_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_feature_groups_groups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_feature_groups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_location_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_room_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_link_cards_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_link_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_collage_split" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_testimonials_people" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_press_quotes_quotes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_press_quotes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_team_grid_people" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_team_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_reviews_reviews" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_reviews" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_directions_travel_modes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_directions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_faq_directory_topics_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_faq_directory_topics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_faq_directory" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_open_positions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_media_kit" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_image_carousel_photos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_image_carousel" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_perk_cards_perks" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_perk_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_download_card" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_promo_cards_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_promo_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_blocks_social_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "templates_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "templates_room_column_included" CASCADE;
  DROP TABLE "templates_blocks_location_header" CASCADE;
  DROP TABLE "templates_blocks_location_intro" CASCADE;
  DROP TABLE "templates_blocks_location_gallery" CASCADE;
  DROP TABLE "templates_blocks_location_included_standard" CASCADE;
  DROP TABLE "templates_blocks_location_included" CASCADE;
  DROP TABLE "templates_blocks_location_pricing" CASCADE;
  DROP TABLE "templates_blocks_location_directions" CASCADE;
  DROP TABLE "templates_blocks_hero" CASCADE;
  DROP TABLE "templates_blocks_intro" CASCADE;
  DROP TABLE "templates_blocks_checklist_items" CASCADE;
  DROP TABLE "templates_blocks_checklist" CASCADE;
  DROP TABLE "templates_blocks_gallery_photos" CASCADE;
  DROP TABLE "templates_blocks_gallery" CASCADE;
  DROP TABLE "templates_blocks_feature_groups_groups_items" CASCADE;
  DROP TABLE "templates_blocks_feature_groups_groups" CASCADE;
  DROP TABLE "templates_blocks_feature_groups" CASCADE;
  DROP TABLE "templates_blocks_location_cards" CASCADE;
  DROP TABLE "templates_blocks_room_cards" CASCADE;
  DROP TABLE "templates_blocks_link_cards_cards" CASCADE;
  DROP TABLE "templates_blocks_link_cards" CASCADE;
  DROP TABLE "templates_blocks_collage_split" CASCADE;
  DROP TABLE "templates_blocks_testimonials_people" CASCADE;
  DROP TABLE "templates_blocks_testimonials" CASCADE;
  DROP TABLE "templates_blocks_press_quotes_quotes" CASCADE;
  DROP TABLE "templates_blocks_press_quotes" CASCADE;
  DROP TABLE "templates_blocks_team_grid_people" CASCADE;
  DROP TABLE "templates_blocks_team_grid" CASCADE;
  DROP TABLE "templates_blocks_reviews_reviews" CASCADE;
  DROP TABLE "templates_blocks_reviews" CASCADE;
  DROP TABLE "templates_blocks_directions_travel_modes" CASCADE;
  DROP TABLE "templates_blocks_directions" CASCADE;
  DROP TABLE "templates_blocks_faq_items" CASCADE;
  DROP TABLE "templates_blocks_faq" CASCADE;
  DROP TABLE "templates_blocks_faq_directory_topics_items" CASCADE;
  DROP TABLE "templates_blocks_faq_directory_topics" CASCADE;
  DROP TABLE "templates_blocks_faq_directory" CASCADE;
  DROP TABLE "templates_blocks_open_positions" CASCADE;
  DROP TABLE "templates_blocks_media_kit" CASCADE;
  DROP TABLE "templates_blocks_image_carousel_photos" CASCADE;
  DROP TABLE "templates_blocks_image_carousel" CASCADE;
  DROP TABLE "templates_blocks_perk_cards_perks" CASCADE;
  DROP TABLE "templates_blocks_perk_cards" CASCADE;
  DROP TABLE "templates_blocks_download_card" CASCADE;
  DROP TABLE "templates_blocks_promo_cards_cards" CASCADE;
  DROP TABLE "templates_blocks_promo_cards" CASCADE;
  DROP TABLE "templates_blocks_social_links" CASCADE;
  DROP TABLE "templates" CASCADE;
  DROP TABLE "templates_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_templates_fk";
  
  DROP INDEX "payload_locked_documents_rels_templates_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "templates_id";
  DROP TYPE "public"."enum_templates_room_column_included_icon";
  DROP TYPE "public"."enum_templates_blocks_location_included_standard_icon";
  DROP TYPE "public"."enum_templates_blocks_location_pricing_button_opens";
  DROP TYPE "public"."enum_templates_blocks_hero_image_position";
  DROP TYPE "public"."enum_templates_blocks_hero_button_type";
  DROP TYPE "public"."enum_templates_blocks_hero_button_opens";
  DROP TYPE "public"."enum_templates_blocks_hero_button_enquiry";
  DROP TYPE "public"."enum_templates_blocks_intro_layout";
  DROP TYPE "public"."enum_templates_blocks_intro_buttons";
  DROP TYPE "public"."enum_templates_blocks_intro_enquiry";
  DROP TYPE "public"."enum_templates_blocks_intro_tone";
  DROP TYPE "public"."enum_templates_blocks_checklist_items_icon";
  DROP TYPE "public"."enum_templates_blocks_checklist_tone";
  DROP TYPE "public"."enum_templates_blocks_gallery_tone";
  DROP TYPE "public"."enum_templates_blocks_feature_groups_groups_items_icon";
  DROP TYPE "public"."enum_templates_blocks_feature_groups_tone";
  DROP TYPE "public"."enum_templates_blocks_location_cards_tone";
  DROP TYPE "public"."enum_templates_blocks_room_cards_tone";
  DROP TYPE "public"."enum_templates_blocks_link_cards_cards_position";
  DROP TYPE "public"."enum_templates_blocks_link_cards_card_style";
  DROP TYPE "public"."enum_templates_blocks_link_cards_image_shape";
  DROP TYPE "public"."enum_templates_blocks_link_cards_tone";
  DROP TYPE "public"."enum_templates_blocks_collage_split_side";
  DROP TYPE "public"."enum_templates_blocks_collage_split_tone";
  DROP TYPE "public"."enum_templates_blocks_testimonials_tone";
  DROP TYPE "public"."enum_templates_blocks_press_quotes_tone";
  DROP TYPE "public"."enum_templates_blocks_team_grid_people_position";
  DROP TYPE "public"."enum_templates_blocks_team_grid_tone";
  DROP TYPE "public"."enum_templates_blocks_reviews_tone";
  DROP TYPE "public"."enum_templates_blocks_directions_travel_modes_icon";
  DROP TYPE "public"."enum_templates_blocks_directions_tone";
  DROP TYPE "public"."enum_templates_blocks_faq_tone";
  DROP TYPE "public"."enum_templates_blocks_faq_directory_tone";
  DROP TYPE "public"."enum_templates_blocks_open_positions_tone";
  DROP TYPE "public"."enum_templates_blocks_media_kit_tone";
  DROP TYPE "public"."enum_templates_blocks_image_carousel_tone";
  DROP TYPE "public"."enum_templates_blocks_perk_cards_tone";
  DROP TYPE "public"."enum_templates_blocks_download_card_tone";
  DROP TYPE "public"."enum_templates_blocks_promo_cards_cards_position";
  DROP TYPE "public"."enum_templates_blocks_promo_cards_cards_enquiry";
  DROP TYPE "public"."enum_templates_blocks_promo_cards_mobile_shape";
  DROP TYPE "public"."enum_templates_blocks_promo_cards_tone";
  DROP TYPE "public"."enum_templates_type";`)
}
