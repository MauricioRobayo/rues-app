import type { Action } from "@/app/lib/getRecaptchaToken";

const projectID = process.env.GCP_PROJECT_ID ?? "";
const secretKey = process.env.RECAPTCHA_SECRET_KEY ?? "";
const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

const verificationUrl = `https://recaptchaenterprise.googleapis.com/v1/projects/${projectID}/assessments?key=${secretKey}`;

export async function verifyRecaptcha({
  token,
  action,
}: {
  token: string;
  action: keyof typeof Action;
}) {
  try {
    const response = await fetch(verificationUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: {
          token,
          siteKey,
        },
      }),
    });
    const data = await response.json();

    if (!data.tokenProperties.valid) {
      console.log(
        `The CreateAssessment call failed because the token was: ${data.tokenProperties.invalidReason}`,
      );
      return false;
    }

    if (data.tokenProperties.action !== action) {
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
