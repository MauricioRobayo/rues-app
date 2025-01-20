import type { CompanyRecord } from "@/app/api/rues-sync/services/rues";
import type { companies } from "@/app/db/schema";

export function mapCompanyRecordToCompanyModel(
  company: CompanyRecord,
): typeof companies.$inferInsert {
  return {
    name: company.razon_social,
    nit: Number(company.numero_identificacion),
    address: company.direccion_comercial,
    city: company.municipio,
    state: company.departamento,
    size: company.desc_tamano_empresa,
  };
}
