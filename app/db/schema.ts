import { sql } from "drizzle-orm";
import { int, sqliteTable, text, index } from "drizzle-orm/sqlite-core";

export const companies = sqliteTable(
  "companies",
  {
    id: int().primaryKey({ autoIncrement: true }),
    nit: int().unique().notNull(),
    name: text().notNull(),
    size: text(),
    state: text(),
    city: text(),
    address: text(),
    ruesSyncId: int().references(() => ruesSync.id),
    timestamp: int({ mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => {
    return [index("rues_sync_idx").on(table.ruesSyncId)];
  },
);
export const chambers = sqliteTable("chambers", {
  id: int().primaryKey({ autoIncrement: true }),
  code: int().unique().notNull(),
  name: text().notNull(),
  city: text().notNull(),
  address: text().notNull(),
  state: text().notNull(),
});
export const ruesSync = sqliteTable("rues_sync", {
  id: int().primaryKey({ autoIncrement: true }),
  startedAtMs: int({ mode: "timestamp_ms" }).notNull(),
  status: text({ enum: ["success", "error", "started"] }).notNull(),
  endedAtMs: int({ mode: "timestamp_ms" }),
  syncStartDate: text({ length: 10 }),
  syncEndDate: text({ length: 10 }),
  totalRecords: int(),
  syncFileUrl: text(),
  errorMessage: text(),
});
