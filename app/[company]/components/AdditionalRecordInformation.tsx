import { DataList } from "@/app/[company]/components/DataList";
import PhoneNumbers from "@/app/[company]/components/PhoneNumbers";
import { ToggleContent } from "@/app/[company]/components/ToogleContent";
import { Link } from "@/app/components/Link";
import { currencyFormatter } from "@/app/lib/formatters";
import { openDataService } from "@/app/services/openData/service";
import type { CompanyRecordDto } from "@/app/types/CompanyRecordDto";
import { GoogleMapsEmbed } from "@next/third-parties/google";
import { Text, Box, Flex, Heading, type BoxProps } from "@radix-ui/themes";
import { cache } from "react";

export async function AdditionalRecordInformation({
  company,
  ...boxProps
}: {
  company: CompanyRecordDto;
} & BoxProps) {
  const [record, financialRecords] = await Promise.all([
    getChamberRecordCached(company),
    getLargestCompanyRecordCached(company.nit),
  ]);

  const contactDetails = record && [
    {
      label: "Municipio comercial",
      value: record.city,
    },
    { label: "Barrio comercial", value: record.zone },
    {
      label: "Dirección comercial",
      value:
        record.address && record.city && process.env.GOOGLE_MAPS_API_KEY ? (
          <Flex direction="column" gap="2" width="100%">
            {record.address}
            <Box>
              <ToggleContent label="Ver mapa">
                <GoogleMapsEmbed
                  apiKey={process.env.GOOGLE_MAPS_API_KEY}
                  height={400}
                  width="100%"
                  mode="place"
                  q={`${record.address},${record.city},Colombia`}
                />
              </ToggleContent>
            </Box>
          </Flex>
        ) : null,
    },
    {
      label: "Teléfono comercial",
      value:
        record.phoneNumbers && record.phoneNumbers.length > 0 ? (
          <PhoneNumbers phoneNumbers={record.phoneNumbers} />
        ) : null,
    },
    {
      label: "Corre electrónico",
      value: record.email ? (
        <Box>
          <ToggleContent label="Ver correo electrónico">
            <Link href={`mailto:${record.email}`}>{record.email}</Link>
          </ToggleContent>
        </Box>
      ) : null,
    },
  ];

  const financialDetails = record && [
    { label: "Tamaño de la empresa", value: record.size },
    {
      label: "Total activos",
      value: Number.isNaN(Number(record.assets))
        ? null
        : currencyFormatter.format(Number(record.assets)),
    },
    {
      label: "Total empleados",
      value: record.employees,
    },
  ];

  const financialData =
    financialRecords &&
    financialRecords.map((record) => ({
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

  const shouldShowContactDetails =
    contactDetails && contactDetails.some(({ value }) => !!value);
  const shouldShowFinancialInformation =
    (financialRecords && financialRecords.length > 0) ||
    (financialDetails && financialDetails.some(({ value }) => !!value));

  if (!shouldShowContactDetails && !shouldShowFinancialInformation) {
    return null;
  }

  return (
    <Box {...boxProps}>
      {shouldShowContactDetails && (
        <Box mb={{ initial: "6", sm: "8" }}>
          <Heading as="h3" size="4" mb="4">
            Información de Contacto
          </Heading>
          <DataList items={contactDetails} />
        </Box>
      )}
      {shouldShowFinancialInformation && (
        <Box>
          <Heading as="h3" size="4" mb="4">
            Información Financiera
          </Heading>
          <Flex direction="column" gap="5">
            {financialDetails && <DataList items={financialDetails} />}
            {financialData && financialData.length > 0 && (
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
            )}
          </Flex>
        </Box>
      )}
    </Box>
  );
}

export const getChamberRecordCached = cache(openDataService.chambers.getRecord);
export const getLargestCompanyRecordCached = cache(
  openDataService.largestCompanies.get,
);
