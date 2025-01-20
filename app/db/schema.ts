import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tokens = sqliteTable("tokens", {
  id: int().primaryKey({ autoIncrement: true }),
  token: text().notNull(),
  timestamp: int({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});
export const companies = sqliteTable("companies", {
  id: int().primaryKey({ autoIncrement: true }),
  nit: int().unique().notNull(),
  name: text().notNull(),
  size: text(),
  state: text(),
  city: text(),
  address: text(),
  timestamp: int({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});
export const chambers = sqliteTable("chambers", {
  id: int().primaryKey({ autoIncrement: true }),
  code: int().unique().notNull(),
  name: text().notNull(),
  city: text().notNull(),
  address: text().notNull(),
  state: text().notNull(),
});
