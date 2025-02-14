import { revalidate } from "@/app/[company]/actions";
import { Action, getRecaptchaToken } from "@/app/lib/getRecapchaToken";
import { useTransition } from "react";

export function useRevalidatePath({ reset }: { reset?: () => void } = {}) {
  const [isPending, startTransition] = useTransition();
  const onClickHandler = async () => {
    startTransition(async () => {
      const recaptchaToken = await getRecaptchaToken(Action.REVALIDATE_COMPANY);
      await revalidate({
        path: window.location.pathname,
        recaptchaToken,
      });
      reset?.();
    });
  };
  return { isPending, onClickHandler };
}
