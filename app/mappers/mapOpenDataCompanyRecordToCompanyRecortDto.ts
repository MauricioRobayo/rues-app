import { formatDetailsDate } from "@/app/lib/formatDetailsDate";
import { formatNit } from "@/app/lib/formatNit";
import { parseEconomicActivities } from "@/app/lib/parseEconomicActivities";
import { slugifyCompanyName } from "@/app/lib/slugifyComponentName";
import { legalEntity } from "@/app/services/openData/constants";
import type { OpenDataCompanyRecord } from "@/app/services/openData/types";
import type { CompanyRecordDto } from "@/app/types/CompanyRecordDto";
import { getVerificationDigit } from "nit-verifier";

export function mapOpenDataCompanyRecordToCompanyRecordDto(
  data: OpenDataCompanyRecord,
  index: number,
): CompanyRecordDto {
  return {
    isMain: index === 0,
    name: data.razon_social,
    nit: Number(data.nit),
    formattedFullNit: formatNit(data.nit, { showDecimalSeparator: true }),
    fullNit: formatNit(data.nit, { showDecimalSeparator: false }),
    slug: `${slugifyCompanyName(data.razon_social)}-${data.nit}`,
    bidderId: Number(data.inscripcion_proponente)
      ? String(Number(data.inscripcion_proponente))
      : null,
    category: data.categoria_matricula,
    chamber: {
      name: data.camara_comercio,
      code: data.codigo_camara,
    },
    economicActivities: parseEconomicActivities({
      ciiu1: data.cod_ciiu_act_econ_pri,
      ciiu2: data.cod_ciiu_act_econ_sec,
      ciiu3: data.ciiu3,
      ciiu4: data.ciiu4,
    }),
    isActive: isCompanyRecordActive(data),
    lastRenewalYear: Number(data.ultimo_ano_renovado),
    type: data.tipo_sociedad,
    legalRepresentative: getLegalRepresentative(data),
    cancellationDate: formatDetailsDate(data.fecha_cancelacion),
    registrationDate: formatDetailsDate(data.fecha_matricula),
    renewalDate: formatDetailsDate(data.fecha_renovacion),
    updatedDate: formatDetailsDate(data.fecha_actualizacion),
    rawRegistrationDate: data.fecha_matricula,
    rawCancellationDate: data.fecha_cancelacion,
    isLegalEntity:
      data.codigo_organizacion_juridica !== legalEntity.PERSONA_NATURAL,
    registrationNumber: data.matricula || "",
    shortName: data.sigla,
    status: data.estado_matricula,
    verificationDigit: getVerificationDigit(data.nit),
    idType: data.clase_identificacion,
  };
}

function getLegalRepresentative(data: OpenDataCompanyRecord) {
  return data.representante_legal
    ? ({
        name: data.representante_legal,
        id: data.num_identificacion_representante_legal,
        idType: data.clase_identificacion_rl,
      } as const)
    : null;
}

function isCompanyRecordActive(data: OpenDataCompanyRecord) {
  if (data.fecha_cancelacion || /cancel/i.test(data.estado_matricula)) {
    return false;
  }
  return true;
}
