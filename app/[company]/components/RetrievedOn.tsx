"use client";

import { revalidate } from "@/app/[company]/actions";
import { RECAPTCHA_REVALIDATE_COMPANY_ACTION } from "@/app/shared/lib/constants";
import { SymbolIcon } from "@radix-ui/react-icons";
import { Flex, IconButton, Text } from "@radix-ui/themes";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function RetrievedOn({ retrievedOn }: { retrievedOn: number }) {
  const router = useRouter();
  const [isRetrying, setIsRetrying] = useState(false);
  const canRefresh = Date.now() - retrievedOn > 7 * 24 * 60 * 60;
  const distanceToNow = formatDistanceToNow(retrievedOn, {
    locale: es,
    addSuffix: true,
  });
  return (
    <Flex>
      <Text size="1" color="gray">
        Actualizado {distanceToNow}
      </Text>
      {canRefresh ? (
        <IconButton
          aria-label="Actualizar information"
          loading={isRetrying}
          onClick={async () => {
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
              router.refresh();
              setIsRetrying(false);
            }, 3000);
          }}
        >
          <SymbolIcon />
        </IconButton>
      ) : null}
    </Flex>
  );
}
