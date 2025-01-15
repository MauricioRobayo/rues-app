import { db } from "@/app/db";
import { companies } from "@/app/db/schema";
import { eq, count } from "drizzle-orm";

export const companiesRepository = {
  insertMany(data: (typeof companies.$inferInsert)[]) {
    return db.insert(companies).values(data).onConflictDoNothing();
  },
  async getTotalRecordsBySyncId(syncId: number) {
    const total = await db
      .select({ count: count() })
      .from(companies)
      .where(eq(companies.ruesSyncId, syncId));
    return total.at(0)?.count ?? 0;
  },
  findByNit(nit: number) {
    return db.query.companies.findFirst({
      where: eq(companies.nit, nit),
      columns: { nit: true, businessName: true },
    });
  },
  updateBusinessNameByNit(nit: number, businessName: string) {
    return db
      .update(companies)
      .set({ businessName })
      .where(eq(companies.nit, nit));
  },
};
