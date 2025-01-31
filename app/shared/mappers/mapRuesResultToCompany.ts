import { formatNit } from "@/app/shared/lib/formatNit";
import { slugifyCompanyName } from "@/app/shared/lib/slugifyComponentName";
import type { BusinessRecord, CompanyRecord } from "@mauriciorobayo/rues-api";

export interface CompanySummary {
  name: string;
  fullNit: string;
  isActive: boolean;
  slug: string;
  nit: string;
}

export interface BusinessSummary extends CompanySummary {
  sigla: string;
  chamberName: string;
  registrationNumber: string;
  lastRenewalYear: string;
}

export function mapRuesResultToCompanySummary(
  record: CompanyRecord,
): CompanySummary;
export function mapRuesResultToCompanySummary(
  record: BusinessRecord,
): BusinessSummary;
export function mapRuesResultToCompanySummary(
  record: BusinessRecord | CompanyRecord,
): BusinessSummary | CompanySummary {
  if (isCompanyRecord(record)) {
    return {
      name: record.razon_social,
      fullNit: formatNit(Number(record.numero_identificacion)),
      isActive: record.estado_matricula === "ACTIVA",
      slug: `/${slugifyCompanyName(record.razon_social)}-${record.numero_identificacion}`,
      nit: record.numero_identificacion,
    };
  }
  return {
    name: record.razon_social,
    fullNit: formatNit(Number(record.nit)),
    isActive: record.estado_matricula === "ACTIVA",
    slug: `/${slugifyCompanyName(record.razon_social)}-${record.nit}`,
    nit: record.nit,
    sigla: record.sigla,
    chamberName: record.nom_camara,
    registrationNumber: record.matricula,
    lastRenewalYear: record.ultimo_ano_renovado,
  };
}

function isCompanyRecord(
  record: BusinessRecord | CompanyRecord,
): record is CompanyRecord {
  return "numero_identificacion" in record;
}
