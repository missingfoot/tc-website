import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_variables_entries_kind" AS ENUM('money', 'text');
  CREATE TABLE "variables_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"kind" "enum_variables_entries_kind" DEFAULT 'money',
  	"amount" numeric,
  	"text" varchar,
  	"about" varchar
  );
  
  CREATE TABLE "variables" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "variables_entries" ADD CONSTRAINT "variables_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."variables"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "variables_entries_order_idx" ON "variables_entries" USING btree ("_order");
  CREATE INDEX "variables_entries_parent_id_idx" ON "variables_entries" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "variables_entries" CASCADE;
  DROP TABLE "variables" CASCADE;
  DROP TYPE "public"."enum_variables_entries_kind";`)
}
