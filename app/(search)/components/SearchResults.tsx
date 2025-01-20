"use client";

import type { CompanySummary } from "@/app/shared/component/CompanyCard";
import { CompanyStatusBadge } from "@/app/shared/component/CompanyStatusBadge";
import { Card, Flex, Heading, Separator, Link } from "@radix-ui/themes";
import NextLink from "next/link";

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
              key={`${result.name}-${result.nit}`}
              asChild
            >
              <li>
                <Link asChild underline="none">
                  <NextLink href={result.slug} prefetch={false}>
                    <Heading itemProp="name" as="h2" size="4">
                      {result.name}
                    </Heading>
                  </NextLink>
                </Link>
                <Flex align="center" gap="2">
                  <Heading as="h3" size="3" itemProp="taxID">
                    NIT: {result.fullNit}
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
