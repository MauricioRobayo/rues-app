"use server";

import { getToken } from "@/app/[company]/services/rues";
import { formatNit } from "@/app/lib/format-nit";
import { isValidNit } from "@/app/lib/is-valid-nit";
import { slugifyCompanyName } from "@/app/lib/slugify-company-name";
import { verifyRecaptcha } from "@/app/lib/verify-recaptcha";
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
      .map((record) => ({
        name: record.razon_social,
        fullNit: formatNit(Number(record.nit)),
        isActive: record.estado_matricula === "ACTIVA",
        slug: `/${slugifyCompanyName(record.razon_social)}-${record.nit}`,
        nit: record.nit,
      }));
  },
  undefined,
  {
    revalidate: 2 * 24 * 60 * 60,
  },
);
