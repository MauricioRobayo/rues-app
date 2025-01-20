import { chambersRepository } from "@/app/db/repositories/chambers";
import { companiesRepository } from "@/app/db/repositories/companies";
import { tokenRepository } from "@/app/db/repositories/tokens";
import { VALID_RUES_CATEGORIES } from "@/app/shared/lib/constants";
import {
  RUES,
  type BusinessEstablishmentsResponse,
  type BusinessRecord,
  type File,
} from "@mauriciorobayo/rues-api";

const rues = new RUES();

export async function getToken({
  skipCache = false,
}: { skipCache?: boolean } = {}) {
  if (!skipCache) {
    const storedToken = await tokenRepository.getLatest();
    if (storedToken) {
      console.log("Returning stored token.");
      return storedToken.token;
    }
  }

  console.log("Getting new token.");
  const { status, data } = await RUES.getToken();

  if (status === "error") {
    throw new Error("Failed to get new RUES token");
  }

  await tokenRepository.insert(data.token);

  return data.token;
}

async function advancedSearch(nit: number) {
  const token = await getToken();
  const response = await rues.advancedSearch({ query: { nit }, token });

  if (response.status === "success") {
    const data = response.data.registros?.at(0);
    return data ? { data, token } : null;
  }

  if (response.statusCode !== 401) {
    return null;
  }

  console.log(
    "RUES: Authentication failed with existing token. Getting a new token.",
  );
  const newToken = await getToken({ skipCache: true });
  const newResponse = await rues.advancedSearch({
    query: { nit },
    token: newToken,
  });
  if (newResponse.status === "success") {
    const data = newResponse.data.registros?.at(0);
    return data ? { data, token } : null;
  }

  return null;
}

export async function getRuesDataByNit(nit: number) {
  const advancedSearchResponse = await advancedSearch(nit);
  if (
    !advancedSearchResponse ||
    !VALID_RUES_CATEGORIES.includes(advancedSearchResponse.data.categoria)
  ) {
    return null;
  }
  const { data, token } = advancedSearchResponse;
  const [fileResponse, businessEstablishmentsResponse, chamber, company] =
    await Promise.all([
      rues.getFile({ id: data.id_rm }),
      rues.getBusinessEstablishments({
        query: RUES.getBusinessDetails(data.id_rm),
        token,
      }),
      chambersRepository.findByCode(Number(data.cod_camara)),
      companiesRepository.getCompanyInfo(nit),
    ]);

  const result: {
    chamber?: NonNullable<
      Awaited<ReturnType<typeof chambersRepository.findByCode>>
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
