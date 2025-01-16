import { companiesRepository } from "@/app/repositories/companies";
import slugify from "@sindresorhus/slugify";
import { unstable_cache } from "next/cache";
import { notFound, permanentRedirect } from "next/navigation";
import { cache } from "react";

export const getCompanyRecordFromPathSegment = unstable_cache(
  cache(async (pathSegment: string) => {
    const { nit, slug } = parseCompanyPathSegment(pathSegment);
    if (!isValidNit(nit)) {
      notFound();
    }
    const companyRecord = await companiesRepository.findByNit(nit);
    if (!companyRecord) {
      notFound();
    }
    const companyNameSlug = slugifyCompanyName(companyRecord.businessName);
    if (slug !== companyNameSlug) {
      permanentRedirect(`/${companyNameSlug}-${nit}`);
    }
    return companyRecord;
  }),
);

function parseCompanyPathSegment(pathSegment: string) {
  return {
    nit: Number(pathSegment.replace(/.*-/g, "")),
    slug: pathSegment.slice(0, pathSegment.lastIndexOf("-")),
  } as const;
}

function isValidNit(nit: number) {
  return !Number.isNaN(nit) && String(nit).length >= 9;
}

export function slugifyCompanyName(companyName: string) {
  return slugify(companyName, {
    customReplacements: [[".", ""]],
  });
}
