import { formatDetailsDate } from "@/app/lib/formatDetailsDate";
import { parseEconomicActivities } from "@/app/lib/parseEconomicActivities";
import type { OpenDataEstablishment } from "@/app/services/openData/types";
import type { BusinessEstablishmentDto } from "@/app/types/BusinessEstablishmentDto";

export function mapOpenDataEstablishmentToBusinessEstablishmentDto(
  data: OpenDataEstablishment,
): BusinessEstablishmentDto {
  return {
    name: data.razon_social,
    category: data.categoria_matricula,
    registrationNumber: data.matricula,
    cancellationDate: formatDetailsDate(data.fecha_cancelacion),
    rawCancellationDate: data.fecha_cancelacion,
    lastRenewalYear: Number(data.ultimo_ano_renovado),
    status: data.estado_matricula,
    renewalDate: formatDetailsDate(data.fecha_renovacion),
    economicActivities: parseEconomicActivities({
      ciiu1: data.cod_ciiu_act_econ_pri,
      ciiu2: data.cod_ciiu_act_econ_sec,
      ciiu3: data.ciiu3,
      ciiu4: data.ciiu4,
    }),
  };
}
