import type { BusinessRecord } from "@mauriciorobayo/rues-api";

export function mapRegistryToCompany(businessRecord: BusinessRecord) {
  return {
    documentType: businessRecord.tipo_documento,
    nit: businessRecord.nit,
    verificationDigit: businessRecord.dv,
    registrationId: businessRecord.id_rm,
    businessName: businessRecord.razon_social,
    chamberCode: businessRecord.cod_camara,
    chamberName: businessRecord.nom_camara,
    registrationNumber: businessRecord.matricula,
    legalOrganization: businessRecord.organizacion_juridica,
    registrationStatus: businessRecord.estado_matricula,
    lastRenewedYear: businessRecord.ultimo_ano_renovado,
    category: businessRecord.categoria,
  };
}
