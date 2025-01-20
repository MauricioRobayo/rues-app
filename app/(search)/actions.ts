"use server";

import { getToken } from "@/app/[company]/services/rues";
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
  if (!(await verifyRecaptcha({ token: recaptchaToken, action: "SEARCH" }))) {
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
      .filter((record) => isValidNit(Number(record.nit)))
      .map(mapRuesResultToCompanySummary);
  },
  undefined,
  {
    revalidate: 2 * 24 * 60 * 60,
  },
);
