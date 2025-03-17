import type { CompanyDto } from "@/app/types/CompanyRecordDto";
import { Text } from "@radix-ui/themes";

export function CompanySummary({ company }: { company: CompanyDto }) {
  return <Text>{companySummary(company)}</Text>;
}

export function companySummary(company: CompanyDto) {
  let summary = company.name;

  if (company.shortName) {
    summary += ` (${company.shortName})`;
  }

  summary += ` NIT ${company.fullNit}`;

  if (company.type) {
    summary += ` es una ${company.type}`;
  }

  summary += ` en estado ${company.status}`;
  if (company.cancellationDate) {
    summary += ` que operó hasta el ${company.cancellationDate}`;
  }

  if (company.isActive && company.registrationDate) {
    summary += `. Fue fundada el ${company.registrationDate}`;
  }

  if (company.chamber?.name) {
    if (company.isActive) {
      summary += ` y registrada en la cámara de comercio de ${company.chamber.name}`;
    } else {
      summary += `. Registrada en la cámara de comercio de ${company.chamber.name}.`;
      return summary;
    }
  }

  if (company.economicActivities && company.economicActivities.length > 0) {
    const mainEconomicActivity = company.economicActivities[0];
    summary += `. Su principal actividad económica corresponde al código CIIU ${mainEconomicActivity.code}: ${mainEconomicActivity.description}`;
  }

  const establishments = company.establishments ?? [];

  if (establishments.length > 0) {
    summary += `. Cuenta con ${establishments.length} establecimiento${establishments.length === 1 ? "" : "s"} comercial${establishments.length === 1 ? "" : "es"}`;
  }

  return `${summary}.`;
}
