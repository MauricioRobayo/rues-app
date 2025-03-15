"use server";

import { Action } from "@/app/lib/getRecapchaToken";
import { verifyRecaptcha } from "@/app/lib/verifyRecaptcha";
import { openDataService } from "@/app/services/openData/service";
import { unstable_cache } from "next/cache";

export async function searchByCompanyNameAction({
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

  return getSearchResultsByCompanyNameCached(companyName);
}

const getSearchResultsByCompanyNameCached = unstable_cache(
  openDataService.companies.search,
  undefined,
  {
    revalidate: false,
  },
);
