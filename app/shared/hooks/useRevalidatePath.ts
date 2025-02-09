import { revalidate } from "@/app/[company]/actions";
import { RECAPTCHA_REVALIDATE_COMPANY_ACTION } from "@/app/shared/lib/constants";
import { useTransition } from "react";

export function useRevalidatePath({ reset }: { reset?: () => void } = {}) {
  const [isPending, startTransition] = useTransition();
  const onClickHandler = async () => {
    startTransition(async () => {
      const recaptchaToken = await window.grecaptcha.enterprise.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        { action: RECAPTCHA_REVALIDATE_COMPANY_ACTION },
      );
      await revalidate({
        path: window.location.pathname,
        recaptchaToken,
      });
      reset?.();
    });
  };
  return { isPending, onClickHandler };
}
