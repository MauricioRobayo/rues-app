"use client";

import { useRevalidatePath } from "@/app/hooks/useRevalidatePath";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Section,
} from "@radix-ui/themes";

export function ErrorRecovery({ reset }: { reset?: () => void }) {
  const [isPending, onClickHandler] = useRevalidatePath({ reset });
  return (
    <Container mx={{ initial: "4", lg: "0" }}>
      <Section size={{ initial: "1", sm: "2" }}>
        <Flex direction="column" gap="4">
          <Heading as="h2">Algo ha salido mal :(</Heading>
          <Box>
            <Button onClick={onClickHandler} loading={isPending}>
              Volver a intentar
            </Button>
          </Box>
        </Flex>
      </Section>
    </Container>
  );
}
