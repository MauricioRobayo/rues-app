import { ActiveDuration } from "@/app/[company]/components/ActiveDuration";
import { Bidder } from "@/app/[company]/components/Bidder";
import { CopyButton } from "@/app/[company]/components/CopyButton";
import { DataList } from "@/app/[company]/components/DataList";
import { EconomicActivities } from "@/app/[company]/components/EconomicActivities";
import { LegalRepresentatives } from "@/app/[company]/components/LegalRepresentatives";
import PhoneNumbers from "@/app/[company]/components/PhoneNumbers";
import { ReadMore } from "@/app/[company]/components/ReadMore";
import { ToggleContent } from "@/app/[company]/components/ToogleContent";
import { CompanyStatusBadge } from "@/app/components/CompanyStatusBadge";
import type { CompanyDto } from "@/app/types/CompanyDto";
import { GoogleMapsEmbed } from "@next/third-parties/google";
import { Box, Code, Flex, Heading, Link, Section } from "@radix-ui/themes";

export function CompanyDescription({ company }: { company: CompanyDto }) {
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
    { label: "Organización jurídica", value: company.legalEntityType },
    { label: "Categoría de la matrícula", value: company.category },
    { label: "Fecha de matrícula", value: company.registrationDate },
    { label: "Fecha de renovación", value: company.renewalDate },
    { label: "Fecha de cancelación", value: company.cancellationDate },
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
    { label: "Tamaño de la empresa", value: company.size },
    { label: "Municipio", value: company.city },
    { label: "Departamento", value: company.state },
    {
      label: "Dirección",
      value:
        company.address &&
        company.city &&
        company.state &&
        process.env.GOOGLE_MAPS_API_KEY ? (
          <Flex direction="column" gap="2" width="100%">
            {company.address}
            <Box>
              <ToggleContent label="Ver mapa">
                <GoogleMapsEmbed
                  apiKey={process.env.GOOGLE_MAPS_API_KEY}
                  height={400}
                  width="100%"
                  mode="place"
                  q={`${company.address},${company.city},${company.state},Colombia`}
                />
              </ToggleContent>
            </Box>
          </Flex>
        ) : null,
    },
    { label: "Zona comercial", value: company.area },
    {
      label: "Teléfono",
      value:
        company.phoneNumbers && company.phoneNumbers.length > 0 ? (
          <PhoneNumbers phoneNumbers={company.phoneNumbers} />
        ) : null,
    },
    {
      label: "Corre electrónico",
      value: company.email ? (
        <Box>
          <ToggleContent label="Ver correo electrónico">
            <Link href={`mailto:${company.email}`}>{company.email}</Link>
          </ToggleContent>
        </Box>
      ) : null,
    },
    {
      label: "Registro proponente",
      value: company.bidderId ? <Bidder bidderId={company.bidderId} /> : null,
    },
    {
      label: "Objecto social",
      value: company.scope ? <ReadMore text={company.scope} /> : null,
    },
    {
      label: "Actividad económica",
      value:
        company.economicActivities.length > 0 ? (
          <EconomicActivities activities={company.economicActivities} />
        ) : null,
    },
    {
      label: "Actividad económica de mayores ingresos",
      value: company.highestRevenueEconomicActivityCode ? (
        <Code size="2">{company.highestRevenueEconomicActivityCode}</Code>
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
