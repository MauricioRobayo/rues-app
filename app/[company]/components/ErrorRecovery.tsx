"use client";

import { revalidate } from "@/app/[company]/actions";
import { PageContainer } from "@/app/shared/components/PageContainer";
import { RECAPTCHA_REVALIDATE_COMPANY_ACTION } from "@/app/shared/lib/constants";
import { Box, Button, Flex, Heading } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ErrorRecovery({ reset }: { reset?: () => void }) {
  const router = useRouter();
  const [isRetrying, setIsRetrying] = useState(false);
  return (
    <PageContainer py={{ initial: "6", sm: "8" }}>
      <Flex direction="column" gap="4">
        <Heading as="h2">Algo ha salido mal :(</Heading>
        <Box>
          <Button
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
                (reset ?? router.refresh)();
                setIsRetrying(false);
              }, 3000);
            }}
            loading={isRetrying}
          >
            Volver a intentar
          </Button>
        </Box>
      </Flex>
    </PageContainer>
  );
}
