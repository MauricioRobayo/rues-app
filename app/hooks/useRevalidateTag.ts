import { revalidateTagAction } from "@/app/[company]/actions";
import { getRecaptchaToken, Action } from "@/app/lib/getRecapchaToken";
import { useTransition } from "react";

export function useRevalidateTag({ tag }: { tag: string }) {
  const [isPending, startTransition] = useTransition();
  const revalidateTag = async () => {
    startTransition(async () => {
      const recaptchaToken = await getRecaptchaToken(Action.REVALIDATE_TAG);
      await revalidateTagAction({
        tag,
        recaptchaToken,
      });
    });
  };
  return [isPending, revalidateTag] as const;
}
