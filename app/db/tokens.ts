import { db } from "@/app/db";
import { tokens } from "@/app/db/schema";
import { desc } from "drizzle-orm";

export const tokenRepository = {
  getLatest() {
    return db.query.tokens.findFirst({ orderBy: [desc(tokens.timestamp)] });
  },
  insert(token: string) {
    return db.insert(tokens).values({ token });
  },
};
