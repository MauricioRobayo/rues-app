import { join } from "node:path";

type Response<T> =
  | {
      status: "error";
      statusCode?: number;
      error?: unknown;
    }
  | {
      status: "success";
      data: T;
    };

export function getToken(): Promise<
  Response<{ access_token: string; expires_in: number }>
> {
  const headers = new Headers();
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("tipoId", "");
  urlencoded.append("numDoc", "");
  urlencoded.append("validarExistencia", "false");

  return ccbFetch<{ access_token: string; expires_in: number }>({
    path: "token",
    method: "POST",
    headers,
    body: urlencoded.toString(),
  });
}

export interface BidderFilesResponse {
  id: string;
  registro: string;
  tipoActo: string;
  fechaActo: string;
}
export function getBidderFiles({
  bidderId,
  token,
}: {
  bidderId: string;
  token: string;
}) {
  return ccbFetch<BidderFilesResponse[]>({
    path: "documentosActos",
    query: new URLSearchParams({
      numInscripcion: bidderId.padStart(8, "0"),
    }),
    token,
  });
}

async function ccbFetch<T>({
  path,
  body,
  query,
  token,
  headers,
  method = "GET",
}: {
  path: string;
  body?: string;
  query?: URLSearchParams;
  token?: string;
  headers?: Headers;
  method?: "GET" | "POST";
}): Promise<Response<T>> {
  const ccbHeaders = headers ?? new Headers();
  if (token) {
    ccbHeaders.append("authorization", `Bearer ${token}`);
  }
  const ccbPath = join("/gestionexpedientes/api/", path);
  const url = new URL(ccbPath, "https://linea.ccb.org.co");
  if (query) {
    url.search = query.toString();
  }
  try {
    const response = await fetch(url, {
      method,
      headers: ccbHeaders,
      body,
    });

    if (!response.ok) {
      return {
        status: "error",
        statusCode: response.status,
      } as const;
    }

    const data = await response.json();

    return {
      status: "success",
      data,
    };
  } catch (err) {
    console.error("ccbFetch failed", err);
    return {
      status: "error",
    };
  }
}
