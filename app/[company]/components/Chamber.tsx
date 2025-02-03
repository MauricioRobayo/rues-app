import { CompanyDetails } from "@/app/[company]/components/CompanyDetails";
import { getChamber } from "@/app/[company]/services/chambers";
import { unstable_cache } from "next/cache";
import { cache } from "react";

export async function Chamber({ code }: { code: number }) {
  const chamber = await getChamberCached(code);
  if (!chamber) {
    return <div>Algo salió mal.</div>;
  }
  return <CompanyDetails details={chamber} />;
}

const getChamberCached = unstable_cache(cache(getChamber), undefined, {
  revalidate: false, // cache indefinitely or until matching
});
