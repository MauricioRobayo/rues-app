import { mapCompanyRecordToCompanyDto } from "@/app/shared/mappers/mapCompanyRecordToCompanyDto";
import { mapConsolidatedCompanyToCompanyDto } from "@/app/shared/mappers/mapConsolidatedCompanyToCompanyDto";
import { getSiisInfo, type SiisData } from "@/app/[company]/services/siis";
import { companiesRepository } from "@/app/repositories/companies";
import { tokenRepository } from "@/app/repositories/tokens";
import { VALID_RUES_CATEGORIES } from "@/app/shared/lib/constants";
import { processAdvancedSearchResults } from "@/app/shared/services/rues/processAdvancesSearchResults";
import type {
  BusinessEstablishmentsResponse,
  BusinessRecord,
  File,
} from "@mauriciorobayo/rues-api";
import * as RUES from "@mauriciorobayo/rues-api";
import pRetry, { AbortError } from "p-retry";

export interface ConsolidatedCompanyInfo {
  details?: File;
  establishments?: BusinessEstablishmentsResponse["registros"];
  company?: Awaited<ReturnType<(typeof companiesRepository)["getCompanyInfo"]>>;
  rues: BusinessRecord;
  siis?: SiisData;
}

export async function queryNit(nit: number) {
  let token = await tokenRepository.getToken();
  try {
    const response = pRetry(
      async () => {
        let response = await RUES.queryNit({ nit, token });

        if (response.statusCode === 401) {
          console.warn(
            "RUES: Authentication failed with existing token. Getting a new token.",
          );
          token = await tokenRepository.getToken({ skipCache: true });
          response = await RUES.queryNit({ nit, token });
        }

        if (response.statusCode === 401 || response.statusCode === 404) {
          throw new AbortError(`queryNit failed ${JSON.stringify(response)}`);
        }
        if (response.status !== "success") {
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
          token,
        };
      },
      {
        retries: 3,
      },
    );
    return response;
  } catch (err) {
    console.error(err);
    return { data: null, token };
  }
}

export async function advancedSearch({
  search,
  token,
}: {
  search: { nit: number } | { name: string };
  token?: string;
}) {
  let ruesToken = token ?? (await tokenRepository.getToken());
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
          ruesToken = await tokenRepository.getToken({ skipCache: true });
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

        if (response.status !== "success") {
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
      RUES.getFile(rues.id_rm),
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

function getCompanyInfo(nit: number) {
  try {
    return pRetry(() => companiesRepository.getCompanyInfo(nit), {
      retries: 3,
    });
  } catch (err) {
    console.error("Failed to get company info", err);
    return null;
  }
}
