import { companiesRepository } from "@/app/db/tokens copy";
import { mapCompanyRecordToCompanyModel } from "@/app/rues/mappers";
import { getData, getFileUrl, getTotal } from "@/app/rues/panel";
import { ruesSyncRepository } from "../db/rues-sync";

const syncToken = process.env.RUES_SYNC_TOKEN;

if (!syncToken) {
  throw new Error("RUES_SYNC_TOKEN is required");
}

export async function POST(request: Request) {
  const token = request.headers.get("Authorization")?.split("Bearer ")[1];
  if (token !== syncToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const startedAtMs = new Date();
  const latestRuesSync = await ruesSyncRepository.getLatest();
  const previousSyncEndDate = new Date(
    latestRuesSync?.syncEndDate ?? "1910-01-01"
  );
  const syncStartDate = new Date(
    previousSyncEndDate.setUTCDate(previousSyncEndDate.getUTCDate() - 1)
  )
    .toISOString()
    .slice(0, 10);
  const syncEndDate = new Date().toISOString().slice(0, 10);
  if (syncStartDate >= syncEndDate) {
    return Response.json(
      { message: "startDate is not before endDate" },
      {
        status: 500,
      }
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
  const ruesSyncId = await ruesSyncRepository.insert({
    startedAtMs,
    syncStartDate,
    syncEndDate,
    totalRecords,
    status: "started",
    syncFileUrl: fileUrl,
  });

  if (!ruesSyncId) {
    return Response.json(
      {
        message: "Could not generate rues_sync init record.",
      },
      {
        status: 500,
      }
    );
  }

  console.log("RUES sync started successfully:", ruesSyncId);

  try {
    const recordsInserted = await getData({
      fileUrl,
      fn: async (batch) => {
        const companies = batch.map((company) => ({
          ...mapCompanyRecordToCompanyModel(company),
          ruesSyncId,
        }));
        await companiesRepository.insertMany(companies);
      },
    });
    await ruesSyncRepository.update(ruesSyncId, {
      endedAtMs: new Date(),
      recordsInserted,
      status: "success",
    });
    console.log("RUES sync finished successfully:", ruesSyncId);
  } catch (err) {
    console.error("Error while processing data", err);
    await ruesSyncRepository.update(ruesSyncId, {
      endedAtMs: new Date(),
      status: "error",
      errorMessage: JSON.stringify(err),
    });
  }

  return Response.json({ message: "Alright." });
}
