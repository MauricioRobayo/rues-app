import type { companies } from "@/app/db/schema";
import type { CompanyRecord } from "@/app/rues/panel";

export function mapCompanyRecordToCompanyModel(
  company: CompanyRecord,
): typeof companies.$inferInsert {
  return {
    name: company.razon_social,
    nit: Number(company.numero_identificacion),
  };
}
