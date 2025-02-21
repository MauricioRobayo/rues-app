import type { CompanyDto } from "@/app/types/CompanyDto";
import { Text } from "@radix-ui/themes";

export function CompanyDescription({ company }: { company: CompanyDto }) {
  return <Text>{companyDescription(company)}</Text>;
}

export function companyDescription(company: CompanyDto) {
  let description = `${company.name} NIT ${company.fullNit}`;

  if (company.size) {
    const companySize = company.size.toLocaleUpperCase();
    if (companySize.includes("EMPRESA")) {
      description += ` es una ${companySize}`;
    } else {
      description += ` es una ${companySize} EMPRESA`;
    }
  } else {
    description += " es una empresa";
  }

  if (company.city) {
    description += ` ubicada en ${company.city}`;
  }

  if (company.state) {
    description += `, ${company.state}`;
  }

  if (company.address) {
    description += `. Su dirección comercial es ${company.address}`;
  }

  if (company.phoneNumbers?.[0]) {
    description += ` y su teléfono de contacto es ${company.phoneNumbers[0]}`;
  }

  description += `. Fundada hace ${company.yearsDoingBusinesses}`;

  if (company.chamber?.name) {
    description += ` y registrada en la cámara de comercio de ${company.chamber.name}`;
  }

  if (company.economicActivities && company.economicActivities.length > 0) {
    const mainEconomicActivity = company.economicActivities[0];
    description += `. Su principal actividad económica corresponde al código CIIU ${mainEconomicActivity.code}: ${mainEconomicActivity.description}`;
  }

  if (company.totalEmployees || company.totalBusinessEstablishments) {
    description += ". Cuenta con";
    const totals: string[] = [];
    if (company.totalEmployees) {
      totals.push(
        ` ${company.totalEmployees} empleado${company.totalEmployees === 1 ? "" : "s"}`,
      );
    }
    if (company.totalBusinessEstablishments) {
      totals.push(
        `${company.totalBusinessEstablishments} establecimiento${company.totalBusinessEstablishments === 1 ? "" : "s"} comercial${company.totalBusinessEstablishments === 1 ? "" : "es"}`,
      );
    }
    description += totals.join(" y ");
  }

  return `${description}.`;
}
