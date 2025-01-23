import { db } from "@/app/db";
import { chambers } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export const chambersRepository = {
  findByCode(code: number) {
    return db.query.chambers.findFirst({
      where: eq(chambers.code, code),
      columns: {
        name: true,
        address: true,
        city: true,
        state: true,
      },
    });
  },
};
