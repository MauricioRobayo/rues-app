import type { CompanySummary } from "@/app/shared/component/CompanyCard";
import { formatNit } from "@/app/shared/lib/formatNit";
import { slugifyCompanyName } from "@/app/shared/lib/slugifyComponentName";
import type { BusinessRecord } from "@mauriciorobayo/rues-api";

export function mapRuesResultToCompanySummary(
  ruesResult: BusinessRecord,
): CompanySummary {
  return {
    name: ruesResult.razon_social,
    fullNit: formatNit(Number(ruesResult.nit)),
    isActive: ruesResult.estado_matricula === "ACTIVA",
    slug: `/${slugifyCompanyName(ruesResult.razon_social)}-${ruesResult.nit}`,
    nit: ruesResult.nit,
  };
}
