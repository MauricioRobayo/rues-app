import { db } from "@/app/db";
import { companies } from "@/app/db/schema";
import { eq, sql } from "drizzle-orm";

export const companiesRepository = {
  upsertMany(data: (typeof companies.$inferInsert)[]) {
    const excludedName = sql.raw(`excluded.${companies.name.name}`);
    return db
      .insert(companies)
      .values(data)
      .onConflictDoUpdate({
        target: companies.nit,
        set: {
          name: excludedName,
        },
        setWhere: sql`${companies.name} != ${excludedName}`,
      });
  },
  upsert(data: typeof companies.$inferInsert) {
    return this.upsertMany([data]);
  },
  findByNit(nit: number) {
    return db.query.companies.findFirst({
      where: eq(companies.nit, nit),
      columns: { nit: true, name: true },
    });
  },
};
