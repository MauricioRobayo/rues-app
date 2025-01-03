import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

import { tokens, companies, chambers } from "@/app/db/schema";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
export const db = drizzle({
  client,
  schema: { tokens, companies, chamber: chambers },
  casing: "camelCase",
});
