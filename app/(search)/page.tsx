import { Search } from "@/app/(search)/components/Search";
import Providers from "@/app/(search)/providers";
import { Container, Flex, Section, Text } from "@radix-ui/themes";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense } from "react";

export default function Page() {
  return (
    <Container size="2" mx={{ initial: "4", lg: "0" }}>
      <Section>
        <Flex direction="column" gap="4">
          <Text size="4">
            Consultar información empresarial por NIT o Razón Social.
          </Text>
          <Suspense>
            <Providers>
              <Search />
              <ReactQueryDevtools initialIsOpen />
            </Providers>
          </Suspense>
        </Flex>
      </Section>
    </Container>
  );
}
