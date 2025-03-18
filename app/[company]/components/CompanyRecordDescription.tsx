import { ActiveDuration } from "@/app/[company]/components/ActiveDuration";
import { Bidder } from "@/app/[company]/components/Bidder";
import { CopyButton } from "@/app/[company]/components/CopyButton";
import { DataList } from "@/app/[company]/components/DataList";
import { EconomicActivities } from "@/app/[company]/components/EconomicActivities";
import { LegalRepresentatives } from "@/app/[company]/components/LegalRepresentatives";
import { CompanyStatusBadge } from "@/app/components/CompanyStatusBadge";
import type { CompanyRecordDto } from "@/app/types/CompanyRecordDto";
import { Code, Flex, Heading, Section } from "@radix-ui/themes";

export function CompanyRecordDescription({
  company,
}: {
  company: CompanyRecordDto;
}) {
  const details = [
    {
      label: "Razón social",
      value: company.name,
      learnMore:
        "Es el nombre con el que se constituye una empresa y que aparece como tal en el documento público o privado de constitución o en los documentos posteriores que la reforman.",
    },
    {
      label: "NIT",
      value: (
        <Flex align="center" gap="2">
          <Code variant="ghost">{company.nit}</Code>
          <CopyButton value={company.nit} />
        </Flex>
      ),
      learnMore:
        "El Número de Identificación Tributaria es el identificador numérico único utilizado para registrar la administración tributaria de las personas naturales y jurídicas.",
    },
    {
      label: "Dígito de verificación",
      value: <Code variant="ghost">{company.verificationDigit}</Code>,
      learnMore:
        "Es un número que va en un rango del cero (0) a nueve (9) y se ubica al final del NIT. Su objetivo es verificar la autenticidad del NIT.",
    },
    {
      label: "Matrícula",
      value: (
        <Flex align="center" gap="2">
          <Code variant="ghost">{company.registrationNumber}</Code>
          <CopyButton value={company.registrationNumber} />
          <CompanyStatusBadge isActive={company.isActive} />
        </Flex>
      ),
      learnMore:
        "La Matrícula Mercantil es el registro que deben hacer los comerciantes, ya sean personas naturales o jurídicas, y los establecimientos de comercio, en las cámaras de comercio con jurisdicción en el lugar donde van a desarrollar su actividad y donde va a funcionar el establecimiento de comercio.",
    },
    {
      label: "Estado",
      value: company.status.split(" ").length > 1 ? company.status : null,
    },
    {
      label: "Sigla",
      value: company.shortName,
    },
    { label: "Tipo de sociedad", value: company.type },
    { label: "Categoría de la matrícula", value: company.category },
    { label: "Fecha de matrícula", value: company.registrationDate },
    { label: "Fecha de renovación", value: company.renewalDate },
    { label: "Fecha de cancelación", value: company.cancellationDate },
    { label: "Fecha de actualización", value: company.updatedDate },
    { label: "Último año renovado", value: company.lastRenewalYear },
    {
      label: company.isActive ? "Antigüedad" : "Tiempo activa",
      value: (
        <ActiveDuration
          registrationDate={company.rawRegistrationDate}
          cancellationDate={company.rawCancellationDate}
        />
      ),
    },
    {
      label: "Registro proponente",
      value: company.bidderId ? <Bidder bidderId={company.bidderId} /> : null,
    },
    {
      label: "Actividad económica",
      value:
        company.economicActivities.length > 0 ? (
          <EconomicActivities activities={company.economicActivities} />
        ) : null,
    },
    {
      label: "Representante legal",
      value:
        company.legalRepresentatives &&
        company.legalRepresentatives.length > 0 ? (
          <LegalRepresentatives
            legalRepresentatives={company.legalRepresentatives}
          />
        ) : null,
    },
  ];
  return (
    <Section size={{ initial: "1", sm: "2" }} id="detalles-de-la-empresa">
      <Heading as="h3" size="4" mb="2">
        Detalles de la Empresa
      </Heading>
      <DataList items={details} />
    </Section>
  );
}
