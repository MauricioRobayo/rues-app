import type {
  OpenDataLargestCompanyRecord,
  OpenDataCompanyRecord,
  OpenDataEstablishment,
} from "@/app/services/openData/types";

const OpenDataSet = {
  COMPANIES: "c82u-588k",
  ESTABLISHMENTS: "nb3d-v3n7",
  LARGEST_COMPANIES: "6cat-2gcs",
} as const;

export const openDataClient = {
  companyRecords: openDataFetchFactory(OpenDataSet.COMPANIES),
  establishments: openDataFetchFactory(OpenDataSet.ESTABLISHMENTS),
  largestCompanies: openDataFetchFactory(OpenDataSet.LARGEST_COMPANIES),
  api: openDataFetch,
};

interface OpenDataOptions {
  dataSetId: string;
  query: URLSearchParams;
  signal?: AbortSignal;
}

function openDataFetchFactory(
  dataSetId: (typeof OpenDataSet)["LARGEST_COMPANIES"],
): <T = OpenDataLargestCompanyRecord[]>(
  options: Omit<OpenDataOptions, "dataSetId">,
) => ReturnType<typeof openDataFetch<T>>;
function openDataFetchFactory(
  dataSetId: (typeof OpenDataSet)["COMPANIES"],
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
) {
  return <T>(options: Omit<OpenDataOptions, "dataSetId">) => {
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
