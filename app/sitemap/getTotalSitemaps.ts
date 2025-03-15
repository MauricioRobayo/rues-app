import { MAX_URLS_PER_SITEMAP } from "@/app/lib/constants";
import { openDataService } from "@/app/services/openData/service";

export const getTotalSitemaps = async () => {
  const total = await openDataService.companies.count();
  if (!total) {
    return 0;
  }
  return Math.ceil(total / MAX_URLS_PER_SITEMAP);
};
