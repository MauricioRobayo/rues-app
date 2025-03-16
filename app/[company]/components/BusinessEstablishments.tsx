import { ActiveDuration } from "@/app/[company]/components/ActiveDuration";
import { DataList } from "@/app/[company]/components/DataList";
import { EconomicActivities } from "@/app/[company]/components/EconomicActivities";
import { ExpandableList } from "@/app/[company]/components/ExpandableList";
import PhoneNumbers from "@/app/[company]/components/PhoneNumbers";
import type { BusinessEstablishmentDto } from "@/app/types/BusinessEstablishmentDto";
import { Flex, Heading, Section, Text } from "@radix-ui/themes";

export function BusinessEstablishments({
  establishments,
}: {
  establishments?: BusinessEstablishmentDto[];
}) {
  const businessEstablishments = (establishments ?? []).map(
    (establishment) => ({
      id: establishment.registrationNumber,
      name: establishment.name,
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
          label: "Fecha de renovación",
          value: establishment.renewalDate,
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
          label: establishment.rawCancellationDate
            ? "Tiempo activo"
            : "Antigüedad",
          value: establishment.rawRegistrationDate ? (
            <ActiveDuration
              registrationDate={establishment.rawRegistrationDate}
              cancellationDate={establishment.rawCancellationDate}
            />
          ) : null,
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
              <EconomicActivities
                activities={establishment.economicActivities}
              />
            ) : null,
        },
      ],
    }),
  );

  if (businessEstablishments.length === 0) {
    return null;
  }

  return (
    <Section size="2" id="establecimientos-comerciales">
      <Heading as="h3" size="4" mb="4">
        Establecimientos Comerciales ({businessEstablishments.length})
      </Heading>
      <Flex asChild direction="column" gap="2">
        <ul>
          <ExpandableList
            visibleItemsCount={25}
            items={businessEstablishments.map((establishment) => {
              return (
                <li key={establishment.id}>
                  <details name="establecimiento-comercial">
                    <Text truncate asChild>
                      <summary>{establishment.name}</summary>
                    </Text>
                    <Flex my="4" pl="4" direction="column" gap="4">
                      <DataList items={establishment.details} />
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
