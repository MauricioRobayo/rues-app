import { getChamberRecordCached } from "@/app/[company]/components/AdditionalRecordInformation";
import { getBusinessEstablishmentsCached } from "@/app/[company]/components/BusinessEstablishments";
import type { CompanyRecordDto } from "@/app/types/CompanyRecordDto";
import { Text, Box, type BoxProps } from "@radix-ui/themes";

export async function CompanySummary({
  company,
  ...boxProps
}: {
  company: CompanyRecordDto;
} & BoxProps) {
  const summary = await companySummary(company);
  return (
    <Box {...boxProps}>
      <Text>{summary}</Text>
    </Box>
  );
}

export async function companySummary(company: CompanyRecordDto) {
  const establishments = await getBusinessEstablishmentsCached(
    company.chamber.code,
    company.registrationNumber,
  );
  const chamberInfo = await getChamberRecordCached(company);

  const establishmentsCount = establishments.length;

  let summary = company.name;

  if (company.shortName) {
    summary += ` (${company.shortName})`;
  }

  summary += ` con NIT ${company.formattedFullNit}`;

  if (chamberInfo?.size) {
    const companySize = chamberInfo?.size.toLocaleUpperCase();
    if (companySize.includes("EMPRESA")) {
      summary += ` es una ${companySize}`;
    } else {
      summary += ` es una ${companySize} EMPRESA`;
    }
  } else if (company.type) {
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
      summary += `. Registrada en la cámara de comercio de ${company.chamber.name}`;
      return summary;
    }
  }

  if (chamberInfo?.address) {
    summary += ". Su dirección comercial";
    if (chamberInfo?.city) {
      summary += ` en la ciudad de ${chamberInfo?.city}`;
    }
    summary += ` es ${chamberInfo?.address}`;
  }

  if (chamberInfo?.phoneNumbers?.[0]) {
    summary += ` y su teléfono de contacto es ${chamberInfo?.phoneNumbers[0]}`;
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
