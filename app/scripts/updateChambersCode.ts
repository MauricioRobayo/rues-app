import { chambersRepository } from "@/app/services/chambers/repository";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  const chambers = await chambersRepository.getAll(["id", "code"]);
  for (const { id, code } of chambers) {
    await chambersRepository.update(id, {
      code: String(code).padStart(2, "0"),
    });
  }
}

main();
