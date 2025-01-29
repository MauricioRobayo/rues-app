"use client";

import type { CompanySummary } from "@/app/shared/component/CompanyCard";
import { CompanyStatusBadge } from "@/app/shared/component/CompanyStatusBadge";
import { Link } from "@/app/shared/component/Link";
import { Card, Flex, Heading, Separator } from "@radix-ui/themes";

export function SearchResults({
  results,
}: {
  results: CompanySummary[] | null;
}) {
  if (!results) {
    return null;
  }

  if (results.length === 0) {
    return <div>No se encontraron resultados.</div>;
  }

  return (
    <Flex asChild direction="column" gap="4">
      <ul>
        {results.map((result) => {
          return (
            <Card
              size="4"
              variant="ghost"
              itemScope
              itemType="https://schema.org/Organization"
              key={`${result.nit}`}
              asChild
            >
              <li>
                <Link underline="none" href={result.slug} prefetch={false}>
                  <Heading itemProp="name" as="h2" size="4">
                    {result.name}
                  </Heading>
                </Link>
                <Flex align="center" gap="2">
                  <Heading as="h3" size="3" weight="regular">
                    NIT: <span itemProp="taxID">{result.fullNit}</span>
                  </Heading>
                  <CompanyStatusBadge isActive={result.isActive} />
                </Flex>
                <Separator size="4" mt="4" />
              </li>
            </Card>
          );
        })}
      </ul>
    </Flex>
  );
}
