import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_navigation_desktop_opens" AS ENUM('link', 'dropdown', 'menu');
  CREATE TABLE "navigation_menu_items_sub_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"show" boolean DEFAULT true
  );
  
  CREATE TABLE "navigation_menu_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar,
  	"show" boolean DEFAULT true
  );
  
  CREATE TABLE "navigation_menu" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar
  );
  
  CREATE TABLE "navigation_desktop_sub_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"show" boolean DEFAULT true
  );
  
  CREATE TABLE "navigation_desktop" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"opens" "enum_navigation_desktop_opens" DEFAULT 'link',
  	"href" varchar,
  	"show" boolean DEFAULT true
  );
  
  CREATE TABLE "navigation_footer_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"show" boolean DEFAULT true
  );
  
  CREATE TABLE "navigation_footer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"show" boolean DEFAULT true
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "navigation_menu_items_sub_links" ADD CONSTRAINT "navigation_menu_items_sub_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_menu_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_menu_items" ADD CONSTRAINT "navigation_menu_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_menu" ADD CONSTRAINT "navigation_menu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_desktop_sub_links" ADD CONSTRAINT "navigation_desktop_sub_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_desktop"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_desktop" ADD CONSTRAINT "navigation_desktop_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_links" ADD CONSTRAINT "navigation_footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer" ADD CONSTRAINT "navigation_footer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "navigation_menu_items_sub_links_order_idx" ON "navigation_menu_items_sub_links" USING btree ("_order");
  CREATE INDEX "navigation_menu_items_sub_links_parent_id_idx" ON "navigation_menu_items_sub_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_menu_items_order_idx" ON "navigation_menu_items" USING btree ("_order");
  CREATE INDEX "navigation_menu_items_parent_id_idx" ON "navigation_menu_items" USING btree ("_parent_id");
  CREATE INDEX "navigation_menu_order_idx" ON "navigation_menu" USING btree ("_order");
  CREATE INDEX "navigation_menu_parent_id_idx" ON "navigation_menu" USING btree ("_parent_id");
  CREATE INDEX "navigation_desktop_sub_links_order_idx" ON "navigation_desktop_sub_links" USING btree ("_order");
  CREATE INDEX "navigation_desktop_sub_links_parent_id_idx" ON "navigation_desktop_sub_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_desktop_order_idx" ON "navigation_desktop" USING btree ("_order");
  CREATE INDEX "navigation_desktop_parent_id_idx" ON "navigation_desktop" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_links_order_idx" ON "navigation_footer_links" USING btree ("_order");
  CREATE INDEX "navigation_footer_links_parent_id_idx" ON "navigation_footer_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_order_idx" ON "navigation_footer" USING btree ("_order");
  CREATE INDEX "navigation_footer_parent_id_idx" ON "navigation_footer" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "navigation_menu_items_sub_links" CASCADE;
  DROP TABLE "navigation_menu_items" CASCADE;
  DROP TABLE "navigation_menu" CASCADE;
  DROP TABLE "navigation_desktop_sub_links" CASCADE;
  DROP TABLE "navigation_desktop" CASCADE;
  DROP TABLE "navigation_footer_links" CASCADE;
  DROP TABLE "navigation_footer" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TYPE "public"."enum_navigation_desktop_opens";`)
}
