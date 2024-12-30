import { relations, sql } from "drizzle-orm";
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
  documentType: text().notNull(),
  businessName: text().notNull(),
  category: text().notNull(),
  legalEntity: text().notNull(),
  registrationDate: int({ mode: "timestamp" }).notNull(),
  businessAddress: text().notNull(),
  companySize: int().notNull(),
  economicActivity1: text().notNull(),
  registrationId: int(),
  economicActivity2: text(),
  economicActivity3: text(),
  economicActivity4: text(),
  chamberCode: int().references(() => chambers.code),
  registrationNumber: int(),
  legalOrganization: text(),
  lastRenewedYear: int(),
  isActive: int({ mode: "boolean" }),
  city: text(),
  state: text(),
});
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
  total: int().notNull(),
  inserted: int().notNull(),
  timestamp: int({ mode: "timestamp" }).notNull(),
  initialDate: int({ mode: "timestamp" }).notNull(),
  finalDate: int({ mode: "timestamp" }).notNull(),
});
