import { revalidate } from "@/app/[company]/actions";
import { RECAPTCHA_REVALIDATE_COMPANY_ACTION } from "@/app/shared/lib/constants";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useRevalidatePath({ reset }: { reset?: () => void } = {}) {
  const router = useRouter();
  const [isRetrying, setIsRetrying] = useState(false);
  const onClickHandler = async () => {
    const recaptchaToken = await window.grecaptcha.enterprise.execute(
      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
      { action: RECAPTCHA_REVALIDATE_COMPANY_ACTION },
    );

    revalidate({
      path: window.location.pathname,
      recaptchaToken,
    });
    setIsRetrying(true);
    setTimeout(() => {
      (reset ?? router.refresh)();
      setIsRetrying(false);
    }, 3000);
  };
  return { isRetrying, onClickHandler };
}
