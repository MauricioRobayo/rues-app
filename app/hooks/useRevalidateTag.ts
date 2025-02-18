import { revalidateTag } from "@/app/[company]/actions";
import { getRecaptchaToken, Action } from "@/app/lib/getRecapchaToken";
import { useTransition } from "react";

export function useRevalidateTag({ tag }: { tag: string }) {
  const [isPending, startTransition] = useTransition();
  const onClickHandler = async () => {
    startTransition(async () => {
      const recaptchaToken = await getRecaptchaToken(Action.REVALIDATE_TAG);
      await revalidateTag({
        tag,
        recaptchaToken,
      });
    });
  };
  return [isPending, onClickHandler] as const;
}
