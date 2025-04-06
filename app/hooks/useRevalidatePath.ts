import { revalidatePathAction } from "@/app/[company]/actions";
import { Action, getRecaptchaToken } from "@/app/lib/getRecaptchaToken";
import { useTransition } from "react";

export function useRevalidatePath({ reset }: { reset?: () => void } = {}) {
  const [isPending, startTransition] = useTransition();
  const revalidatePath = async () => {
    startTransition(async () => {
      const recaptchaToken = await getRecaptchaToken(Action.REVALIDATE_PATH);
      await revalidatePathAction({
        path: window.location.pathname,
        recaptchaToken,
      });
      reset?.();
    });
  };
  return [isPending, revalidatePath] as const;
}
