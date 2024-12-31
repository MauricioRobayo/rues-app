import {
  getData,
  getFileUrl,
  getTotal,
  type CompanyRecord,
  type Filters,
} from "@/app/rues/panel";
import { companies } from "../schema";
import { db } from "..";

async function main() {
  const filters: Filters = {
    startDate: "2021-01-20",
    endDate: "2021-01-31",
    companySize: ["04"],
  };
  const [fileUrl, total] = await Promise.all([
    getFileUrl(filters),
    getTotal(filters),
  ]);
  console.log("Total", total);
  getData({
    fileUrl,
    fn: async (batch) => {
      console.log("Batch", batch);
    },
    // fn: async (batch) => {
    //   const batchToInsert = batch.map(mapCompanyRecordToCompanyModel);
    //   await db.insert(companies).values(batchToInsert).onConflictDoNothing();
    // },
  });
}
main();
