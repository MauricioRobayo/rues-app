import { formatDetailsDate } from "@/app/lib/formatDetailsDate";
import { getPhoneNumbers } from "@/app/lib/getPhoneNumbers";
import { parseEconomicActivities } from "@/app/lib/parseEconomicActivities";
import type { BusinessEstablishmentDto } from "@/app/types/BusinessEstablishmentDto";
import type { TourismRegistryDto } from "@/app/types/TourismRegistryDto";
import type { StoreFront, TourismRegistry } from "@mauriciorobayo/rues-api";

export function mapStoreFrontToEstablishmentDto(
  data: StoreFront,
): BusinessEstablishmentDto {
  return {
    name: data.razon_social,
    registrationNumber: data.matricula,
    registrationDate: formatDetailsDate(data.fecha_matricula),
    cancellationDate: formatDetailsDate(data.fecha_cancelacion),
    lastRenewalYear: Number(data.ultimo_ano_renovado),
    renewalDate: data.fecha_renovacion
      ? formatDetailsDate(data.fecha_renovacion)
      : null,
    phoneNumbers: getPhoneNumbers(data),
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
    tourismRegistries: data?.rnt?.map(mapTourismRegistryToTourismRegistryDto),
  };
}

export function mapTourismRegistryToTourismRegistryDto(
  data: TourismRegistry,
): TourismRegistryDto {
  return {
    id: data.RNT,
    name: data.RNT_razon_social,
    status: data.RNT_estado,
    lastUpdatedYear: data.RNT_ultimo_ano_actualizado,
    category: data.RNT_categoria,
    subCategory: data.RNT_subCategoria,
    municipality: data.RNT_municipio,
    department: data.RNT_departamento,
    commercialAddress: data.RNT_direccion_comercial,
    landlinePhone: data.RNT_telefono_fijo,
    mobilePhone: data.RNT_telefono_celular,
    notificationMunicipality: data.RNT_municipio_notificacion,
    notificationDepartment: data.RNT_dpto_notificacion,
    notificationAddress: data.RNT_direccion_notificacion,
    notificationPhone: data.RNT_telefono_notificaciones,
    email: data.RNT_correo_electronico,
    employees: data.RNT_empleados,
    providerCompanyName: data.RNT_razon_social_prestador,
    providerNIT: data.RNT_nit_prestador,
    providerDV: data.RNT_dv_prestador,
    legalRepresentative: data.RNT_representante_legal,
    legalRepresentativeId: data.RNT_identificacion_representante_legal,
    providerPhone: data.RNT_telefono_prestador,
    providerEmail: data.RNT_correo_electronico_prestador,
  };
}
