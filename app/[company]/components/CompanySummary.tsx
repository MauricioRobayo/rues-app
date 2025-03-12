import type { CompanyDto } from "@/app/types/CompanyDto";
import { Text } from "@radix-ui/themes";

export function CompanySummary({ company }: { company: CompanyDto }) {
  return <Text>{companySummary(company)}</Text>;
}

export function companySummary(company: CompanyDto) {
  let summary = `${company.name} NIT ${company.fullNit}`;

  if (company.shortName) {
    summary += ` (${company.shortName})`;
  }

  if (company.size) {
    const companySize = company.size.toLocaleUpperCase();
    if (companySize.includes("EMPRESA")) {
      summary += ` es una ${companySize}`;
    } else {
      summary += ` es una ${companySize} EMPRESA`;
    }
  } else {
    summary += ` es una empresa`;
  }

  if (!company.isActive) {
    summary += ` ${company.status}`;
    if (company.cancellationDate) {
      summary += ` que operó hasta el ${company.cancellationDate},`;
    }
  }

  if (company.city) {
    summary += ` ubicada en ${company.city}`;
  }

  if (company.state) {
    summary += `, ${company.state}`;
  }

  if (company.address) {
    summary += `. Su dirección comercial es ${company.address}`;
  }

  if (company.phoneNumbers?.[0]) {
    summary += ` y su teléfono de contacto es ${company.phoneNumbers[0]}`;
  }

  if (company.isActive && company.registrationDate) {
    summary += `. Fundada el ${company.registrationDate}`;
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

  if (company.totalEmployees || company.totalBusinessEstablishments) {
    summary += ". Cuenta con";
    const totals: string[] = [];
    if (company.totalEmployees) {
      totals.push(
        ` ${company.totalEmployees} empleado${company.totalEmployees === 1 ? "" : "s"}`,
      );
    }
    if (company.totalBusinessEstablishments) {
      totals.push(
        ` ${company.totalBusinessEstablishments} establecimiento${company.totalBusinessEstablishments === 1 ? "" : "s"} comercial${company.totalBusinessEstablishments === 1 ? "" : "es"}`,
      );
    }
    summary += totals.join(" y");
  }

  return `${summary}.`;
}
