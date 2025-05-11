import { MAX_URLS_PER_SITEMAP } from "@/app/lib/constants";
import {
  isActiveCompany,
  isComercialCompany,
  isLegalEntity,
  isValidId,
  isValidName,
  isValidNit,
} from "@/app/services/openData/repository";
import { openDataService } from "@/app/services/openData/service";
import { unstable_cache } from "next/cache";

export const sitemapInclusionCriteria = [
  isComercialCompany,
  isActiveCompany,
  isLegalEntity,
  isValidId,
  isValidName,
  isValidNit,
];

export const getTotalSitemaps = unstable_cache(
  async () => {
    const total = await openDataService.companyRecords.count({
      where: sitemapInclusionCriteria,
    });
    if (!total) {
      return 0;
    }
    return Math.ceil(total / MAX_URLS_PER_SITEMAP);
  },
  undefined,
  { revalidate: false },
);
