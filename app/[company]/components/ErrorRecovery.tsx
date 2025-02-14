"use client";

import { PageContainer } from "@/app/components/PageContainer";
import { useRevalidatePath } from "@/app/hooks/useRevalidatePath";
import { Box, Button, Flex, Heading } from "@radix-ui/themes";

export function ErrorRecovery({ reset }: { reset?: () => void }) {
  const { onClickHandler, isPending } = useRevalidatePath({ reset });
  return (
    <PageContainer py={{ initial: "6", sm: "8" }}>
      <Flex direction="column" gap="4">
        <Heading as="h2">Algo ha salido mal :(</Heading>
        <Box>
          <Button onClick={onClickHandler} loading={isPending}>
            Volver a intentar
          </Button>
        </Box>
      </Flex>
    </PageContainer>
  );
}
