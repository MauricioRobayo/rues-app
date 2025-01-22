import { BASE_URL, MAX_URLS_PER_SITEMAP } from "@/app/shared/lib/constants";
import pRetry from "p-retry";
import { companiesRepository } from "@/app/repositories/companies";
import { slugifyCompanyName } from "@/app/shared/lib/slugifyComponentName";
import type { MetadataRoute } from "next";

const isVercelProductionDeployment = process.env.VERCEL_ENV === "production";

export async function generateSitemaps() {
  if (!isVercelProductionDeployment) {
    return [{ id: 0 }];
  }
  const total = await companiesRepository.count();
  if (!total) {
    return [];
  }
  const totalSitemaps = Math.ceil(total / MAX_URLS_PER_SITEMAP);
  return Array.from({ length: totalSitemaps }, (_, i) => ({
    id: i,
  }));
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const companies = await pRetry(
    () =>
      companiesRepository.getAll({
        offset: id * MAX_URLS_PER_SITEMAP,
        limit: isVercelProductionDeployment ? MAX_URLS_PER_SITEMAP : 5,
      }),
    { retries: 5 },
  );
  return companies.map((company) => {
    const companySlug = slugifyCompanyName(company.name);
    const url = `${BASE_URL}/${companySlug}-${company.nit}`;
    return {
      url,
      lastModified: company.timestamp?.toISOString(),
    };
  });
}
