import { DataList } from "@/app/[company]/components/DataList";
import PhoneNumbers from "@/app/[company]/components/PhoneNumbers";
import { ToggleContent } from "@/app/[company]/components/ToogleContent";
import { Link } from "@/app/components/Link";
import { currencyFormatter } from "@/app/lib/formatters";
import { openDataService } from "@/app/services/openData/service";
import { GoogleMapsEmbed } from "@next/third-parties/google";
import { Box, Flex, Heading, Section } from "@radix-ui/themes";
import { cache } from "react";

export async function AdditionalRecordInformation({
  chamberCode,
  registrationNumber,
}: {
  chamberCode: string;
  registrationNumber: string;
}) {
  const record = await getChamberCompanyRecordCached(
    chamberCode,
    registrationNumber,
  );

  if (!record) {
    return null;
  }

  const city = record.city?.replace(/^\d+\W+/, "");
  const contactDetails = [
    {
      label: "Municipio comercial",
      value: city,
    },
    { label: "Barrio comercial", value: record.zone?.replace(/^\d+\W+/, "") },
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
                  q={`${record.address},${city},Colombia`}
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
    { label: "Tamaño de la empresa", value: record.size?.toLocaleUpperCase() },
    {
      label: "Total activos",
      value: Number.isNaN(Number(record.assets))
        ? null
        : currencyFormatter.format(Number(record.assets)),
    },
  ];

  const shouldShosContactDetails = contactDetails.some(({ value }) => !!value);
  const shouldShowFinancialInformation = financialDetails.some(
    ({ value }) => !!value,
  );

  return (
    <>
      {shouldShosContactDetails && (
        <Section size="2" id="informacion-de-contacto">
          <Heading as="h3" size="4" mb="4">
            Información de Contacto
          </Heading>
          <DataList items={contactDetails} />
        </Section>
      )}
      {shouldShowFinancialInformation && (
        <Section size="2" id="informacion-financiera">
          <Heading as="h3" size="4" mb="4">
            Información Financiera
          </Heading>
          <DataList items={financialDetails} />
        </Section>
      )}
    </>
  );
}

export const getChamberCompanyRecordCached = cache(
  (chamberCode: string, registrationNumber: string) =>
    openDataService.chamber.getChamberRecord({
      chamberCode,
      registrationNumber,
    }),
);
