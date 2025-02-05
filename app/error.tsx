"use client";

import { Flex, Heading, Text } from "@radix-ui/themes";
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
  const [countdown, setCountdown] = useState(5);
  useEffect(() => {
    console.error(error);
    revalidate(window.location.pathname);
    const interval = setInterval(() => {
      setCountdown((countdown) => {
        if (countdown === 0) {
          clearInterval(interval);
          reset();
          return 0;
        }
        return countdown - 1;
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [error]);

  return (
    <PageContainer py={{ initial: "6", sm: "8" }}>
      <Flex direction="column" gap="4">
        <Heading as="h2">Algo ha salido mal</Heading>
        <Text>Recargando la página en {countdown}</Text>
      </Flex>
    </PageContainer>
  );
}
