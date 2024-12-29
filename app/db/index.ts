import dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });

import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

import { tokens, companies, chambers } from "@/app/db/schema";

const client = createClient({ url: process.env.DB_FILE_NAME! });
export const db = drizzle({
  client,
  schema: { tokens, companies, chamber: chambers },
  casing: "camelCase",
});
