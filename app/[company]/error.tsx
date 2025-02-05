"use client";

import { Box, Button, Flex, Heading, Text } from "@radix-ui/themes";
import { useState } from "react";
import { PageContainer } from "../shared/component/PageContainer";
import { revalidate } from "./actions";

export default function Error({
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
                      reset();
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
