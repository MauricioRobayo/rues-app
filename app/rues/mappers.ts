import type { companies } from "@/app/db/schema";
import type { CompanyRecord } from "@/app/rues/panel";

export function mapCompanyRecordToCompanyModel(
  company: CompanyRecord
): typeof companies.$inferInsert {
  const companySizes: Record<string, number> = {
    "NO DETERMINADO": 0,
    MICRO: 1,
    PEQUEÑA: 2,
    MEDIANA: 3,
    GRANDE: 4,
  };
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
    companySize: companySizes[company.desc_tamano_empresa] ?? 0,
    businessAddress: company.direccion_comercial,
  };
}
