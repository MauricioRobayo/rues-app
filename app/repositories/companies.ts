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
};
