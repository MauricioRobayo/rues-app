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
import pRetry from "p-retry";

export async function advancedSearch(
  search: { nit: number } | { name: string },
) {
  const query = "nit" in search ? { nit: search.nit } : { razon: search.name };
  const token = await tokenRepository.getToken();
  let response = await RUES.advancedSearch({
    query,
    token,
  });

  if (response.statusCode === 401) {
    console.warn(
      "RUES: Authentication failed with existing token. Getting a new token.",
    );
    const newToken = await tokenRepository.getToken({ skipCache: true });
    response = await RUES.advancedSearch({
      query,
      token: newToken,
    });
  }
  if (response.status !== "success") {
    return null;
  }

  const data = processAdvancedSearchResults(response.data.registros ?? []);
  return data ? { data, token } : null;
}

export async function getRuesDataByNit(nit: number) {
  const advancedSearchResponse = await advancedSearch({ nit });
  const { data: [data] = [], token } = advancedSearchResponse ?? {};
  if (!token || !VALID_RUES_CATEGORIES.includes(data.categoria)) {
    return null;
  }
  const [fileResponse, businessEstablishmentsResponse, chamber, company] =
    await Promise.all([
      RUES.getFile(data.id_rm),
      RUES.getBusinessEstablishments({
        query: RUES.getBusinessDetails(data.id_rm),
        token,
      }),
      getChamberInfo(Number(data.cod_camara)),
      getCompanyInfo(nit),
    ]);

  const result: {
    chamber?: NonNullable<
      Awaited<ReturnType<typeof companiesRepository.findChamberByCode>>
    >;
    details?: File;
    establishments?: BusinessEstablishmentsResponse["registros"];
    company?: Awaited<
      ReturnType<(typeof companiesRepository)["getCompanyInfo"]>
    >;
    rues: BusinessRecord;
  } = {
    rues: data,
  };

  if (chamber) {
    result.chamber = chamber;
  }

  if (fileResponse.status === "success") {
    result.details = fileResponse.data.registros;
  }

  if (businessEstablishmentsResponse.status === "success") {
    result.establishments = businessEstablishmentsResponse.data.registros;
  }

  if (company) {
    result.company = company;
  }

  return result;
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

function getChamberInfo(code: number) {
  try {
    return pRetry(() => companiesRepository.findChamberByCode(Number(code)), {
      retries: 3,
    });
  } catch (err) {
    console.error("Failed to get chamber info", err);
    return null;
  }
}
