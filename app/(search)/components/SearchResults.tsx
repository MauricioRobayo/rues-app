"use client";

import type { CompanyDto } from "@/app/[company]/types/CompanyDto";
import { CompanyStatusBadge } from "@/app/shared/components/CompanyStatusBadge";
import { Link } from "@/app/shared/components/Link";
import { Box, Card, Flex, Heading, Separator, Text } from "@radix-ui/themes";

export function SearchResults({ results }: { results: CompanyDto[] }) {
  if (results.length === 0) {
    return <div>No se encontraron resultados.</div>;
  }

  return (
    <Flex asChild direction="column" gap="4">
      <ul>
        {results.map((result) => {
          return (
            <Box key={`${result.nit}`} asChild>
              <li>
                <Card
                  size="4"
                  variant="ghost"
                  itemScope
                  itemType="https://schema.org/Organization"
                >
                  <Flex direction="column" gap="1">
                    <Link underline="none" href={result.slug} prefetch={false}>
                      <Heading itemProp="name" as="h2" size="4" weight="medium">
                        {result.name}
                      </Heading>
                    </Link>
                    <Flex
                      align={{ initial: "start", sm: "center" }}
                      gap="2"
                      direction={{ initial: "column", sm: "row" }}
                    >
                      <Heading as="h3" size="3" weight="regular">
                        NIT: <span itemProp="taxID">{result.fullNit}</span>
                      </Heading>
                      <CompanyStatusBadge
                        isActive={result.isActive}
                        variant="long"
                        size="1"
                      />
                    </Flex>
                    <Text size="1" weight="light">
                      {result.shortName ? `Sigla: ${result.shortName}` : null}
                    </Text>
                    <Flex gap="4" asChild>
                      <Text size="1" weight="light" title="Cámara de comercio">
                        CC {result.chamber.name}
                      </Text>
                    </Flex>
                  </Flex>
                  <Separator size="4" mt="4" />
                </Card>
              </li>
            </Box>
          );
        })}
      </ul>
    </Flex>
  );
}
