import { mapCompanyRecordToCompanyDto } from "@/app/mappers/mapCompanyRecordToCompanyDto";
import { companiesRepository } from "@/app/services/companies/repository";
import { processAdvancedSearchResults } from "@/app/services/rues/processAdvancesSearchResults";
import { type SiisData } from "@/app/services/siis";
import { tokensService } from "@/app/services/tokens/service";
import type { CompanyDto } from "@/app/types/CompanyDto";
import * as RUES from "@mauriciorobayo/rues-api";
import {
  getLegalRepresentativePowers,
  type BusinessEstablishmentsResponse,
  type BusinessRecord,
  type File,
} from "@mauriciorobayo/rues-api";
import pRetry, { AbortError } from "p-retry";

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
  | { status: "success"; data: CompanyDto[] | null; retrievedOn: number }
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
            retrievedOn: Date.now(),
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

        return {
          data: response.data.registros
            .map(mapCompanyRecordToCompanyDto)
            .filter((record) => !!record.name)
            .toSorted((a, b) => {
              if (a.isActive && !b.isActive) {
                return -1;
              }
              if (a.isActive && b.isActive) {
                return 0;
              }
              return 1;
            }),
          retrievedOn: Date.now(),
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

export async function getLegalPowers({
  chamberCode,
  registrationNumber,
}: {
  chamberCode: string;
  registrationNumber: string;
}) {
  // The legalRepresentativePowers request
  //  ended after very long timeouts.
  const timeout = 3_000;
  const abortController = new AbortController();
  setTimeout(() => {
    abortController.abort();
  }, timeout);
  const token = await tokensService.getToken();
  return getLegalRepresentativePowers({
    query: {
      chamberCode: chamberCode.padStart(2, "0"),
      registrationNumber: registrationNumber.padStart(10, "0"),
    },
    token,
    signal: abortController.signal,
  });
}
