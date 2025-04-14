import { DataList } from "@/app/[company]/components/DataList";
import PhoneNumbers from "@/app/[company]/components/PhoneNumbers";
import { ToggleContent } from "@/app/[company]/components/ToogleContent";
import { Link } from "@/app/components/Link";
import { currencyFormatter } from "@/app/lib/formatters";
import { openDataService } from "@/app/services/openData/service";
import type { CompanyRecordDto } from "@/app/types/CompanyRecordDto";
import { GoogleMapsEmbed } from "@next/third-parties/google";
import { Box, Flex, Heading, type BoxProps } from "@radix-ui/themes";
import { cache } from "react";

export async function AdditionalRecordInformation({
  company,
  ...boxProps
}: {
  company: CompanyRecordDto;
} & BoxProps) {
  const record = await getChamberRecordCached(company);

  if (!record) {
    return null;
  }

  const contactDetails = [
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

  const financialDetails = [
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

  const shouldShowContactDetails = contactDetails.some(({ value }) => !!value);
  const shouldShowFinancialInformation = financialDetails.some(
    ({ value }) => !!value,
  );

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
          <DataList items={financialDetails} />
        </Box>
      )}
    </Box>
  );
}

export const getChamberRecordCached = cache(openDataService.chambers.getRecord);
