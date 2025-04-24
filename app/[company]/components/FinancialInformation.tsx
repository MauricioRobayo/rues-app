import { DataList } from "@/app/[company]/components/DataList";
import { openDataService } from "@/app/services/openData/service";
import { Box, Flex, Heading, Text, type BoxProps } from "@radix-ui/themes";
import React from "react";

export async function FinancialInformation({
  nit,
  ...boxProps
}: { nit: number } & BoxProps) {
  const records = await getLargestCompanyRecordCached(nit);
  if (!records || records.length === 0) {
    return null;
  }

  const financialData = records.map((record) => ({
    year: record.reportingYear,
    details: [
      { label: "Supervisor", value: record.supervisor },
      { label: "Región", value: record.region },
      { label: "Departamento", value: record.state },
      { label: "Ciudad", value: record.city },
      { label: "Macrosector", value: record.macroSector },
      {
        label: "Ingresos operacionales",
        value: record.operatingIncome,
      },
      { label: "Ganancia o pérdida neta", value: record.netProfitOrLoss },
      { label: "Total activos", value: record.totalAssets },
      { label: "Total pasivos", value: record.totalLiabilities },
      { label: "Total patrimonio", value: record.totalEquity },
    ],
  }));

  return (
    <Box {...boxProps}>
      <Heading as="h3" size="4" mb="4">
        Información Financiera
      </Heading>
      <Flex asChild direction="column" gap="2">
        <ul>
          {financialData.map((data) => (
            <li key={data.year}>
              <details name="establecimiento-comercial">
                <Text asChild>
                  <summary>Año de corte {data.year}</summary>
                </Text>
                <Flex my="4" pl="4" direction="column" gap="4">
                  <DataList items={data.details} />
                </Flex>
              </details>
            </li>
          ))}
        </ul>
      </Flex>
    </Box>
  );
}

export const getLargestCompanyRecordCached = React.cache(
  openDataService.largestCompanies.get,
);
