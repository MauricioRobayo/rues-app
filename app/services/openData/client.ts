import {
  companyStatus,
  companyType,
  idType,
} from "@/app/services/openData/constants";
import type {
  OpenDataCompanyRecord,
  OpenDataEstablishment,
} from "@/app/services/openData/types";

const OpenDataSet = {
  COMPANIES: "c82u-588k",
  ESTABLISHMENTS: "nb3d-v3n7",
} as const;

const companiesExcludeSQL = [
  `codigo_clase_identificacion!='${idType.SIN_IDENTIFICACION}'`,
  `codigo_tipo_sociedad!='${companyType.NO_APLICA}'`,
  `codigo_estado_matricula!='${companyStatus.NO_ASIGNADO}'`,
  `codigo_estado_matricula!='${companyStatus.NO_MATRICULADO}'`,
  // No regex allowed, this is the best I could thought of
  // at the moment to get only valid NITs
  "nit IS NOT NULL",
  "nit>='1000000'",
  "nit<='999999999'",
  "razon_social IS NOT NULL",
  "estado_matricula IS NOT NULL",
].join(" AND ");

export const openDataClient = {
  companyRecords: openDataFetchFactory(
    OpenDataSet.COMPANIES,
    new URLSearchParams({
      $where: companiesExcludeSQL,
    }),
  ),
  establishments: openDataFetchFactory(OpenDataSet.ESTABLISHMENTS),
};

interface OpenDataOptions {
  dataSetId: string;
  query: URLSearchParams;
  signal?: AbortSignal;
}

function openDataFetchFactory(
  dataSetId: (typeof OpenDataSet)["COMPANIES"],
  defaultQuery?: URLSearchParams,
): <T = OpenDataCompanyRecord[]>(
  options: Omit<OpenDataOptions, "dataSetId">,
) => ReturnType<typeof openDataFetch<T>>;
function openDataFetchFactory(
  dataSetId: (typeof OpenDataSet)["ESTABLISHMENTS"],
  defaultQuery?: URLSearchParams,
): <T = OpenDataEstablishment[]>(
  options: Omit<OpenDataOptions, "dataSetId">,
) => ReturnType<typeof openDataFetch<T>>;
function openDataFetchFactory(
  dataSetId: (typeof OpenDataSet)[keyof typeof OpenDataSet],
  defaultQuery?: URLSearchParams,
) {
  return <T>(options: Omit<OpenDataOptions, "dataSetId">) => {
    if (defaultQuery) {
      defaultQuery.forEach((value, key) => {
        options.query.append(key, value);
      });
    }
    return openDataFetch<T>({
      dataSetId,
      ...options,
    });
  };
}

async function openDataFetch<T>({
  dataSetId,
  query,
  signal,
}: OpenDataOptions): Promise<
  | {
      status: "success";
      data: T;
      code: number;
      error?: never;
    }
  | {
      status: "error";
      data?: never;
      code?: number;
      error?: unknown;
    }
> {
  const token = process.env.DATOS_ABIERTOS_TOKEN;

  if (!token) {
    throw new Error("Missing DATOS_ABIERTOS_TOKEN");
  }

  const headers = new Headers();
  headers.append("X-App-Token", token);

  const url = new URL(
    `/resource/${dataSetId}.json`,
    "https://www.datos.gov.co",
  );
  url.search = query.toString();

  try {
    const response = await fetch(url, {
      headers,
      redirect: "follow",
      signal,
    });

    const data: T = await response.json();

    if (!response.ok) {
      console.error(`Failed to fetch Datos Abiertos ${url}`);
      return {
        status: "error",
        code: response.status,
        error: data,
      };
    }

    return {
      status: "success",
      code: response.status,
      data,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      error,
    };
  }
}
