import { Search } from "@/app/(search)/components/Search";
import Providers from "@/app/(search)/providers";
import { PageContainer } from "@/app/components/PageContainer";
import { Flex, Text } from "@radix-ui/themes";
import { Suspense } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function Page() {
  return (
    <PageContainer variant="narrow" my="8">
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
    </PageContainer>
  );
}
