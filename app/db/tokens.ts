import { db } from "@/app/db";
import { tokens } from "@/app/db/schema";

export const tokenRepository = {
  getLast() {
    return db.query.tokens.findFirst({
      orderBy: { timestamp: "desc" },
    });
  },
  insert(token: string) {
    return db.insert(tokens).values({ token });
  },
};
