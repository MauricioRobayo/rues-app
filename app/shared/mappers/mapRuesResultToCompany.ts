import type { CompanySummary } from "@/app/shared/component/CompanyCard";
import { formatNit } from "@/app/shared/lib/formatNit";
import { slugifyCompanyName } from "@/app/shared/lib/slugifyComponentName";
import type { BusinessRecord, CompanyRecord } from "@mauriciorobayo/rues-api";

export function mapRuesResultToCompanySummary(
  ruesResult: BusinessRecord | CompanyRecord,
): CompanySummary {
  if (isCompanyRecord(ruesResult)) {
    return {
      name: ruesResult.razon_social,
      fullNit: formatNit(Number(ruesResult.numero_identificacion)),
      isActive: ruesResult.estado_matricula === "ACTIVA",
      slug: `/${slugifyCompanyName(ruesResult.razon_social)}-${ruesResult.numero_identificacion}`,
      nit: ruesResult.numero_identificacion,
    };
  }
  return {
    name: ruesResult.razon_social,
    fullNit: formatNit(Number(ruesResult.nit)),
    isActive: ruesResult.estado_matricula === "ACTIVA",
    slug: `/${slugifyCompanyName(ruesResult.razon_social)}-${ruesResult.nit}`,
    nit: ruesResult.nit,
  };
}

function isCompanyRecord(
  record: BusinessRecord | CompanyRecord,
): record is CompanyRecord {
  return "numero_identificacion" in record;
}
