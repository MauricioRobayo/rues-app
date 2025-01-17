import type { MetadataRoute } from "next";
import { companiesRepository } from "@/app/repositories/companies";
import { slugifyCompanyName } from "@/app/utils/slugify-company-name";
import { ruesSyncRepository } from "@/app/repositories/rues-sync";
import { mapCompanyRecordToCompanyModel } from "@/app/rues/mappers";
import { getFileUrl, getTotal, streamData } from "@/app/rues/panel";
import { BASE_URL } from "@/app/lib/constants";

const urlsPerSitemap = 50_000;

export async function generateSitemaps() {
  await sync({ debug: true });

  const total = await companiesRepository.count();
  if (!total) return;

  const totalSitemaps = Math.ceil(total / urlsPerSitemap);
  return Array.from({ length: totalSitemaps }, (_, i) => ({
    id: i,
  }));
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const start = id * 50000;
  const companies = await companiesRepository.getCompanies({
    offset: start,
    limit: urlsPerSitemap,
  });
  return companies.map((company) => {
    const companySlug = slugifyCompanyName(company.name);
    const url = `${BASE_URL}/${companySlug}-${company.nit}`;
    return {
      url,
      lastModified: company.timestamp?.toISOString(),
    };
  });
}

async function sync({ debug = false }: { debug?: boolean }) {
  const syncId = await ruesSyncRepository.insert({
    startedAtMs: new Date(),
    status: "started",
  });
  if (!syncId) {
    throw new Error("Failed to create sync");
  }
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
        await companiesRepository.upsertMany(companies);
      },
      debug,
    });
    await ruesSyncRepository.update(syncId, {
      ...ruesSyncData,
      endedAtMs: new Date(),
      status: "success",
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
