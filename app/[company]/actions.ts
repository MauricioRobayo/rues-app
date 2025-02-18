"use server";

import { Action } from "@/app/lib/getRecapchaToken";
import { verifyRecaptcha } from "@/app/lib/verifyRecaptcha";
import {
  revalidatePath as _revalidatePath,
  revalidateTag as _revalidateTag,
} from "next/cache";

export async function revalidatePath({
  path,
  recaptchaToken,
}: {
  path: string;
  recaptchaToken: string;
}) {
  if (
    !(await verifyRecaptcha({
      token: recaptchaToken,
      action: Action.REVALIDATE_PATH,
    }))
  ) {
    return null;
  }

  _revalidatePath(path);
}

export async function revalidateTag({
  tag,
  recaptchaToken,
}: {
  tag: string;
  recaptchaToken: string;
}) {
  if (
    !(await verifyRecaptcha({
      token: recaptchaToken,
      action: Action.REVALIDATE_TAG,
    }))
  ) {
    return null;
  }

  _revalidateTag(tag);
}
