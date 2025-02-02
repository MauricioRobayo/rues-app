import { BusinessEstablishmentDto } from "@/app/[company]/types/BusinessEstablishmentDto";
import { formatDetailsDate } from "@/app/shared/lib/formatDetailsDate";
import { parseEconomicActivities } from "@/app/shared/lib/parseEconomicActivities";
import { yearsDoingBusinesses } from "@/app/shared/lib/yearsDoingBusinesses";
import type { StoreFront } from "@mauriciorobayo/rues-api";

export function mapStoreFrontToEstablishmentDto(
  data: StoreFront,
): BusinessEstablishmentDto {
  return {
    name: data.razon_social,
    registrationNumber: data.matricula,
    registrationDate: formatDetailsDate(data.fecha_matricula),
    yearsDoingBusinesses: yearsDoingBusinesses(data.fecha_matricula),
    cancellationDate: formatDetailsDate(data.fecha_cancelacion),
    lastRenewalYear: Number(data.ultimo_ano_renovado),
    renewalDate: formatDetailsDate(data.fecha_renovacion),
    phoneNumbers: [data.telefono_comercial_1, data.telefono_comercial_2].filter(
      (phoneNumber) => typeof phoneNumber === "string",
    ),
    address: data.direccion_comercial,
    economicActivityDescription: data.desc_Act_Econ,
    economicActivities: parseEconomicActivities({
      ciiu1: data.ciiu1,
      ciiu2: data.ciiu2,
      ciiu3: data.ciiu3,
      ciiu4: data.ciiu4,
      descCiiu1: data.desc_ciiu1,
      descCiiu2: data.desc_ciiu2,
      descCiiu3: data.desc_ciiu3,
      descCiiu4: data.desc_ciiu4,
    }),
  };
}
