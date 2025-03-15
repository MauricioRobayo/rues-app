const OpenDataSet = {
  COMPANIES: "c82u-588k",
  ESTABLISHMENTS: "nb3d-v3n7",
} as const;

export const openDataClient = {
  companies: openDataFetchFactory(OpenDataSet.COMPANIES),
  establishments: openDataFetchFactory(OpenDataSet.ESTABLISHMENTS),
};

interface OpenDataOptions {
  dataSetId: string;
  query: URLSearchParams;
  signal?: AbortSignal;
}

function openDataFetchFactory(
  dataSetId: (typeof OpenDataSet)[keyof typeof OpenDataSet],
) {
  return <T>(options: Omit<OpenDataOptions, "dataSetId">) =>
    openDataFetch<T>({
      dataSetId,
      ...options,
    });
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

    if (!response.ok) {
      console.error(`Failed to fetch Datos Abiertos ${dataSetId}`);
      return {
        status: "error",
        code: response.status,
      };
    }

    const data: T = await response.json();
    return {
      status: "success",
      code: response.status,
      data,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}
