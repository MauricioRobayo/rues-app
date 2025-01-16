import { sql } from "drizzle-orm";
import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tokens = sqliteTable("tokens", {
  id: int().primaryKey({ autoIncrement: true }),
  token: text().notNull(),
  timestamp: int({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});
export const companies = sqliteTable(
  "companies",
  {
    id: int().primaryKey({ autoIncrement: true }),
    nit: int().unique().notNull(),
    businessName: text().notNull(),
    ruesSyncId: int().references(() => ruesSync.id),
    timestamp: int({ mode: "timestamp" }).default(sql`(unixepoch())`),
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
