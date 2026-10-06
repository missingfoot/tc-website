import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_checklist_items_icon" AS ENUM('Api', 'Automate', 'BarKitchen', 'Basin', 'Bed', 'Bike', 'Bill', 'Bus', 'Calendar', 'CalendarCheck', 'Car', 'Cctv', 'Check', 'Chef', 'Cocktail', 'Community', 'Crowd', 'Database', 'DealFlow', 'Desk', 'Dining', 'DoorEntry', 'Dumbbell', 'FeasibilityModel', 'FruitBowl', 'Groceries', 'Guard', 'Hack', 'HandsHeart', 'Handshake', 'Help', 'Hob', 'Icon360', 'Info', 'IntegrateData', 'Integrations', 'Lion', 'LocationPin', 'Lock', 'Lounge', 'Mail', 'ManageMembership', 'MeetingTable', 'MemberSupport', 'Membership', 'Microwave', 'Outdoor', 'Oven', 'Padlock', 'People', 'Plane', 'Play', 'PrivateOffice', 'QuoteMark', 'Relationships', 'Reporting', 'Restaurant', 'RestaurantsNearby', 'RoomAllocation', 'RoomPricing', 'Roundel', 'Router', 'Scales', 'Shelves', 'SmartHome', 'SocialNetwork', 'Sofa', 'SprayBottle', 'Sprout', 'Star', 'SunCloud', 'TapeMeasure', 'TeamChat', 'TrackMarket', 'Train', 'WashingMachine', 'Workshop', 'Wrench');
  CREATE TYPE "public"."enum_pages_blocks_checklist_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_pages_blocks_link_cards_cards_position" AS ENUM('top', 'bottom', 'left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_link_cards_card_style" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum_pages_blocks_link_cards_image_shape" AS ENUM('wide', 'tall');
  CREATE TYPE "public"."enum_pages_blocks_link_cards_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_pages_blocks_press_quotes_tone" AS ENUM('white', 'cream');
  CREATE TYPE "public"."enum_pages_blocks_team_grid_people_position" AS ENUM('top', 'bottom', 'left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_team_grid_tone" AS ENUM('white', 'cream');
  CREATE TABLE "pages_blocks_checklist_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_checklist_items_icon",
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_checklist" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"intro" varchar,
  	"tone" "enum_pages_blocks_checklist_tone" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_link_cards_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"position" "enum_pages_blocks_link_cards_cards_position",
  	"cta_label" varchar NOT NULL,
  	"cta_href" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_link_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"intro" varchar,
  	"card_style" "enum_pages_blocks_link_cards_card_style" DEFAULT 'dark',
  	"image_shape" "enum_pages_blocks_link_cards_image_shape" DEFAULT 'wide',
  	"tone" "enum_pages_blocks_link_cards_tone" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_press_quotes_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"publication" varchar NOT NULL,
  	"logo_id" integer
  );
  
  CREATE TABLE "pages_blocks_press_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"intro" varchar,
  	"tone" "enum_pages_blocks_press_quotes_tone" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_team_grid_people" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"photo_id" integer NOT NULL,
  	"position" "enum_pages_blocks_team_grid_people_position"
  );
  
  CREATE TABLE "pages_blocks_team_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"intro" varchar,
  	"tone" "enum_pages_blocks_team_grid_tone" DEFAULT 'white',
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_checklist_items" ADD CONSTRAINT "pages_blocks_checklist_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_checklist"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_checklist" ADD CONSTRAINT "pages_blocks_checklist_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_link_cards_cards" ADD CONSTRAINT "pages_blocks_link_cards_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_link_cards_cards" ADD CONSTRAINT "pages_blocks_link_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_link_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_link_cards" ADD CONSTRAINT "pages_blocks_link_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_press_quotes_quotes" ADD CONSTRAINT "pages_blocks_press_quotes_quotes_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_press_quotes_quotes" ADD CONSTRAINT "pages_blocks_press_quotes_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_press_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_press_quotes" ADD CONSTRAINT "pages_blocks_press_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_grid_people" ADD CONSTRAINT "pages_blocks_team_grid_people_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_grid_people" ADD CONSTRAINT "pages_blocks_team_grid_people_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_team_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_grid" ADD CONSTRAINT "pages_blocks_team_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_checklist_items_order_idx" ON "pages_blocks_checklist_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_checklist_items_parent_id_idx" ON "pages_blocks_checklist_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_checklist_order_idx" ON "pages_blocks_checklist" USING btree ("_order");
  CREATE INDEX "pages_blocks_checklist_parent_id_idx" ON "pages_blocks_checklist" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_checklist_path_idx" ON "pages_blocks_checklist" USING btree ("_path");
  CREATE INDEX "pages_blocks_link_cards_cards_order_idx" ON "pages_blocks_link_cards_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_link_cards_cards_parent_id_idx" ON "pages_blocks_link_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_link_cards_cards_image_idx" ON "pages_blocks_link_cards_cards" USING btree ("image_id");
  CREATE INDEX "pages_blocks_link_cards_order_idx" ON "pages_blocks_link_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_link_cards_parent_id_idx" ON "pages_blocks_link_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_link_cards_path_idx" ON "pages_blocks_link_cards" USING btree ("_path");
  CREATE INDEX "pages_blocks_press_quotes_quotes_order_idx" ON "pages_blocks_press_quotes_quotes" USING btree ("_order");
  CREATE INDEX "pages_blocks_press_quotes_quotes_parent_id_idx" ON "pages_blocks_press_quotes_quotes" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_press_quotes_quotes_logo_idx" ON "pages_blocks_press_quotes_quotes" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_press_quotes_order_idx" ON "pages_blocks_press_quotes" USING btree ("_order");
  CREATE INDEX "pages_blocks_press_quotes_parent_id_idx" ON "pages_blocks_press_quotes" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_press_quotes_path_idx" ON "pages_blocks_press_quotes" USING btree ("_path");
  CREATE INDEX "pages_blocks_team_grid_people_order_idx" ON "pages_blocks_team_grid_people" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_grid_people_parent_id_idx" ON "pages_blocks_team_grid_people" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_grid_people_photo_idx" ON "pages_blocks_team_grid_people" USING btree ("photo_id");
  CREATE INDEX "pages_blocks_team_grid_order_idx" ON "pages_blocks_team_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_grid_parent_id_idx" ON "pages_blocks_team_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_grid_path_idx" ON "pages_blocks_team_grid" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_checklist_items" CASCADE;
  DROP TABLE "pages_blocks_checklist" CASCADE;
  DROP TABLE "pages_blocks_link_cards_cards" CASCADE;
  DROP TABLE "pages_blocks_link_cards" CASCADE;
  DROP TABLE "pages_blocks_press_quotes_quotes" CASCADE;
  DROP TABLE "pages_blocks_press_quotes" CASCADE;
  DROP TABLE "pages_blocks_team_grid_people" CASCADE;
  DROP TABLE "pages_blocks_team_grid" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_checklist_items_icon";
  DROP TYPE "public"."enum_pages_blocks_checklist_tone";
  DROP TYPE "public"."enum_pages_blocks_link_cards_cards_position";
  DROP TYPE "public"."enum_pages_blocks_link_cards_card_style";
  DROP TYPE "public"."enum_pages_blocks_link_cards_image_shape";
  DROP TYPE "public"."enum_pages_blocks_link_cards_tone";
  DROP TYPE "public"."enum_pages_blocks_press_quotes_tone";
  DROP TYPE "public"."enum_pages_blocks_team_grid_people_position";
  DROP TYPE "public"."enum_pages_blocks_team_grid_tone";`)
}
