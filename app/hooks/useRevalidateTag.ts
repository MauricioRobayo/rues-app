import { revalidateTagAction } from "@/app/[company]/actions";
import { getRecaptchaToken, Action } from "@/app/lib/getRecaptchaToken";
import { useState, useTransition } from "react";

export function useRevalidateTag({ tag }: { tag: string }) {
  const [hasRevalidated, setHasRevalidated] = useState(false);
  const [isPending, startTransition] = useTransition();
  const revalidateTag = async () => {
    startTransition(async () => {
      const recaptchaToken = await getRecaptchaToken(Action.REVALIDATE_TAG);
      await revalidateTagAction({
        tag,
        recaptchaToken,
      });
      // https://react.dev/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition
      startTransition(() => {
        setHasRevalidated(true);
      });
    });
  };
  return { isPending, revalidateTag, hasRevalidated };
}
