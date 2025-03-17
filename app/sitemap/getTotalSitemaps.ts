import { MAX_URLS_PER_SITEMAP } from "@/app/lib/constants";
import { openDataService } from "@/app/services/openData/service";
import { unstable_cache } from "next/cache";

export const getTotalSitemaps = unstable_cache(
  async () => {
    const total = await openDataService.companyRecords.count();
    if (!total) {
      return 0;
    }
    return Math.ceil(total / MAX_URLS_PER_SITEMAP);
  },
  undefined,
  { revalidate: false },
);
