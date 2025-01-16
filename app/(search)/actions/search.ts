"use server";

import { getToken } from "@/app/[company]/services/rues";
import { RUES } from "@mauriciorobayo/rues-api";

const rues = new RUES();

export async function search(companyName: string) {
  if (!companyName) {
    return null;
  }
  const token = await getToken();
  const response = await rues.advancedSearch({
    query: { razon: companyName.toString() },
    token,
  });
  if (response.status === "error") {
    return null;
  }
  return (response.data.registros ?? []).filter((registro) =>
    Boolean(Number(registro.nit)),
  );
}
