import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "rooms" ALTER COLUMN "move_in" DROP NOT NULL;
  ALTER TABLE "rooms" ALTER COLUMN "floor" DROP NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "rooms" ALTER COLUMN "move_in" SET NOT NULL;
  ALTER TABLE "rooms" ALTER COLUMN "floor" SET NOT NULL;`)
}
