import { openDataClient } from "@/app/services/openData/client";
import type { OpenDataChamberRecord } from "@/app/services/openData/types";

// There are records with valid numero_identificacion and nit = null, e.g. 11202170.
// There are records with nit = 0, which are broken we cannot show "NIT 0".
// When excluding nit != 0 it will not match records where nit is null or missing
// because nulls are excluded from both equality and inequality comparisons.
// We must explicitly include nit IS NULL and nit != 0
export const validNit = "(nit IS NULL OR nit != '0')";

export const openDataRepository = {
  chambers: {
    getRecord(
      { dataSetId, id, key }: { dataSetId: string; id: string; key: string },
      { signal }: { signal?: AbortSignal } = {},
    ) {
      return openDataClient.api<OpenDataChamberRecord[]>({
        dataSetId,
        query: new URLSearchParams({ [key]: id }),
        signal,
      });
    },
  },
  companyRecords: {
    get(nit: string, { signal }: { signal?: AbortSignal } = {}) {
      return openDataClient.companyRecords({
        query: new URLSearchParams({
          $order: "fecha_cancelacion DESC",
          $where: [
            `numero_identificacion='${nit}'`,
            "razon_social IS NOT NULL",
            validNit,
          ].join(" AND "),
        }),
        signal,
      });
    },
    getAll({
      limit,
      offset,
      signal,
      where,
    }: {
      limit: number;
      offset: number;
      signal?: AbortSignal;
      where: string[];
    }) {
      const query = new URLSearchParams({
        $limit: String(limit),
        $offset: String(offset),
        $select: "numero_identificacion,razon_social",
        $where: where.join(" AND "),
      });
      return openDataClient.companyRecords<
        {
          numero_identificacion: string;
          razon_social: string;
        }[]
      >({
        query,
        signal,
      });
    },
    count({ where }: { where: string[] }) {
      return openDataClient.companyRecords<{ count: string }[]>({
        query: new URLSearchParams({
          $select: "COUNT(numero_identificacion) as count",
          $where: where.join(" AND "),
        }),
      });
    },
    search(query: string, { limit = 25 }: { limit?: number } = {}) {
      return openDataClient.companyRecords({
        query: new URLSearchParams({
          $q: query,
          $limit: String(limit),
          $where: [
            "numero_identificacion IS NOT NULL",
            "razon_social IS NOT NULL",
            validNit,
          ].join(" AND "),
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
  largestCompanies: {
    get(nit: number, { signal }: { signal?: AbortSignal } = {}) {
      return openDataClient.largestCompanies({
        query: new URLSearchParams({
          nit: String(nit),
        }),
        signal,
      });
    },
  },
};
