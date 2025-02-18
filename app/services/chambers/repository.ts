import { db } from "@/app/db";
import { chambers } from "@/app/db/schema";
import { eq, getTableColumns } from "drizzle-orm";

export const chambersRepository = {
  findChamberByCode(
    code: string,
    columns?: (keyof typeof chambers.$inferSelect)[],
  ) {
    return db.query.chambers.findFirst({
      where: eq(chambers.code, code),
      columns: columns
        ? Object.fromEntries(columns.map((column) => [column, true]))
        : undefined,
    });
  },
  updateByCode(code: string, data: Partial<typeof chambers.$inferInsert>) {
    return db.update(chambers).set(data).where(eq(chambers.code, code));
  },
  update(id: number, data: Partial<typeof chambers.$inferInsert>) {
    return db.update(chambers).set(data).where(eq(chambers.id, id));
  },
  getAll<T extends (keyof typeof chambers.$inferSelect)[]>(fields?: T) {
    const allColumns = getTableColumns(chambers);
    const columns = fields
      ? Object.fromEntries(
          Object.entries(allColumns).filter((entry) =>
            fields.includes(entry[0] as keyof typeof chambers.$inferSelect),
          ),
        )
      : allColumns;
    return db.select(columns).from(chambers) as Promise<
      { [K in T[number]]: (typeof chambers.$inferSelect)[K] }[]
    >;
  },
};
