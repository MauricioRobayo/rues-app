"use server";

import { getToken } from "@/app/[company]/services/rues";
import {
  RECAPTCHA_SEARCH_ACTION,
  VALID_RUES_CATEGORIES,
} from "@/app/shared/lib/constants";
import { isValidNit } from "@/app/shared/lib/isValidNit";
import { verifyRecaptcha } from "@/app/shared/lib/verifyRecaptcha";
import { mapRuesResultToCompanySummary } from "@/app/shared/mappers/mapRuesResultToCompany";
import { RUES } from "@mauriciorobayo/rues-api";
import { unstable_cache } from "next/cache";

const rues = new RUES();

export async function search({
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

  return getSearchResultsByCompanyName(companyName);
}

const getSearchResultsByCompanyName = unstable_cache(
  async (companyName: string) => {
    const token = await getToken();
    const response = await rues.advancedSearch({
      query: { razon: companyName },
      token,
    });
    if (response.status === "error") {
      return null;
    }
    return (response.data.registros ?? [])
      .filter(
        (record) =>
          isValidNit(Number(record.nit)) &&
          VALID_RUES_CATEGORIES.includes(record.categoria) &&
          !!record.id_rm,
      )
      .map(mapRuesResultToCompanySummary);
  },
  undefined,
  {
    revalidate: 2 * 24 * 60 * 60,
  },
);
