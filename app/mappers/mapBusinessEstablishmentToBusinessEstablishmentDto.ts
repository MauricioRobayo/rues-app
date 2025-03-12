import { formatDetailsDate } from "@/app/lib/formatDetailsDate";
import type { BusinessEstablishmentDto } from "@/app/types/BusinessEstablishmentDto";
import type { BusinessEstablishment } from "@mauriciorobayo/rues-api";

export function mapBusinessEstablishmentToBusinessEstablishmentDto(
  data: BusinessEstablishment,
): BusinessEstablishmentDto {
  return {
    name: data.RAZON_SOCIAL,
    shortName: data.SIGLA,
    registrationNumber: data.MATRICULA,
    type: data.DESC_TIPO_SOCIEDAD,
    legalEntity: data.DESC_ORGANIZACION_JURIDICA,
    category: data.CATEGORIA_MATRICULA,
    status: data.DESC_ESTADO_MATRICULA,
    registrationDate: formatDetailsDate(data.FECHA_MATRICULA),
    renewalDate: formatDetailsDate(data.FECHA_RENOVACION),
    lastRenewalYear: Number(data.ULTIMO_ANO_RENOVADO),
  };
}
