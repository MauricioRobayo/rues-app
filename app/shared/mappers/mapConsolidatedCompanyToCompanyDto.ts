import { mapBusinessEstablishmentToBusinessEstablishmentDto } from "@/app/shared/mappers/mapBusinessEstablishmentToBusinessEstablishmentDto";
import type { CompanyDto } from "@/app/[company]/types/CompanyDto";
import { formatDetailsDate } from "@/app/shared/lib/formatDetailsDate";
import { formatNit } from "@/app/shared/lib/formatNit";
import { parseEconomicActivities } from "@/app/shared/lib/parseEconomicActivities";
import { slugifyCompanyName } from "@/app/shared/lib/slugifyComponentName";
import { yearsDoingBusinesses } from "@/app/shared/lib/yearsDoingBusinesses";
import type { ConsolidatedCompanyInfo as ConsolidatedCompany } from "@/app/shared/services/rues/api";

export function mapConsolidatedCompanyToCompanyDto({
  rues,
  company,
  details,
  establishments,
  siis,
}: ConsolidatedCompany): CompanyDto {
  return {
    name: rues.razon_social,
    slug: `${slugifyCompanyName(rues.razon_social)}-${rues.nit}`,
    nit: Number(rues.nit),
    fullNit: formatNit(Number(rues.nit)),
    verificationDigit: Number(rues.dv),
    chamber: { name: rues.nom_camara, code: Number(rues.cod_camara) },
    registrationNumber: rues.matricula,
    status: rues.estado_matricula,
    isActive: rues.estado_matricula === "ACTIVA",
    legalEntityType: rues.organizacion_juridica,
    shortName: rues.sigla,
    registrationDate: formatDetailsDate(details?.fecha_matricula ?? ""),
    yearsDoingBusinesses: yearsDoingBusinesses(details?.fecha_matricula ?? ""),
    renewalDate: formatDetailsDate(details?.fecha_renovacion ?? ""),
    updatedDate: formatDetailsDate(details?.fecha_actualizacion ?? ""),
    cancellationDate: formatDetailsDate(details?.fecha_cancelacion ?? ""),
    lastRenewalYear: rues?.ultimo_ano_renovado
      ? Number(rues?.ultimo_ano_renovado)
      : null,
    type: details?.tipo_sociedad,
    size: company?.size ?? null,
    address: company?.address ?? null,
    area: siis?.region,
    state: siis?.departamento,
    city: siis?.ciudad,
    broadIndustry: siis?.macroSector,
    industry: siis?.sector,
    economicActivities: parseEconomicActivities({
      ciiu1: details?.cod_ciiu_act_econ_pri,
      ciiu2: details?.cod_ciiu_act_econ_sec,
      ciiu3: details?.ciiu3,
      ciiu4: details?.ciiu4,
      descCiiu1: details?.desc_ciiu_act_econ_pri,
      descCiiu2: details?.desc_ciiu_act_econ_sec,
      descCiiu3: details?.desc_ciiu3,
      descCiiu4: details?.desc_ciiu4,
    }),
    establishments: (establishments ?? []).map(
      mapBusinessEstablishmentToBusinessEstablishmentDto,
    ),
  };
}
