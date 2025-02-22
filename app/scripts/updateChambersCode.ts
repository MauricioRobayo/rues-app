/*
  This script was used to get more chambers info from different sources,
  but it was used when the chambers where a table in the db.
  There is no longer a chambers table in the db as it has been moved to a json file.
*/

// import { chambersRepository } from "@/app/services/chambers/repository";
// import dotenv from "dotenv";

// dotenv.config({ path: ".env.local" });

// async function main() {
//   const chambers = await chambersRepository.getAll(["id", "code"]);
//   for (const { id, code } of chambers) {
//     await chambersRepository.update(id, {
//       code: String(code).padStart(2, "0"),
//     });
//   }
// }

// main();
