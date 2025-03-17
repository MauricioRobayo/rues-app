import { openDataClient } from "@/app/services/openData/client";
import type {
  OpenDataCompanyRecord,
  OpenDataEstablishment,
} from "@/app/services/openData/types";

const openDataFields = {
  companies: [
    "codigo_camara",
    "camara_comercio",
    "matricula",
    "inscripcion_proponente",
    "razon_social",
    "primer_apellido",
    "segundo_apellido",
    "primer_nombre",
    "segundo_nombre",
    "sigla",
    "codigo_clase_identificacion",
    "clase_identificacion",
    "nit",
    "digito_verificacion",
    "cod_ciiu_act_econ_pri",
    "cod_ciiu_act_econ_sec",
    "ciiu3",
    "ciiu4",
    "fecha_matricula",
    "fecha_renovacion",
    "ultimo_ano_renovado",
    "fecha_vigencia",
    "fecha_cancelacion",
    "codigo_tipo_sociedad",
    "tipo_sociedad",
    "codigo_organizacion_juridica",
    "organizacion_juridica",
    "codigo_categoria_matricula",
    "categoria_matricula",
    "codigo_estado_matricula",
    "estado_matricula",
    "clase_identificacion_rl",
    "num_identificacion_representante_legal",
    "representante_legal",
    "fecha_actualizacion",
  ] as const,
  establishments: [
    "codigo_camara",
    "camara_comercio",
    "matricula",
    "ultimo_ano_renovado",
    "fecha_renovacion",
    "razon_social",
    "codigo_estado_matricula",
    "estado_matricula",
    "cod_ciiu_act_econ_pri",
    "cod_ciiu_act_econ_sec",
    "ciiu3",
    "ciiu4",
    "fecha_cancelacion",
    "codigo_clase_identificacion",
    "clase_identificacion",
    "numero_identificacion",
    "nit_propietario",
    "digito_verificacion",
    "codigo_camara_propietario",
    "camara_comercio_propitario",
    "matr_cula_propietario",
    "codigo_tipo_propietario",
    "tipo_propietario",
    "categoria_matricula",
  ] as const,
} as const;

export const openDataRepository = {
  companyRecords: {
    get(nit: string, { signal }: { signal?: AbortSignal } = {}) {
      return openDataClient.companies<OpenDataCompanyRecord[]>({
        query: new URLSearchParams({
          nit,
          $select: openDataFields.companies.join(","),
          $order: "fecha_matricula DESC,fecha_renovacion DESC",
        }),
        signal,
      });
    },
    getAll<T extends (typeof openDataFields.companies)[number][]>({
      limit,
      offset,
      fields,
      signal,
    }: {
      limit: number;
      offset: number;
      fields?: T;
      signal?: AbortSignal;
    }) {
      const query = new URLSearchParams({
        $limit: String(limit),
        $offset: String(offset),
        $group: "nit",
      });
      if (fields) {
        query.set("$select", fields.join(","));
      }
      return openDataClient.companies<Record<T[number], string>[]>({
        query,
        signal,
      });
    },
    count() {
      return openDataClient.companies<{ count: string }[]>({
        query: new URLSearchParams({
          $select: "COUNT(DISTINCT nit) as count",
        }),
      });
    },
    search(query: string, { limit = 25 }: { limit?: number } = {}) {
      return openDataClient.companies<OpenDataCompanyRecord[]>({
        query: new URLSearchParams({
          $q: query,
          $limit: String(limit),
        }),
      });
    },
  },
  establishments: {
    get(
      {
        registrationNumber,
        chamberCode,
      }: {
        registrationNumber: string;
        chamberCode: string;
      },
      { signal }: { signal?: AbortSignal } = {},
    ) {
      return openDataClient.establishments<OpenDataEstablishment[]>({
        query: new URLSearchParams({
          matr_cula_propietario: registrationNumber,
          codigo_camara_propietario: chamberCode,
          $select: openDataFields.establishments.join(","),
        }),
        signal,
      });
    },
  },
};
