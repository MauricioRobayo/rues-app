import { db } from "@/app/db";
import { companies } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export const companiesRepository = {
  insertMany(data: (typeof companies.$inferInsert)[]) {
    return db.insert(companies).values(data).onConflictDoNothing();
  },
  findBySyncId(syncId: number) {
    return db.query.companies.findMany({
      where: eq(companies.ruesSyncId, syncId),
    });
  },
};
