import { db } from "@/app/db";
import { companies } from "@/app/db/schema";

export const companiesRepository = {
  async insertMany(data: (typeof companies.$inferInsert)[]) {
    await db.insert(companies).values(data).onConflictDoNothing();
  },
};
