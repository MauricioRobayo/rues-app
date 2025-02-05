"use client";

import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { revalidate } from "./[company]/actions";
import { PageContainer } from "./shared/component/PageContainer";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [countdown, setCountdown] = useState(3);

  return (
    <PageContainer py={{ initial: "6", sm: "8" }}>
      <Flex direction="column" gap="4">
        <Heading as="h2">Algo ha salido mal</Heading>
        {isRetrying ? (
          <Text>Recargando la página en {countdown}</Text>
        ) : (
          <Button
            onClick={() => {
              setIsRetrying(true);
              revalidate(window.location.pathname);
              const interval = setInterval(() => {
                if (countdown <= 0) {
                  clearInterval(interval);
                  reset();
                  return;
                }
                setCountdown((countdown) => countdown - 1);
              }, 1000);
            }}
          >
            Volver a intentar
          </Button>
        )}
      </Flex>
    </PageContainer>
  );
}
