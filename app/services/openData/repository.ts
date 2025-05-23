import { openDataClient } from "@/app/services/openData/client";
import {
  companyStatus,
  companyType,
  idType,
  registryCategoryCode,
} from "@/app/services/openData/constants";
import type {
  OpenDataChamberRecord,
  OpenDataCompanyRecord,
} from "@/app/services/openData/types";

// There are records with valid numero_identificacion and nit = null, e.g. 11202170.
// There are records with nit = 0, which are broken we cannot show "NIT 0".
// When excluding nit != 0 it will not match records where nit is null or missing
// because nulls are excluded from both equality and inequality comparisons.
// We must explicitly include nit IS NULL and nit != '0'
export const isValidNit = "(nit IS NULL OR nit != '0')";

export const isComercialCompany = `codigo_tipo_sociedad='${companyType.SOCIEDAD_COMERCIAL}'`;
export const isActiveCompany = `codigo_estado_matricula='${companyStatus.ACTIVA}'`;
export const isLegalEntity = `codigo_categoria_matricula='${registryCategoryCode.SOCIEDAD_O_PERSONA_JURIDICA_PRINCIPAL_O_ESAL}'`;
export const isValidId = `numero_identificacion IS NOT NULL AND codigo_clase_identificacion != '${idType.SIN_IDENTIFICACION}'`;
export const isValidName = "razon_social IS NOT NULL";

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
            isValidName,
            isValidNit,
          ].join(" AND "),
        }),
        signal,
      });
    },
    getAll<T extends (keyof OpenDataCompanyRecord)[]>({
      limit,
      offset = 0,
      order,
      signal,
      where,
      select,
    }: {
      limit?: number;
      offset?: number;
      signal?: AbortSignal;
      order?: string;
      where: string[];
      select?: T;
    }) {
      const query = new URLSearchParams({
        $where: where.join(" AND "),
      });
      if (offset) {
        query.set("$offset", String(offset));
      }
      if (limit) {
        query.set("$limit", String(limit));
      }
      if (select) {
        query.set("$select", select.join(","));
      }
      if (order) {
        query.set("$order", order);
      }
      return openDataClient.companyRecords<
        Pick<OpenDataCompanyRecord, T[number]>[]
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
          $where: [isValidId, isValidName, isValidNit].join(" AND "),
        }),
      });
    },
    validateNits(nits: string[], { signal }: { signal?: AbortSignal } = {}) {
      return openDataClient.companyRecords<{ nit: string }[]>({
        query: new URLSearchParams({
          $select: "numero_identificacion as nit",
          $where: [
            `numero_identificacion IN (${nits.map((nit) => `'${nit}'`).join(",")})`,
            isActiveCompany,
          ].join(" AND "),
        }),
        signal,
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
    getRandom(count = 1, { signal }: { signal?: AbortSignal } = {}) {
      // https://www.datos.gov.co/resource/6cat-2gcs.json?$select=count(distinct%20nit)
      const totalUniqueNits = 13045;
      const limit = Math.min(1000, count);

      const randomOffset = Math.floor(
        Math.random() * (totalUniqueNits - limit),
      );

      return openDataClient.largestCompanies<{ nit: string }[]>({
        query: new URLSearchParams({
          $offset: String(randomOffset),
          $limit: String(limit),
          $select: "distinct nit",
        }),
        signal,
      });
    },
  },
};
