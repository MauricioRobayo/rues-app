import { formatDetailsDate } from "@/app/lib/formatDetailsDate";
import { isCompanyActive } from "@/app/lib/isCompanyActive";
import { parseEconomicActivities } from "@/app/lib/parseEconomicActivities";
import { slugifyCompanyName } from "@/app/lib/slugifyComponentName";
import type { OpenDataCompany } from "@/app/services/openData/types";
import type { CompanyDto } from "@/app/types/CompanyDto";
import { getVerificationDigit } from "nit-verifier";

export function mapOpenDataCompanyToCompanyDto(
  data: OpenDataCompany,
): CompanyDto {
  return {
    name: data.razon_social,
    nit: Number(data.numero_identificacion),
    fullNit: `${data.numero_identificacion}-${data.digito_verificacion || ""}`,
    slug: `${slugifyCompanyName(data.razon_social)}-${data.numero_identificacion}`,
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
    isActive: isCompanyActive(data.estado_matricula),
    lastRenewalYear: Number(data.ultimo_ano_renovado),
    type: data.tipo_sociedad,
    legalRepresentatives: getLegalRepresentative(data),
    cancellationDate: formatDetailsDate(data.fecha_cancelacion),
    registrationDate: formatDetailsDate(data.fecha_matricula),
    renewalDate: formatDetailsDate(data.fecha_renovacion),
    updatedDate: data.fecha_actualizacion,
    rawRegistrationDate: data.fecha_matricula,
    rawCancellationDate: data.fecha_cancelacion,
    registrationNumber: data.matricula || "",
    shortName: data.sigla,
    status: data.estado_matricula,
    verificationDigit: getVerificationDigit(data.numero_identificacion),
    idType: data.clase_identificacion,
  };
}

function getLegalRepresentative(data: OpenDataCompany) {
  return data.representante_legal
    ? [
        {
          type: "principal",
          name: data.representante_legal,
          id: data.num_identificacion_representante_legal,
          idType: data.clase_identificacion_rl,
        } as const,
      ]
    : [];
}
