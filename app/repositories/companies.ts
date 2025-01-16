import { db } from "@/app/db";
import { companies } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export const companiesRepository = {
  insertMany(data: (typeof companies.$inferInsert)[]) {
    return db.insert(companies).values(data).onConflictDoNothing();
  },
  findByNit(nit: number) {
    return db.query.companies.findFirst({
      where: eq(companies.nit, nit),
      columns: { nit: true, businessName: true },
    });
  },
  updateByNit(nit: number, data: Partial<typeof companies.$inferInsert>) {
    return db.update(companies).set(data).where(eq(companies.nit, nit));
  },
};
