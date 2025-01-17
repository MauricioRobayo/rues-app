"use server";

import { getToken } from "@/app/[company]/services/rues";
import { verifyRecaptcha } from "@/app/lib/verify-recaptcha";
import { RUES } from "@mauriciorobayo/rues-api";

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

  const token = await getToken();
  const response = await rues.advancedSearch({
    query: { razon: companyName.toString() },
    token,
  });
  if (response.status === "error") {
    return null;
  }
  return (response.data.registros ?? [])
    .filter((registro) => Boolean(Number(registro.nit)))
    .slice(0, 25);
}
