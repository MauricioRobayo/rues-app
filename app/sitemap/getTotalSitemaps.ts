import { companiesRepository } from "@/app/repositories/companies";
import { MAX_URLS_PER_SITEMAP } from "@/app/shared/lib/constants";

export const getTotalSitemaps = async () => {
  const total = await companiesRepository.count();
  if (!total) {
    return 0;
  }
  return Math.ceil(total / MAX_URLS_PER_SITEMAP);
};
