import { BASE_URL, MAX_URLS_PER_SITEMAP } from "@/app/lib/constants";
import { companiesRepository } from "@/app/repositories/companies";
import { slugifyCompanyName } from "@/app/utils/slugify-company-name";
import type { MetadataRoute } from "next";

export async function generateSitemaps() {
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
  const companies = await companiesRepository.getCompanies({
    offset: id * MAX_URLS_PER_SITEMAP,
    limit: MAX_URLS_PER_SITEMAP,
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
