"use server";

import { RECAPTCHA_SEARCH_ACTION } from "@/app/shared/lib/constants";
import { verifyRecaptcha } from "@/app/shared/lib/verifyRecaptcha";
import { getSearchResultsByCompanyName } from "@/app/shared/services/rues/api";
import { unstable_cache } from "next/cache";

export async function searchByCompanyName({
  companyName,
  token: recaptchaToken,
}: {
  companyName: string;
  token: string;
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

  return getSearchResultsByCompanyNameCached(companyName);
}

const getSearchResultsByCompanyNameCached = unstable_cache(
  getSearchResultsByCompanyName,
  undefined,
  {
    revalidate: 2 * 24 * 60 * 60,
  },
);
