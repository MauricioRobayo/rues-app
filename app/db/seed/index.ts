import { seedChambers } from "@/app/db/seed/chambers";
import { seedCompanies } from "@/app/db/seed/companies";

async function main() {
  await Promise.all([seedChambers(), seedCompanies()]);
  console.log("done!");
}
main();
