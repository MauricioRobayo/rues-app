"use server";

import { tokenRepository } from "@/app/repositories/tokens";
import { RECAPTCHA_POWERS_ACTION } from "@/app/shared/lib/constants";
import { verifyRecaptcha } from "@/app/shared/lib/verifyRecaptcha";
import { getLegalRepresentativePowers } from "@mauriciorobayo/rues-api";
import { revalidatePath } from "next/cache";

export async function revalidate(path: string) {
  revalidatePath(path);
}

export async function getPowers({
  recaptchaToken,
  query,
}: {
  recaptchaToken: string;
  query: {
    businessRegistrationNumber: string;
    chamberCode: string;
  };
}) {
  if (
    !(await verifyRecaptcha({
      token: recaptchaToken,
      action: RECAPTCHA_POWERS_ACTION,
    }))
  ) {
    return null;
  }
  const token = await tokenRepository.getToken();
  const response = await getLegalRepresentativePowers({
    query,
    token,
  });
  if (response.status === "error") {
    console.error(
      "Failed to get legal representative powers",
      JSON.stringify(response),
    );
    return null;
  }
  return response.data;
}
