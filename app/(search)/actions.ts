"use server";

import { Action } from "@/app/lib/getRecapchaToken";
import { verifyRecaptcha } from "@/app/lib/verifyRecaptcha";
import { mapConsolidatedCompanyToCompanyDto } from "@/app/mappers/mapConsolidatedCompanyToCompanyDto";
import { advancedSearch } from "@/app/services/rues/service";
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
      action: Action.SEARCH,
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
