import { Company } from "@/app/[company]/Company";
import { getToken } from "@/app/rues/getToken";
import { notFound } from "next/navigation";

const currentToken = await getToken();
if (!currentToken) {
  throw new Error("Could not get token");
}

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
  return <div>hello</div>;
}
