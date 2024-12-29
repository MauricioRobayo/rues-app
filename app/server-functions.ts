"use server";

import { mapRegistryToCompany } from "@/app/mapRegistryToCompany";
import { getToken } from "@/app/rues/getToken";
import { RUES } from "@mauriciorobayo/rues-api";

const currentToken = await getToken();
const rues = new RUES(currentToken);

export async function getCompany(companyName: string) {
  if (!companyName) {
    return [];
  }

  const response = await rues.advancedSearch({
    query: { razon: companyName?.toString() },
  });

  if (response.status === "error") {
    throw new Error("Failed to get company");
  }

  return (response.data.registros ?? []).map(mapRegistryToCompany);
}
