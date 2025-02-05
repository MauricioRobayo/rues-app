"use client";

import { revalidate } from "@/app/[company]/actions";
import { PageContainer } from "@/app/shared/component/PageContainer";
import { Flex, Heading, Box, Button, Text } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ErrorRecovery({
  onAfterRevalidate,
}: {
  onAfterRevalidate?: () => void;
}) {
  const router = useRouter();
  const [isRetrying, setIsRetrying] = useState(false);
  const [countdown, setCountdown] = useState(3);
  return (
    <PageContainer py={{ initial: "6", sm: "8" }}>
      <Flex direction="column" gap="4">
        <Heading as="h2">Algo ha salido mal :(</Heading>
        <Box>
          {isRetrying ? (
            <Text>Recargando la página en {countdown}</Text>
          ) : (
            <Button
              onClick={() => {
                setIsRetrying(true);
                revalidate(window.location.pathname);
                const interval = setInterval(() => {
                  setCountdown((countdown) => {
                    if (countdown <= 0) {
                      clearInterval(interval);
                      (onAfterRevalidate ?? router.refresh)();
                      return 0;
                    }
                    return countdown - 1;
                  });
                }, 1000);
              }}
            >
              Volver a intentar
            </Button>
          )}
        </Box>
      </Flex>
    </PageContainer>
  );
}
