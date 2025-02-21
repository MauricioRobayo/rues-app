import { DataList } from "@/app/[company]/components/DataList";
import { EconomicActivities } from "@/app/[company]/components/EconomicActivities";
import { ExpandableList } from "@/app/[company]/components/ExpandableList";
import PhoneNumbers from "@/app/[company]/components/PhoneNumbers";
import { ToggleContent } from "@/app/[company]/components/ToogleContent";
import type { BusinessEstablishmentDto } from "@/app/types/BusinessEstablishmentDto";
import { Box, Code, Flex, Heading, Link, Section } from "@radix-ui/themes";

export function BusinessEstablishments({
  establishments,
}: {
  establishments?: BusinessEstablishmentDto[];
}) {
  const businessEstablishments = establishments?.map((establishment) => ({
    id: establishment.registrationNumber,
    name: establishment.name,
    tourismRegistries: (establishment.tourismRegistries ?? []).map(
      (registry) => ({
        id: registry.id,
        details: [
          { label: "RNT", value: <Code variant="ghost">{registry.id}</Code> },
          { label: "Nombre", value: registry.name },
          { label: "Estado", value: registry.status },
          { label: "Último año actualizado", value: registry.lastUpdatedYear },
          { label: "Categoría", value: registry.category },
          { label: "Subcategoría", value: registry.subCategory },
          { label: "Municipio", value: registry.municipality },
          { label: "Departamento", value: registry.department },
          { label: "Dirección comercial", value: registry.commercialAddress },
          { label: "Teléfono fijo", value: registry.landlinePhone },
          { label: "Teléfono celular", value: registry.mobilePhone },
          {
            label: "Municipio de notificación",
            value: registry.notificationMunicipality,
          },
          {
            label: "Departamento de notificación",
            value: registry.notificationDepartment,
          },
          {
            label: "Dirección de notificación",
            value: registry.notificationAddress,
          },
          {
            label: "Teléfono de notificación",
            value: registry.notificationPhone ? (
              <Link href={`tel:${registry.notificationPhone}`}>
                {registry.notificationPhone}
              </Link>
            ) : null,
          },
          {
            label: "Correo electrónico",
            value: registry.email ? (
              <Box>
                <ToggleContent label="Ver correo electrónico">
                  <Link href={`mailto:${registry.email}`}>
                    {registry.email}
                  </Link>
                </ToggleContent>
              </Box>
            ) : null,
          },
          { label: "Número de empleados", value: registry.employees },
          {
            label: "Nombre del prestador",
            value: registry.providerCompanyName,
          },
          {
            label: "NIT del prestador",
            value: <Code variant="ghost">{registry.providerNIT}</Code>,
          },
          {
            label: "DV del prestador",
            value: registry.providerDV && (
              <Code variant="ghost">{registry.providerDV}</Code>
            ),
          },
          { label: "Representante legal", value: registry.legalRepresentative },
          {
            label: "Identificación del representante legal",
            value: registry.legalRepresentativeId,
          },
          {
            label: "Teléfono del prestador",
            value: registry.providerPhone ? (
              <Link href={`tel:${registry.providerPhone}`}>
                {registry.providerPhone}
              </Link>
            ) : null,
          },
          {
            label: "Correo electrónico del prestador",
            value: registry.email ? (
              <Box>
                <ToggleContent label="Ver correo electrónico">
                  <Link href={`mailto:${registry.email}`}>
                    {registry.email}
                  </Link>
                </ToggleContent>
              </Box>
            ) : null,
          },
        ],
      }),
    ),
    details: [
      {
        label: "Razón social",
        value: establishment.name,
      },
      {
        label: "Matrícula",
        value: establishment.registrationNumber,
      },
      {
        label: "Fecha de matrícula",
        value: establishment.registrationDate,
      },
      {
        label: "Antigüedad",
        value: establishment.yearsDoingBusinesses,
      },
      {
        label: "Fecha de cancelación",
        value: establishment.cancellationDate,
      },
      {
        label: "Último año renovado",
        value: establishment.lastRenewalYear,
      },
      {
        label: "Fecha de renovación",
        value: establishment.renewalDate,
      },
      {
        label: "Teléfono",
        value:
          establishment.phoneNumbers &&
          establishment.phoneNumbers.length > 0 ? (
            <PhoneNumbers phoneNumbers={establishment.phoneNumbers} />
          ) : null,
      },
      {
        label: "Dirección comercial",
        value: establishment.address,
      },
      {
        label: "Descripción actividad económica",
        value: establishment.economicActivityDescription,
      },
      {
        label: "Actividad económica",
        value:
          establishment.economicActivities &&
          establishment.economicActivities.length > 0 ? (
            <EconomicActivities activities={establishment.economicActivities} />
          ) : null,
      },
    ],
  }));

  if (!businessEstablishments) {
    return null;
  }

  return (
    <Section size="2" id="establecimientos-comerciales">
      <Heading as="h3" size="4" mb="4">
        Establecimientos Comerciales
      </Heading>
      <Flex asChild direction="column" gap="2">
        <ul>
          <ExpandableList
            initialVisibleCount={25}
            items={businessEstablishments.map((establishment) => {
              return (
                <li
                  key={
                    establishment.id ??
                    establishment.tourismRegistries.at(0)?.id
                  }
                >
                  <details>
                    <summary>
                      {establishment.name ??
                        `RNT ${establishment.tourismRegistries.at(0)?.id}`}
                    </summary>
                    <Flex my="4" pl="4" direction="column" gap="4">
                      <DataList items={establishment.details} />
                      {(establishment.tourismRegistries ?? []).map(
                        (registry) => (
                          <Flex key={registry.id} direction="column" gap="4">
                            <Heading as="h4" size="4">
                              Registro Nacional de Turismo
                            </Heading>
                            <DataList items={registry.details} />
                          </Flex>
                        ),
                      )}
                    </Flex>
                  </details>
                </li>
              );
            })}
          />
        </ul>
      </Flex>
    </Section>
  );
}
