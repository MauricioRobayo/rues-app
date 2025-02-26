import { DataList } from "@/app/[company]/components/DataList";
import { ExpandableList } from "@/app/[company]/components/ExpandableList";
import { getChamber } from "@/app/lib/chambers";
import type { PenaltyDto } from "@/app/types/PenaltyDto";
import { Section, Heading, Flex, Box, Text } from "@radix-ui/themes";

export function Penalties({ penalties }: { penalties?: PenaltyDto[] }) {
  const companyPenalties = (penalties ?? []).map((penalty) => ({
    administrativeActNumber: penalty.administrativeActNumber,
    administrativeActDate: penalty.administrativeActDate,
    details: [
      { label: "Tipo de reporte", value: penalty.reportType },
      {
        label: "Fecha del acto administrativo",
        value: penalty.administrativeActDate,
      },
      {
        label: "Cámara de Comercio",
        value: getChamber(penalty.chamberCode)?.name.replace(
          /cámara de comercio (de|del|de la)/gi,
          "",
        ),
      },
      {
        label: "Descripción de sanción",
        value: penalty.sanctionDescription,
      },
      { label: "Nombre de la entidad", value: penalty.entityName },
      { label: "NIT de la entidad", value: penalty.entityNit },
      {
        label: "Dígito de verificación de la entidad",
        value: penalty.entityVerificationDigit,
      },
      { label: "Nombre del proponente", value: penalty.bidderName },
      { label: "NIT del proponente", value: penalty.bidderNit },
      {
        label: "Dígito de verificación del proponente",
        value: penalty.bidderVerificationDigit,
      },
      { label: "Estado", value: penalty.state },
      {
        label: "Fecha del acto de confirmación",
        value: penalty.confirmationActDate,
      },
      {
        label: "Fecha del acto de revocación",
        value: penalty.revocationActDate,
      },
      {
        label: "Fecha del acto de suspensión",
        value: penalty.suspensionActDate,
      },
      { label: "Fecha de ejecutoria", value: penalty.enforcementDate },
      {
        label: "Fecha de inscripción en cámara",
        value: penalty.chamberRegistrationDate,
      },
      { label: "Fundamento legal", value: penalty.legalBasis },
      {
        label: "Municipio de la entidad",
        value: penalty.entityMunicipality,
      },
      {
        label: "Número de acto administrativo",
        value: penalty.administrativeActNumber,
      },
      {
        label: "Número de acto de confirmación",
        value: penalty.confirmationActNumber,
      },
      {
        label: "Número de acto de ejecutoria",
        value: penalty.enforcementActNumber,
      },
      {
        label: "Número de acto de revocación",
        value: penalty.revocationActNumber,
      },
      {
        label: "Número de acto de suspensión",
        value: penalty.suspensionActNumber,
      },
      { label: "Número de contrato", value: penalty.contractNumber },
      {
        label: "Número de inscripción en libro",
        value: penalty.registrationBookNumber,
      },
      { label: "Observaciones", value: penalty.remarks },
      { label: "Seccional de la entidad", value: penalty.entitySectional },
      { label: "Vigencia de la sanción", value: penalty.sanctionValidity },
    ],
  }));
  if (companyPenalties.length === 0) {
    return null;
  }

  return (
    <Section size="2" id="establecimientos-comerciales">
      <Heading as="h3" size="4" mb="4">
        Sanciones
      </Heading>
      <Flex asChild direction="column" gap="2">
        <ul>
          <ExpandableList
            items={companyPenalties.map((penalty) => (
              <li
                key={`${penalty.administrativeActNumber}-${penalty.administrativeActDate}`}
              >
                <details>
                  <Text truncate asChild>
                    <summary>
                      {penalty.administrativeActNumber} del{" "}
                      {penalty.administrativeActDate}
                    </summary>
                  </Text>
                  <Box my="4" pl="4">
                    <DataList items={penalty.details} />
                  </Box>
                </details>
              </li>
            ))}
          />
        </ul>
      </Flex>
    </Section>
  );
}
