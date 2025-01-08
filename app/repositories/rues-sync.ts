import { db } from "@/app/db";
import { ruesSync } from "@/app/db/schema";
import { desc, eq } from "drizzle-orm";

export const ruesSyncRepository = {
  getLatest() {
    return db.query.ruesSync.findFirst({
      where: (record, { eq }) => eq(record.status, "success"),
      orderBy: [desc(ruesSync.syncEndDate)],
      columns: {
        syncEndDate: true,
      },
    });
  },
  async insert(data: typeof ruesSync.$inferInsert) {
    const insertedIds = await db
      .insert(ruesSync)
      .values(data)
      .returning({ insertedId: ruesSync.id });
    return insertedIds.at(0)?.insertedId;
  },
  async update(id: number, data: Partial<typeof ruesSync.$inferInsert>) {
    await db.update(ruesSync).set(data).where(eq(ruesSync.id, id));
  },
};
