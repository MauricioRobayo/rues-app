import { mapCompanyRecordToCompanyDto } from "@/app/mappers/mapCompanyRecordToCompanyDto";
import { mapConsolidatedCompanyToCompanyDto } from "@/app/mappers/mapConsolidatedCompanyToCompanyDto";
import { getSiisInfo, type SiisData } from "@/app/services/siis";
import { companiesRepository } from "@/app/services/companies/repository";
import { VALID_RUES_CATEGORIES } from "@/app/lib/constants";
import { processAdvancedSearchResults } from "@/app/services/rues/processAdvancesSearchResults";
import {
  getLegalRepresentativePowers,
  type BusinessEstablishmentsResponse,
  type BusinessRecord,
  type File,
} from "@mauriciorobayo/rues-api";
import * as RUES from "@mauriciorobayo/rues-api";
import pRetry, { AbortError } from "p-retry";
import { tokensService } from "@/app/services/tokens/service";
import type { CompanyDto } from "@/app/types/CompanyDto";

export interface ConsolidatedCompanyInfo {
  details?: File;
  establishments?: BusinessEstablishmentsResponse["registros"];
  company?: Awaited<ReturnType<(typeof companiesRepository)["getCompanyInfo"]>>;
  rues: BusinessRecord;
  siis?: SiisData;
}

export async function queryNit(
  nit: number,
): Promise<
  | { status: "success"; data: CompanyDto | null }
  | { status: "error"; statusCode?: number; error?: unknown }
> {
  let token = await tokensService.getToken();
  try {
    const response = await pRetry(
      async () => {
        let response = await RUES.queryNit({ nit, token });

        if (response.statusCode === 404) {
          return {
            status: "success",
            data: null,
          } as const;
        }

        if (response.statusCode === 401) {
          console.warn(
            "RUES: Authentication failed with existing token. Getting a new token.",
          );
          token = await tokensService.getNewToken();
          response = await RUES.queryNit({ nit, token });
          if (response.statusCode === 401) {
            console.error("RUES: Authentication failed with fresh token.");
            return {
              status: "error",
              statusCode: 401,
            } as const;
          }
        }

        if (response.status === "error") {
          throw new Error(`queryNit failed ${JSON.stringify(response)}`);
        }

        const activeRecord = response.data.registros.find(
          (record) => record.estado_matricula === "ACTIVA",
        );
        const mostRecentRecord = response.data.registros
          .sort(
            (a, b) =>
              Number(b.ultimo_ano_renovado) - Number(a.ultimo_ano_renovado),
          )
          .at(0);
        const record = activeRecord ?? mostRecentRecord;

        return {
          data: record ? mapCompanyRecordToCompanyDto(record) : null,
          status: "success",
        } as const;
      },
      {
        retries: 3,
      },
    );
    return response;
  } catch (error) {
    console.error(error);
    return { error, status: "error" } as const;
  }
}

export async function advancedSearch({
  search,
  token,
}: {
  search: { nit: number } | { name: string };
  token?: string;
}) {
  let ruesToken = token ?? (await tokensService.getToken());
  try {
    const response = await pRetry(
      async () => {
        const query =
          "nit" in search ? { nit: search.nit } : { razon: search.name };
        let response = await RUES.advancedSearch({
          query,
          token: ruesToken,
        });

        if (response.statusCode === 401) {
          console.warn(
            "RUES: Authentication failed with existing token. Getting a new token.",
          );
          ruesToken = await tokensService.getNewToken();
          response = await RUES.advancedSearch({
            query,
            token: ruesToken,
          });
        }

        if (response.statusCode === 401 || response.statusCode === 404) {
          throw new AbortError(
            `advancedSearch failed ${JSON.stringify(response)}`,
          );
        }

        if (response.status === "error") {
          throw new Error(`advancedSearch failed ${JSON.stringify(response)}`);
        }

        const data = processAdvancedSearchResults(
          response.data.registros ?? [],
        );
        return { data, token: ruesToken };
      },
      {
        retries: 3,
      },
    );
    return response;
  } catch (err) {
    console.error(err);
    return { data: null, token: ruesToken };
  }
}

export async function getRuesDataByNit({
  nit,
  token,
}: {
  nit: number;
  token: string;
}) {
  const advancedSearchResponse = await advancedSearch({
    search: { nit },
    token,
  });
  const { data } = advancedSearchResponse ?? {};
  if (!data || data.length === 0) {
    return null;
  }
  const rues = data[0];
  if (!token || !VALID_RUES_CATEGORIES.includes(rues.categoria)) {
    return null;
  }
  const [fileResponse, businessEstablishmentsResponse, company, siis] =
    await Promise.all([
      RUES.getFile({ registrationId: rues.id_rm }),
      RUES.getBusinessEstablishments({
        query: RUES.getBusinessDetails(rues.id_rm),
        token,
      }),
      getCompanyInfo(nit),
      getSiisInfo(nit),
    ]);

  const result: ConsolidatedCompanyInfo = {
    rues,
  };

  if (fileResponse.status === "success") {
    result.details = fileResponse.data.registros;
  }

  if (businessEstablishmentsResponse.status === "success") {
    result.establishments = businessEstablishmentsResponse.data.registros;
  }

  if (company) {
    result.company = company;
  }

  if (siis) {
    result.siis = siis;
  }

  return mapConsolidatedCompanyToCompanyDto(result);
}

async function getCompanyInfo(nit: number) {
  try {
    const response = await pRetry(
      () => companiesRepository.getCompanyInfo(nit),
      {
        retries: 3,
      },
    );
    return response;
  } catch (err) {
    console.error("Failed to get company info", err);
    return null;
  }
}

export async function getLegalPowers({
  chamberCode,
  registrationNumber,
}: {
  chamberCode: string;
  registrationNumber: string;
}) {
  // The legalRepresentativePowers request has
  // given very long timeouts which have ended
  // in the whole page timing out.
  const timeout = 2_000;
  const abortController = new AbortController();
  setTimeout(() => {
    abortController.abort();
  }, timeout);
  const token = await tokensService.getToken();
  const response = await getLegalRepresentativePowers({
    query: {
      chamberCode,
      registrationNumber,
    },
    token,
    signal: abortController.signal,
  });

  if (response.status === "error") {
    console.log("getLegalPowers failed", response);
    return null;
  }

  return response.data;
}
