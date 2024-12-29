import { Company } from "@/app/[company]/Company";
import { mapRegistryToCompany } from "@/app/mapRegistryToCompany";
import { getToken } from "@/app/rues/getToken";
import { RUES } from "@mauriciorobayo/rues-api";
import { notFound } from "next/navigation";

const currentToken = await getToken();
if (!currentToken) {
  throw new Error("Could not get token");
}
const rues = new RUES(currentToken);

export default async function Page({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company } = await params;
  const companyData = await getCompany(company);
  return <Company {...companyData} />;
}

async function getCompany(slug: string) {
  const nit = slug.replace(/.*-/, "");
  if (!/^\d+$/.test(nit) || nit.length < 9) {
    notFound();
  }
  const companyData = await rues.advancedSearch({
    query: { nit: Number(nit) },
  });
  if (companyData.status === "error") {
    return notFound();
  }
  if (!companyData.data.registros?.length) {
    return notFound();
  }
  const company = companyData.data.registros[0];
  return mapRegistryToCompany(company);
}
