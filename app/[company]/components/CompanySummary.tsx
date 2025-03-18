import { getBusinessEstablishmentsCached } from "@/app/[company]/components/BusinessEstablishments";
import type { CompanyRecordDto } from "@/app/types/CompanyRecordDto";
import { Text } from "@radix-ui/themes";

export async function CompanySummary({
  company,
}: {
  company: CompanyRecordDto;
}) {
  const summary = await companySummary(company);
  return <Text>{summary}</Text>;
}

export async function companySummary(company: CompanyRecordDto) {
  const establishments = await getBusinessEstablishmentsCached(
    company.chamber.code,
    company.registrationNumber,
  );
  const establishmentsCount = establishments.length;

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

  if (establishmentsCount > 0) {
    summary += `. Cuenta con ${establishmentsCount} establecimiento${establishmentsCount === 1 ? "" : "s"} comercial${establishmentsCount === 1 ? "" : "es"}`;
  }

  return `${summary}.`;
}
