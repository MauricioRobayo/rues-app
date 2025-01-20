import { db } from "@/app/db";
import { companies } from "@/app/db/schema";
import { asc, count, eq, sql } from "drizzle-orm";

export const companiesRepository = {
  upsertMany(data: (typeof companies.$inferInsert)[]) {
    const excludedName = sql.raw(`excluded.${companies.name.name}`);
    const excludedAddress = sql.raw(`excluded.${companies.address.name}`);
    const excludedSize = sql.raw(`excluded.${companies.size.name}`);
    const excludedCity = sql.raw(`excluded.${companies.city.name}`);
    const excludedState = sql.raw(`excluded.${companies.state.name}`);
    return db
      .insert(companies)
      .values(data)
      .onConflictDoUpdate({
        target: companies.nit,
        set: {
          name: excludedName,
          address: excludedAddress,
          size: excludedSize,
          city: excludedCity,
          state: excludedState,
          timestamp: sql`unixepoch()`,
        },
        setWhere: sql`${companies.name} != ${excludedName}`,
      });
  },
  upsert(data: typeof companies.$inferInsert) {
    return this.upsertMany([data]);
  },
  getCompanyInfo(nit: number) {
    return db.query.companies.findFirst({
      where: eq(companies.nit, nit),
      columns: {
        state: true,
        city: true,
        address: true,
        size: true,
      },
    });
  },
  findFirst(
    columns?: Partial<Record<keyof typeof companies.$inferSelect, true>>,
  ) {
    return db.query.companies.findFirst({
      orderBy: [asc(companies.id)],
      columns,
    });
  },
  async count() {
    const total = await db.select({ count: count() }).from(companies);
    return total.at(0)?.count;
  },
  getCompanies({ limit, offset }: { limit: number; offset: number }) {
    return db
      .select({
        nit: companies.nit,
        name: companies.name,
        timestamp: companies.timestamp,
      })
      .from(companies)
      .limit(limit)
      .offset(offset);
  },
};
