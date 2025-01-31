"use client";

import { CompanyStatusBadge } from "@/app/shared/component/CompanyStatusBadge";
import { Link } from "@/app/shared/component/Link";
import type { BusinessSummary } from "@/app/shared/mappers/mapRuesResultToCompany";
import {
  Box,
  Card,
  DataList,
  Flex,
  Grid,
  Heading,
  Separator,
} from "@radix-ui/themes";
import type { ReactNode } from "react";

export function SearchResults({
  results,
}: {
  results: BusinessSummary[] | null;
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
            <Box key={`${result.nit}`} asChild>
              <li>
                <Card
                  size="4"
                  variant="ghost"
                  itemScope
                  itemType="https://schema.org/Organization"
                >
                  <Grid
                    columns={{ initial: "1", sm: "1fr auto" }}
                    gap={{ initial: "1", sm: "4" }}
                    align="start"
                  >
                    <Link underline="none" href={result.slug} prefetch={false}>
                      <Heading itemProp="name" as="h2" size="4" weight="medium">
                        {result.name}
                      </Heading>
                    </Link>
                    <Flex align="center" gap="2">
                      <Heading as="h3" size="3" weight="regular">
                        NIT: <span itemProp="taxID">{result.fullNit}</span>
                      </Heading>
                    </Flex>
                    <Details
                      mt={{ initial: "2", sm: "0" }}
                      details={[
                        {
                          label: "Cámara de comercio",
                          value: result.chamberName,
                        },
                        {
                          label: "Último año renovado",
                          value: result.lastRenewalYear,
                        },
                        {
                          label: "Matrícula",
                          value: (
                            <Flex gap="2" align="center">
                              {result.registrationNumber}
                              <CompanyStatusBadge isActive={result.isActive} />
                            </Flex>
                          ),
                        },
                        result.shortName
                          ? { label: "Sigla", value: result.shortName }
                          : null,
                      ].filter((item) => item !== null)}
                    />
                  </Grid>
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

function Details({
  details,
  ...props
}: {
  details: { label: string; value: ReactNode }[];
} & DataList.RootProps) {
  return (
    <DataList.Root
      size={{ initial: "1", sm: "2" }}
      style={{ gap: "var(--space-2" }}
      {...props}
    >
      {details.map(({ label, value }) => (
        <DataList.Item key={label}>
          <DataList.Label minWidth={{ initial: "8rem", sm: "10rem" }}>
            {label}
          </DataList.Label>
          <DataList.Value>
            <div>{value}</div>
          </DataList.Value>
        </DataList.Item>
      ))}
    </DataList.Root>
  );
}
