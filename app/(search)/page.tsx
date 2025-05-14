import { Search } from "@/app/(search)/components/Search";
import Providers from "@/app/(search)/providers";
import { openDataService } from "@/app/services/openData/service";
import { Container, Flex, Section, Text } from "@radix-ui/themes";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense } from "react";

export const revalidate = 14400; // Every 4 hours

export default async function Page() {
  const randomCompanyNit = await getRandomCompanyNit();
  return (
    <Container size="2" mx={{ initial: "4", lg: "0" }}>
      <Section>
        <Flex direction="column" gap="4">
          <Text size="4">
            Consultar información empresarial por NIT o Razón Social.
          </Text>
          <Suspense>
            <Providers>
              <Search randomCompanyNit={randomCompanyNit} />
              <ReactQueryDevtools initialIsOpen />
            </Providers>
          </Suspense>
        </Flex>
      </Section>
    </Container>
  );
}

async function getRandomCompanyNit() {
  const fallbackNit = "899999068"; // Ecopetrol
  const randomRecords = await openDataService.largestCompanies.getRandom(25);
  const companyNits =
    await openDataService.companyRecords.validateNits(randomRecords);

  return companyNits.at(0) ?? fallbackNit;
}
