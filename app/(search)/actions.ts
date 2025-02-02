"use server";

import { RECAPTCHA_SEARCH_ACTION } from "@/app/shared/lib/constants";
import { verifyRecaptcha } from "@/app/shared/lib/verifyRecaptcha";
import { mapConsolidatedCompanyToCompanyDto } from "@/app/shared/mappers/mapConsolidatedCompanyToCompanyDto";
import { advancedSearch } from "@/app/shared/services/rues/api";
import { unstable_cache } from "next/cache";

export async function searchByCompanyName({
  companyName,
  recaptchaToken,
}: {
  companyName: string;
  recaptchaToken: string;
}) {
  if (!companyName) {
    return null;
  }
  if (
    !(await verifyRecaptcha({
      token: recaptchaToken,
      action: RECAPTCHA_SEARCH_ACTION,
    }))
  ) {
    return null;
  }

  const response = await getSearchResultsByCompanyNameCached({
    search: { name: companyName },
  });
  return (response?.data ?? []).map((hit) =>
    mapConsolidatedCompanyToCompanyDto({ rues: hit }),
  );
}

const getSearchResultsByCompanyNameCached = unstable_cache(
  advancedSearch,
  undefined,
  {
    revalidate: 7 * 24 * 60 * 60,
  },
);
