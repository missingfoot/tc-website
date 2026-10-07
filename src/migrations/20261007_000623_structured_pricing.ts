import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_locations_prices_per" AS ENUM('night', 'week', 'month', 'once');
  CREATE TYPE "public"."enum_locations_prices_vat" AS ENUM('included', 'excluded', 'none');
  CREATE TABLE "rooms_rates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"months" numeric NOT NULL,
  	"weekly" numeric NOT NULL
  );
  
  CREATE TABLE "pricing_rules" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"joining_fee" numeric NOT NULL,
  	"holding_deposit_weeks" numeric NOT NULL,
  	"bond_weeks_guarantor" numeric NOT NULL,
  	"bond_weeks_no_guarantor" numeric NOT NULL,
  	"bond_weeks_upfront" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "locations_prices" ADD COLUMN "per" "enum_locations_prices_per" DEFAULT 'month' NOT NULL;
  ALTER TABLE "locations_prices" ADD COLUMN "vat" "enum_locations_prices_vat" DEFAULT 'included' NOT NULL;
  ALTER TABLE "locations_prices" ADD COLUMN "note" varchar;
  ALTER TABLE "locations" ADD COLUMN "pill" varchar;

  -- Prices written as text become structured: "Per month +VAT" → per month, VAT added on top;
  -- "Per week, all bills included" → per week, small print "all bills included"
  UPDATE "locations_prices" SET
    "per" = (CASE
      WHEN "period" ILIKE '%night%' THEN 'night'
      WHEN "period" ILIKE '%week%' THEN 'week'
      WHEN "period" ILIKE '%one-off%' THEN 'once'
      ELSE 'month' END)::"enum_locations_prices_per",
    "vat" = (CASE WHEN "period" ILIKE '%+%VAT%' THEN 'excluded' ELSE 'included' END)::"enum_locations_prices_vat",
    "note" = nullif(split_part("period", ', ', 2), '');
  -- "£150" → 15000 (pence)
  ALTER TABLE "locations_prices" ALTER COLUMN "amount" SET DATA TYPE numeric USING round(regexp_replace("amount", '[^0-9.]', '', 'g')::numeric * 100);

  -- A venue's pill is its capacity, kept as its own text; the others' are worked out from their prices
  UPDATE "locations" SET "pill" = "from_price" WHERE "type" = 'venue';

  -- Each room's membership lengths ("12 months" a line) become rates, all at its weekly price
  INSERT INTO "rooms_rates" ("_order", "_parent_id", "id", "months", "weekly")
    SELECT l.ord, r."id", gen_random_uuid()::text, (regexp_match(l.line, '[0-9]+'))[1]::numeric, round(regexp_replace(r."price", '[^0-9.]', '', 'g')::numeric * 100)
    FROM "rooms" r, regexp_split_to_table(r."periods", chr(10)) WITH ORDINALITY AS l(line, ord)
    WHERE trim(l.line) <> '';
  ALTER TABLE "rooms_rates" ADD CONSTRAINT "rooms_rates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "rooms_rates_order_idx" ON "rooms_rates" USING btree ("_order");
  CREATE INDEX "rooms_rates_parent_id_idx" ON "rooms_rates" USING btree ("_parent_id");
  ALTER TABLE "locations_prices" DROP COLUMN "period";
  ALTER TABLE "locations" DROP COLUMN "from_price";
  ALTER TABLE "rooms" DROP COLUMN "price";
  ALTER TABLE "rooms" DROP COLUMN "periods";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "rooms_rates" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pricing_rules" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "rooms_rates" CASCADE;
  DROP TABLE "pricing_rules" CASCADE;
  ALTER TABLE "locations_prices" ALTER COLUMN "amount" SET DATA TYPE varchar;
  ALTER TABLE "locations_prices" ADD COLUMN "period" varchar NOT NULL;
  ALTER TABLE "locations" ADD COLUMN "from_price" varchar NOT NULL;
  ALTER TABLE "rooms" ADD COLUMN "price" varchar NOT NULL;
  ALTER TABLE "rooms" ADD COLUMN "periods" varchar NOT NULL;
  ALTER TABLE "locations_prices" DROP COLUMN "per";
  ALTER TABLE "locations_prices" DROP COLUMN "vat";
  ALTER TABLE "locations_prices" DROP COLUMN "note";
  ALTER TABLE "locations" DROP COLUMN "pill";
  DROP TYPE "public"."enum_locations_prices_per";
  DROP TYPE "public"."enum_locations_prices_vat";`)
}
