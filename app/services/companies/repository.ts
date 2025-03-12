import { db } from "@/app/db";
import { companies } from "@/app/db/schema";
import { asc, count, eq, getTableColumns, sql } from "drizzle-orm";

export const companiesRepository = {
  deleteByNit(nit: number) {
    return db.delete(companies).where(eq(companies.nit, nit));
  },
  upsertName(data: { nit: number; name: string }) {
    return db
      .insert(companies)
      .values(data)
      .onConflictDoUpdate({
        target: companies.nit,
        set: {
          name: sql`${data.name}`,
          timestamp: sql`unixepoch()`,
        },
        setWhere: sql`${companies.name} != ${data.name}`,
      });
  },
  upsertMany(data: (typeof companies.$inferInsert)[]) {
    return db
      .insert(companies)
      .values(data)
      .onConflictDoUpdate({
        target: companies.nit,
        set: {
          name: sql.raw(`excluded.${companies.name.name}`),
          address: sql.raw(`excluded.${companies.address.name}`),
          size: sql.raw(`excluded.${companies.size.name}`),
          city: sql.raw(`excluded.${companies.city.name}`),
          state: sql.raw(`excluded.${companies.state.name}`),
          timestamp: sql`unixepoch()`,
        },
      });
  },
  getCompanyInfo(nit: number) {
    return db.query.companies.findFirst({
      where: eq(companies.nit, nit),
      columns: {
        name: true,
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
  getAll<T extends (keyof typeof companies.$inferSelect)[]>({
    limit,
    offset,
    fields,
  }: {
    limit: number;
    offset: number;
    fields?: T;
  }) {
    const allColumns = getTableColumns(companies);
    const columns = fields
      ? Object.fromEntries(
          Object.entries(allColumns).filter((entry) =>
            fields.includes(entry[0] as keyof typeof companies.$inferSelect),
          ),
        )
      : allColumns;
    return db
      .select(columns)
      .from(companies)
      .limit(limit)
      .offset(offset) as Promise<
      {
        [K in T[number]]: (typeof companies.$inferSelect)[K];
      }[]
    >;
  },
};
