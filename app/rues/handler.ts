import { companiesRepository } from "@/app/repositories/companies";
import { ruesSyncRepository } from "@/app/repositories/rues-sync";
import { mapCompanyRecordToCompanyModel } from "@/app/rues/mappers";
import { getFileUrl, getTotal, streamData } from "@/app/rues/panel";

export async function handler({
  debug = false,
  syncId,
}: {
  debug?: boolean;
  syncId: number;
}) {
  const latestRuesSync = await ruesSyncRepository.getLatest();
  const syncStartDate = latestRuesSync?.syncEndDate ?? "1910-01-01";
  const syncEndDate = new Date().toISOString().slice(0, 10);
  if (syncStartDate >= syncEndDate) {
    return Response.json(
      { message: "startDate is not before endDate" },
      {
        status: 500,
      },
    );
  }
  const filters = {
    endDate: syncEndDate,
    startDate: syncStartDate,
  };

  const [fileUrl, totalRecords] = await Promise.all([
    getFileUrl(filters),
    getTotal(filters),
  ]);

  const ruesSyncData = {
    syncStartDate,
    syncEndDate,
    totalRecords,
    syncFileUrl: fileUrl,
  };

  try {
    await streamData({
      fileUrl,
      fn: async (batch) => {
        const companies = batch.map((company) => ({
          ...mapCompanyRecordToCompanyModel(company),
          ruesSyncId: syncId,
        }));
        await companiesRepository.insertMany(companies);
      },
      debug,
    });
    const totalRecordsInserted =
      await companiesRepository.getTotalRecordsBySyncId(syncId);
    await ruesSyncRepository.update(syncId, {
      ...ruesSyncData,
      endedAtMs: new Date(),
      status: "success",
      totalRecordsInserted,
    });
    console.log("RUES sync finished successfully:", syncId);
  } catch (err) {
    console.error("Error while processing data", err);
    await ruesSyncRepository.update(syncId, {
      ...ruesSyncData,
      endedAtMs: new Date(),
      status: "error",
      errorMessage: JSON.stringify(err),
    });
  }
}
