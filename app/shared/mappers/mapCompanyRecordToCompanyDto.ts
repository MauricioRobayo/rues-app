import { mapStoreFrontToEstablishmentDto } from "@/app/shared/mappers/mapStoreFrontToBusinessEstablishmentDto";
import type { CompanyDto } from "@/app/[company]/types/CompanyDto";
import { COMPANY_SIZE } from "@/app/shared/lib/constants";
import { decodeBase64 } from "@/app/shared/lib/decodeBase64";
import { formatDetailsDate } from "@/app/shared/lib/formatDetailsDate";
import { formatNit } from "@/app/shared/lib/formatNit";
import { parseEconomicActivities } from "@/app/shared/lib/parseEconomicActivities";
import { slugifyCompanyName } from "@/app/shared/lib/slugifyComponentName";
import { yearsDoingBusinesses } from "@/app/shared/lib/yearsDoingBusinesses";
import type { CompanyRecord } from "@mauriciorobayo/rues-api";
export function mapCompanyRecordToCompanyDto(data: CompanyRecord): CompanyDto {
  return {
    name: data.razon_social,
    slug: `${slugifyCompanyName(data.razon_social)}-${data.numero_identificacion}`,
    nit: Number(data.numero_identificacion),
    fullNit: formatNit(Number(data.numero_identificacion)),
    chamber: { name: data.camara, code: Number(data.codigo_camara) },
    verificationDigit: Number(data.digito_verificacion),
    registrationNumber: data.matricula,
    status: data.estado_matricula,
    isActive: data.estado_matricula === "ACTIVA",
    type: data.tipo_sociedad,
    legalEntityType: data.organizacion_juridica,
    category: data.categoria_matricula,
    registrationDate: formatDetailsDate(data.fecha_matricula),
    yearsDoingBusinesses: yearsDoingBusinesses(data.fecha_matricula),
    lastRenewalYear: Number(data.ultimo_ano_renovado),
    renewalDate: formatDetailsDate(data.fecha_renovacion),
    cancellationDate: formatDetailsDate(data.fecha_cancelacion),
    size: COMPANY_SIZE[data.codigo_tamano_empresa] ?? null,
    address: data.direccion_comercial,
    phoneNumbers: [data.telefono_comercial_1, data.telefono_comercial_2].filter(
      (phoneNumber) => phoneNumber !== undefined,
    ),
    area: data.zona_comercial,
    state: data.dpto_comercial,
    city: data.municipio_comercial,
    scope: decodeBase64(data.objeto_social),
    economicActivities: parseEconomicActivities({
      ciiu1: data.cod_ciiu_act_econ_pri,
      ciiu2: data.cod_ciiu_act_econ_sec,
      ciiu3: data.ciiu3,
      ciiu4: data.ciiu4,
      descCiiu1: data.desc_ciiu_act_econ_pri,
      descCiiu2: data.desc_ciiu_act_econ_sec,
      descCiiu3: data.desc_ciiu3,
      descCiiu4: data.desc_ciiu4,
    }),
    highestRevenueEconomicActivityCode: data.ciiu_mayores_ingresos
      ? data.ciiu_mayores_ingresos.padStart(4, "0")
      : null,
    totalBusinessEstablishments: data.cantidad_establecimientos
      ? Number(data.cantidad_establecimientos)
      : null,
    totalEmployees: data.numero_empleados
      ? Number(data.numero_empleados)
      : null,
    establishments:
      data.establecimientos
        ?.map((establishment) => {
          // https://github.com/MauricioRobayo/rues-app/issues/30
          if (!("razon_social" in establishment)) {
            return null;
          }
          return mapStoreFrontToEstablishmentDto(establishment);
        })
        .filter((establishment) => establishment !== null) ?? [],
  };
}
