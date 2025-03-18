import { openDataClient } from "@/app/services/openData/client";
import { companyStatus } from "@/app/services/openData/constants";

export const openDataRepository = {
  companyRecords: {
    getRelated(
      {
        chamberCode,
        economicActivity,
        limit = 25,
      }: {
        chamberCode: string;
        economicActivity: string;
        limit?: number;
      },
      { signal }: { signal?: AbortSignal } = {},
    ) {
      return openDataClient.companyRecords({
        query: new URLSearchParams({
          $limit: String(limit),
          $order: "fecha_actualizacion DESC",
          codigo_estado_matricula: companyStatus.ACTIVA,
          codigo_camara: chamberCode,
          cod_ciiu_act_econ_pri: economicActivity,
        }),
        signal,
      });
    },
    get(nit: string, { signal }: { signal?: AbortSignal } = {}) {
      return openDataClient.companyRecords({
        query: new URLSearchParams({
          nit,
          $order: "fecha_matricula DESC,fecha_renovacion DESC",
        }),
        signal,
      });
    },
    getAll({
      limit,
      offset,
      signal,
    }: {
      limit: number;
      offset: number;
      signal?: AbortSignal;
    }) {
      const query = new URLSearchParams({
        $limit: String(limit),
        $offset: String(offset),
        $group: "nit",
        $select: "nit,MAX(razon_social),MAX(fecha_actualizacion)",
      });
      return openDataClient.companyRecords<
        {
          nit: string;
          MAX_fecha_actualizacion: string;
          MAX_razon_social: string;
        }[]
      >({
        query,
        signal,
      });
    },
    count() {
      // This timeouts every time and it is called for each
      // sitemap id, so all (2K+) sitemaps fail with timeouts
      return {
        status: "success",
        data: [
          {
            // manually recompute if something changes
            count: "4955942",
          },
        ],
      };
      // return openDataClient.companyRecords<{ COUNT: string }[]>({
      //   query: new URLSearchParams({
      //     $select: "COUNT(DISTINCT nit) as count",
      //   }),
      // });
    },
    search(query: string, { limit = 25 }: { limit?: number } = {}) {
      return openDataClient.companyRecords({
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
      return openDataClient.establishments({
        query: new URLSearchParams({
          matr_cula_propietario: registrationNumber,
          codigo_camara_propietario: chamberCode,
        }),
        signal,
      });
    },
  },
};
