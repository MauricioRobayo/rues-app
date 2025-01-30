import { companiesRepository } from "@/app/repositories/companies";
import { MAX_URLS_PER_SITEMAP } from "@/app/shared/lib/constants";
import { unstable_cache } from "next/cache";

export const getTotalSitemaps = unstable_cache(
  async () => {
    const total = await companiesRepository.count();
    if (!total) {
      return 0;
    }
    return Math.ceil(total / MAX_URLS_PER_SITEMAP);
  },
  undefined,
  {
    revalidate: 7 * 24 * 60 * 60,
  },
);
