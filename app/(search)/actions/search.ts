"use server";

import { getToken } from "@/app/[company]/services/rues";
import { RUES } from "@mauriciorobayo/rues-api";

const projectID = process.env.GCP_PROJECT_ID ?? "";
const secretKey = process.env.RECAPTCHA_SECRET_KEY ?? "";
const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

const verificationUrl = `https://recaptchaenterprise.googleapis.com/v1/projects/${projectID}/assessments?key=${secretKey}`;
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
  if (!(await verifyRecaptcha(recaptchaToken))) {
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

async function verifyRecaptcha(token: string) {
  try {
    const response = await fetch(verificationUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: {
          token,
          expectedAction: "SEARCH",
          siteKey,
        },
      }),
    });
    const data = await response.json();

    console.log("response", JSON.stringify(data, null, 2));

    if (!data.tokenProperties.valid) {
      console.log(
        `The CreateAssessment call failed because the token was: ${data.tokenProperties.invalidReason}`,
      );
      return false;
    }

    if (data.tokenProperties.action !== "SEARCH") {
      console.log(
        "The action attribute in your reCAPTCHA tag does not match the action you are expecting to score",
      );
      return false;
    }

    if (!data.riskAnalysis?.score) {
      console.log("Failed to get score");
      return false;
    }

    return (data.riskAnalysis.score ?? 0) >= 0.5;
  } catch (err) {
    console.error(err);
    return false;
  }
}
