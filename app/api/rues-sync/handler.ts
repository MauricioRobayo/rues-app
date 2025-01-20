import { mapCompanyRecordToCompanyModel } from "@/app/api/rues-sync/mappers/map-company-record-to-company-model";
import {
  getFileUrl,
  getTotal,
  streamData,
} from "@/app/api/rues-sync/services/rues";
import { companiesRepository } from "@/app/db/repositories/companies";

const ruesSyncTriggerDeploymentUrl =
  process.env.RUES_SYNC_TRIGGER_DEPLOYMENT_URL ?? "";

export async function handler({ debug = false }: { debug?: boolean }) {
  const syncStartDate = "1910-01-01";
  const syncEndDate = new Date().toISOString().slice(0, 10);

  const filters = {
    endDate: syncEndDate,
    startDate: syncStartDate,
  };

  const [fileUrl] = await Promise.all([getFileUrl(filters), getTotal(filters)]);

  try {
    await streamData({
      fileUrl,
      fn: async (batch) => {
        const companies = batch.map((company) =>
          mapCompanyRecordToCompanyModel(company),
        );
        await companiesRepository.upsertMany(companies);
      },
      onEnd: async () => {
        const response = await fetch(ruesSyncTriggerDeploymentUrl, {
          method: "POST",
        });
        return response.json();
      },
      debug,
    });
    console.log("RUES sync finished successfully");
  } catch (err) {
    console.error("Error while processing data", err);
  }
}
