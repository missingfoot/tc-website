import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pricing_structure_working_per" AS ENUM('night', 'week', 'month', 'once');
  CREATE TYPE "public"."enum_pricing_structure_working_vat" AS ENUM('included', 'excluded', 'none');
  CREATE TYPE "public"."enum_pricing_structure_serviced_per" AS ENUM('night', 'week', 'month', 'once');
  CREATE TYPE "public"."enum_pricing_structure_serviced_vat" AS ENUM('included', 'excluded', 'none');
  CREATE TABLE "pricing_structure_room_lengths" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"months" numeric NOT NULL
  );
  
  CREATE TABLE "pricing_structure_working" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"amount" numeric,
  	"per" "enum_pricing_structure_working_per" DEFAULT 'month' NOT NULL,
  	"vat" "enum_pricing_structure_working_vat" DEFAULT 'included' NOT NULL,
  	"note" varchar
  );
  
  CREATE TABLE "pricing_structure_serviced" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"amount" numeric,
  	"per" "enum_pricing_structure_serviced_per" DEFAULT 'month' NOT NULL,
  	"vat" "enum_pricing_structure_serviced_vat" DEFAULT 'included' NOT NULL,
  	"note" varchar
  );
  
  CREATE TABLE "pricing_structure" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "locations_prices" ALTER COLUMN "amount" DROP NOT NULL;
  ALTER TABLE "pricing_structure_room_lengths" ADD CONSTRAINT "pricing_structure_room_lengths_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pricing_structure"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pricing_structure_working" ADD CONSTRAINT "pricing_structure_working_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pricing_structure"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pricing_structure_serviced" ADD CONSTRAINT "pricing_structure_serviced_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pricing_structure"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pricing_structure_room_lengths_order_idx" ON "pricing_structure_room_lengths" USING btree ("_order");
  CREATE INDEX "pricing_structure_room_lengths_parent_id_idx" ON "pricing_structure_room_lengths" USING btree ("_parent_id");
  CREATE INDEX "pricing_structure_working_order_idx" ON "pricing_structure_working" USING btree ("_order");
  CREATE INDEX "pricing_structure_working_parent_id_idx" ON "pricing_structure_working" USING btree ("_parent_id");
  CREATE INDEX "pricing_structure_serviced_order_idx" ON "pricing_structure_serviced" USING btree ("_order");
  CREATE INDEX "pricing_structure_serviced_parent_id_idx" ON "pricing_structure_serviced" USING btree ("_parent_id");

  -- The pricing structure, from today's prices: one row for the global, room lengths from the
  -- rooms' rates, and per location type a plan per price name (in first-seen order), with a
  -- standard price where every location of the type charges the same
  INSERT INTO "pricing_structure" ("id", "updated_at", "created_at") VALUES (1, now(), now());
  SELECT setval(pg_get_serial_sequence('"pricing_structure"', 'id'), 1);
  INSERT INTO "pricing_structure_room_lengths" ("_order", "_parent_id", "id", "months")
    SELECT row_number() OVER (ORDER BY m DESC), 1, gen_random_uuid()::text, m FROM (SELECT DISTINCT "months" AS m FROM "rooms_rates") lengths;
  INSERT INTO "pricing_structure_working" ("_order", "_parent_id", "id", "label", "amount", "per", "vat", "note")
    SELECT row_number() OVER (ORDER BY ord, label), 1, gen_random_uuid()::text, label,
      CASE WHEN places = (SELECT count(*) FROM "locations" WHERE "type" = 'working') AND amounts = 1 THEN amount END,
      per::text::"enum_pricing_structure_working_per", vat::text::"enum_pricing_structure_working_vat", note
    FROM (
      SELECT p."label", min(p."_order") AS ord, count(DISTINCT p."_parent_id") AS places, count(DISTINCT p."amount") AS amounts, min(p."amount") AS amount,
        (array_agg(p."per" ORDER BY l."_order"))[1] AS per, (array_agg(p."vat" ORDER BY l."_order"))[1] AS vat, (array_agg(p."note" ORDER BY l."_order"))[1] AS note
      FROM "locations_prices" p JOIN "locations" l ON l."id" = p."_parent_id"
      WHERE l."type" = 'working'
      GROUP BY p."label"
    ) plans;
  INSERT INTO "pricing_structure_serviced" ("_order", "_parent_id", "id", "label", "amount", "per", "vat", "note")
    SELECT row_number() OVER (ORDER BY ord, label), 1, gen_random_uuid()::text, label,
      CASE WHEN places = (SELECT count(*) FROM "locations" WHERE "type" = 'serviced') AND amounts = 1 THEN amount END,
      per::text::"enum_pricing_structure_serviced_per", vat::text::"enum_pricing_structure_serviced_vat", note
    FROM (
      SELECT p."label", min(p."_order") AS ord, count(DISTINCT p."_parent_id") AS places, count(DISTINCT p."amount") AS amounts, min(p."amount") AS amount,
        (array_agg(p."per" ORDER BY l."_order"))[1] AS per, (array_agg(p."vat" ORDER BY l."_order"))[1] AS vat, (array_agg(p."note" ORDER BY l."_order"))[1] AS note
      FROM "locations_prices" p JOIN "locations" l ON l."id" = p."_parent_id"
      WHERE l."type" = 'serviced'
      GROUP BY p."label"
    ) plans;

  -- Each location's prices point at their plan, keeping only amounts that differ from its standard
  ALTER TABLE "locations_prices" ADD COLUMN "plan" varchar;
  UPDATE "locations_prices" p SET "plan" = s."id"
    FROM "locations" l, "pricing_structure_working" s
    WHERE l."id" = p."_parent_id" AND l."type" = 'working' AND s."label" = p."label";
  UPDATE "locations_prices" p SET "amount" = NULL
    FROM "pricing_structure_working" s
    WHERE p."plan" = s."id" AND s."amount" IS NOT NULL AND p."amount" = s."amount";
  UPDATE "locations_prices" p SET "plan" = s."id"
    FROM "locations" l, "pricing_structure_serviced" s
    WHERE l."id" = p."_parent_id" AND l."type" = 'serviced' AND s."label" = p."label";
  UPDATE "locations_prices" p SET "amount" = NULL
    FROM "pricing_structure_serviced" s
    WHERE p."plan" = s."id" AND s."amount" IS NOT NULL AND p."amount" = s."amount";
  DELETE FROM "locations_prices" WHERE "plan" IS NULL;
  ALTER TABLE "locations_prices" ALTER COLUMN "plan" SET NOT NULL;

  ALTER TABLE "locations_prices" DROP COLUMN "label";
  ALTER TABLE "locations_prices" DROP COLUMN "per";
  ALTER TABLE "locations_prices" DROP COLUMN "vat";
  ALTER TABLE "locations_prices" DROP COLUMN "note";
  DROP TYPE "public"."enum_locations_prices_per";
  DROP TYPE "public"."enum_locations_prices_vat";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_locations_prices_per" AS ENUM('night', 'week', 'month', 'once');
  CREATE TYPE "public"."enum_locations_prices_vat" AS ENUM('included', 'excluded', 'none');
  ALTER TABLE "pricing_structure_room_lengths" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pricing_structure_working" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pricing_structure_serviced" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pricing_structure" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pricing_structure_room_lengths" CASCADE;
  DROP TABLE "pricing_structure_working" CASCADE;
  DROP TABLE "pricing_structure_serviced" CASCADE;
  DROP TABLE "pricing_structure" CASCADE;
  ALTER TABLE "locations_prices" ALTER COLUMN "amount" SET NOT NULL;
  ALTER TABLE "locations_prices" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "locations_prices" ADD COLUMN "per" "enum_locations_prices_per" DEFAULT 'month' NOT NULL;
  ALTER TABLE "locations_prices" ADD COLUMN "vat" "enum_locations_prices_vat" DEFAULT 'included' NOT NULL;
  ALTER TABLE "locations_prices" ADD COLUMN "note" varchar;
  ALTER TABLE "locations_prices" DROP COLUMN "plan";
  DROP TYPE "public"."enum_pricing_structure_working_per";
  DROP TYPE "public"."enum_pricing_structure_working_vat";
  DROP TYPE "public"."enum_pricing_structure_serviced_per";
  DROP TYPE "public"."enum_pricing_structure_serviced_vat";`)
}
