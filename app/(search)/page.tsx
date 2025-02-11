import { Search } from "@/app/(search)/components/Search";
import { Text, Flex } from "@radix-ui/themes";
import Providers from "@/app/(search)/providers";
import { PageContainer } from "@/app/shared/components/PageContainer";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <Providers>
        <PageContainer size="2" my="8">
          <Flex direction="column" gap="4">
            <Text size="4">
              Consultar información empresarial por NIT o Razón Social.
            </Text>
            <Search />
          </Flex>
        </PageContainer>
        <ReactQueryDevtools initialIsOpen />
      </Providers>
    </Suspense>
  );
}
