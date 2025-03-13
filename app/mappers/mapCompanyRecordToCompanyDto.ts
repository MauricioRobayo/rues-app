import { COMPANY_SIZE } from "@/app/lib/constants";
import { decodeBase64 } from "@/app/lib/decodeBase64";
import { formatDetailsDate } from "@/app/lib/formatDetailsDate";
import { formatNit } from "@/app/lib/formatNit";
import { getPhoneNumbers } from "@/app/lib/getPhoneNumbers";
import { isCompanyActive } from "@/app/lib/isCompanyActive";
import { parseEconomicActivities } from "@/app/lib/parseEconomicActivities";
import { slugifyCompanyName } from "@/app/lib/slugifyComponentName";
import { mapPenaltyToPenaltyDto } from "@/app/mappers/mapPenaltyToPenaltyDto";
import { mapStoreFrontToEstablishmentDto } from "@/app/mappers/mapStoreFrontToBusinessEstablishmentDto";
import type { CapitalInformationDto } from "@/app/types/CapitalDto";
import type { CompanyDto } from "@/app/types/CompanyDto";
import type { CompanyNameChangeDto } from "@/app/types/CompanyNameChangeDto";
import type { FinancialInformationDto } from "@/app/types/FinancialInformationDto";
import type { CompanyRecord } from "@mauriciorobayo/rues-api";

export function mapCompanyRecordToCompanyDto(data: CompanyRecord): CompanyDto {
  return {
    name: data.razon_social,
    shortName: data.sigla,
    slug: `${slugifyCompanyName(data.razon_social)}-${data.numero_identificacion}`,
    nit: Number(data.numero_identificacion),
    fullNit: formatNit(data.numero_identificacion),
    chamber: { name: data.camara, code: data.codigo_camara },
    verificationDigit: Number(data.digito_verificacion),
    registrationNumber: data.matricula,
    status: data.estado_matricula,
    isActive: isCompanyActive(data.estado_matricula),
    type: data.tipo_sociedad,
    legalEntityType: data.organizacion_juridica,
    category: data.categoria_matricula,
    registrationDate: formatDetailsDate(data.fecha_matricula),
    rawRegistrationDate: data?.fecha_matricula ?? null,
    rawCancellationDate: data?.fecha_cancelacion ?? null,
    bidderId: data.inscripcion_proponente ? data.inscripcion_proponente : null,
    lastRenewalYear: Number(data.ultimo_ano_renovado),
    renewalDate: formatDetailsDate(data.fecha_renovacion),
    cancellationDate: formatDetailsDate(data.fecha_cancelacion),
    size: COMPANY_SIZE[data.codigo_tamano_empresa] ?? null,
    address: data.direccion_comercial,
    phoneNumbers: getPhoneNumbers(data),
    email: data.correo_electronico_comercial,
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
    establishments: (data.establecimientos ?? [])
      .map(mapStoreFrontToEstablishmentDto)
      .filter((establishment) => establishment !== undefined),
    legalRepresentatives: getLegalRepresentative(data.vinculos),
    financialInformation: getFinancialInformation(data.informacionFinanciera),
    capitalInformation: getCapitalInformation(data.informacionCapitales),
    nameChanges: data.HistoricoCambiosNombre?.map((nameChange) => ({
      date: formatDetailsDate(nameChange.fecha_cambio),
      previousName: nameChange.razon_social_anterior,
      chamberCode: nameChange.codigo_camara ? nameChange.codigo_camara : null,
      registrationNumber: nameChange.matricula ? nameChange.matricula : null,
    })).filter(
      (nameChange): nameChange is CompanyNameChangeDto =>
        !!nameChange.previousName &&
        !!nameChange.date &&
        !!nameChange.chamberCode &&
        !!nameChange.registrationNumber,
    ),
    penalties: data.sanciones?.map(mapPenaltyToPenaltyDto),
  };
}

function getLegalRepresentative(data: CompanyRecord["vinculos"]) {
  const typeMapping: Record<string, "principal" | "suplente"> = {
    "01": "principal",
    "02": "suplente",
  };
  return (data ?? [])
    .map((item) => {
      const type = typeMapping[item.codigo_tipo_vinculo];
      if (!type) {
        return null;
      }
      return {
        type,
        name: item.nombre,
      } as const;
    })
    .filter((item) => item !== null)
    .toSorted((a, b) =>
      a.type === "principal" && b.type !== "principal" ? -1 : 1,
    );
}

function getFinancialInformation(
  data?: CompanyRecord["informacionFinanciera"],
): FinancialInformationDto[] {
  return (data ?? []).map((info) => ({
    financialYear: Number(info.ano_informacion_financiera ?? ""),
    currentAssets: Number(info.activo_corriente ?? ""),
    nonCurrentAssets: info.activo_no_corriente
      ? Number(info.activo_no_corriente)
      : undefined,
    totalAssets: Number(info.activo_total ?? ""),
    currentLiabilities: Number(info.pasivo_corriente ?? ""),
    nonCurrentLiabilities: info.pasivo_no_corriente
      ? Number(info.pasivo_no_corriente)
      : undefined,
    totalLiabilities: Number(info.pasivo_total ?? ""),
    netEquity: Number(info.patrimonio_neto ?? ""),
    liabilitiesAndEquity: info.pasivo_mas_patrimonio
      ? Number(info.pasivo_mas_patrimonio)
      : undefined,
    socialBalance: info.balance_social
      ? Number(info.balance_social)
      : undefined,
    ordinaryActivityIncome: Number(info.ingresos_actividad_ordinaria ?? ""),
    otherIncome: Number(info.otros_ingresos ?? ""),
    costOfSales: Number(info.costo_ventas ?? ""),
    operatingExpenses: Number(info.gastos_operacionales ?? ""),
    otherExpenses: Number(info.otros_gastos ?? ""),
    taxExpenses: info.gastos_impuestos
      ? Number(info.gastos_impuestos)
      : undefined,
    operatingProfitOrLoss: Number(info.utilidad_perdida_operacional ?? ""),
    periodResult: Number(info.resultado_del_periodo ?? ""),
    privateForeignEquity: Number(info.capital_social_extranjero_privado ?? ""),
    publicForeignEquity: Number(info.capital_social_extranjero_publico ?? ""),
    privateNationalEquity: Number(info.capital_social_nacional_privado ?? ""),
    publicNationalEquity: Number(info.capital_social_nacional_publico ?? ""),
  }));
}

function getCapitalInformation(
  data: CompanyRecord["informacionCapitales"],
): CapitalInformationDto[] {
  return (data ?? []).map((info) => ({
    capitalModificationDate: Number(info.fecha_modificacion_capital ?? ""),
    shareCapital: Number(info.capital_social ?? ""),
    authorizedCapital: Number(info.capital_autorizado ?? ""),
    subscribedCapital: Number(info.capital_suscrito ?? ""),
    paidCapital: Number(info.capital_pagado ?? ""),
  }));
}
