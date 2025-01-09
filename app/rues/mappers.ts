import type { companies } from "@/app/db/schema";
import type { CompanyRecord } from "@/app/rues/panel";

export function mapCompanyRecordToCompanyModel(
  company: CompanyRecord
): typeof companies.$inferInsert {
  return {
    legalEntity: company.org_juridica,
    category: company.categoria,
    registrationDate: new Date(company.fecha_matricula),
    businessName: company.razon_social,
    documentType: company.tipo_identificacion,
    nit: Number(company.numero_identificacion),
    economicActivity1: company.actividad_economica,
    economicActivity2: company.actividad_economica2 || null,
    economicActivity3: company.actividad_economica3 || null,
    economicActivity4: company.actividad_economica4 || null,
    companySize: company.desc_tamano_empresa,
    businessAddress: company.direccion_comercial,
    city: company.municipio,
    state: company.departamento,
  };
}
