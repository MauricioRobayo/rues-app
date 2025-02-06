"use client";

import { revalidate } from "@/app/[company]/actions";
import { PageContainer } from "@/app/shared/component/PageContainer";
import { Box, Button, Flex, Heading } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function ErrorRecovery({ reset }: { reset?: () => void }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <PageContainer py={{ initial: "6", sm: "8" }}>
      <Flex direction="column" gap="4">
        <Heading as="h2">Algo ha salido mal :(</Heading>
        <Box>
          <Button
            onClick={() => {
              startTransition(() => {
                revalidate(window.location.pathname);
                (reset ?? router.refresh)();
              });
            }}
            loading={isPending}
          >
            Volver a intentar
          </Button>
        </Box>
      </Flex>
    </PageContainer>
  );
}
