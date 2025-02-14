import type { CompanyDto } from "@/app/types/CompanyDto";

export function companyDescription(company: CompanyDto) {
  let description = `${company.name} con NIT ${company.fullNit}`;

  if (company.size) {
    if (company.size.toLowerCase().includes("empresa")) {
      description += ` es una ${company.size}`;
    } else {
      description += ` es una ${company.size} empresa`;
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

  description += ` fundada hace ${company.yearsDoingBusinesses}.`;

  if (company.economicActivities && company.economicActivities.length > 0) {
    const mainEconomicActivity = company.economicActivities[0];
    description += ` Su principal actividad económica corresponde al código CIIU ${mainEconomicActivity}: ${mainEconomicActivity} `;
  }
  return description;
}
