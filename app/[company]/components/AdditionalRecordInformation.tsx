import { DataList } from "@/app/[company]/components/DataList";
import { ToggleContent } from "@/app/[company]/components/ToogleContent";
import { Link } from "@/app/components/Link";
import { currencyFormatter } from "@/app/lib/formatters";
import { openDataService } from "@/app/services/openData/service";
import { Box, Heading, Section } from "@radix-ui/themes";
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

  const contactDetails = [
    {
      label: "Teléfono comercial",
      value: record.phoneNumber ? (
        <Link href={`tel:${record.phoneNumber}`}>{record.phoneNumber}</Link>
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
  ];

  return (
    <>
      <Section size="2" id="informacion-de-contacto">
        <Heading as="h3" size="4" mb="4">
          Información de Contacto
        </Heading>
        <DataList items={contactDetails} />
      </Section>
      <Section size="2" id="informacion-financiera">
        <Heading as="h3" size="4" mb="4">
          Información Financiera
        </Heading>
        <DataList items={financialDetails} />
      </Section>
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
