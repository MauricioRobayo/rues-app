import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { defineConfig } from "drizzle-kit";
export default defineConfig({
  out: "./drizzle",
  schema: "./app/db/schema.ts",
  casing: "camelCase",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DB_FILE_NAME!,
  },
});
