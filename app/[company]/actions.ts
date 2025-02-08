"use server";

import { RECAPTCHA_REVALIDATE_COMPANY_ACTION } from "@/app/shared/lib/constants";
import { verifyRecaptcha } from "@/app/shared/lib/verifyRecaptcha";
import { revalidatePath } from "next/cache";

export async function revalidate({
  path,
  recaptchaToken,
}: {
  path: string;
  recaptchaToken: string;
}) {
  if (
    !(await verifyRecaptcha({
      token: recaptchaToken,
      action: RECAPTCHA_REVALIDATE_COMPANY_ACTION,
    }))
  ) {
    return null;
  }

  revalidatePath(path);
}
