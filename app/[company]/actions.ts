"use server";

import { Action } from "@/app/lib/getRecapchaToken";
import { verifyRecaptcha } from "@/app/lib/verifyRecaptcha";
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
      action: Action.REVALIDATE_COMPANY,
    }))
  ) {
    return null;
  }

  revalidatePath(path);
}
