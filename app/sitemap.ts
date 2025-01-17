import { BASE_URL } from "@/app/lib/constants";
import { companiesRepository } from "@/app/repositories/companies";
import { slugifyCompanyName } from "@/app/utils/slugify-company-name";
import type { MetadataRoute } from "next";

const urlsPerSitemap = 25_000;

export async function generateSitemaps() {
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
  const start = id * urlsPerSitemap;
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
