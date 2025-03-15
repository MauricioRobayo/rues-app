import { mapOpenDataCompanyToCompanyDto } from "@/app/mappers/mapOpenDataCompanyToCompanyDto";
import { mapOpenDataEstablishmentToBusinessEstablishmentDto } from "@/app/mappers/mapOpenDataEstablishmentToBusinessEstablishmentDto";
import { openDataRepository } from "@/app/services/openData/repository";
import type { CompanyDto } from "@/app/types/CompanyDto";
import pRetry from "p-retry";

export const openDataService = {
  companies: {
    async get(
      nit: string,
    ): Promise<
      | { status: "success"; data: CompanyDto[] | null; retrievedOn: number }
      | { status: "error"; statusCode?: number; error?: unknown }
    > {
      const retrievedOn = Date.now();
      try {
        const companyResponse = await pRetry(() => fetchCompany(nit), {
          retries: 3,
          onFailedAttempt: (error) => {
            console.log(
              `Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`,
            );
          },
        });
        if (!companyResponse.data) {
          return {
            ...companyResponse,
            retrievedOn,
          };
        }
        const companyData = companyResponse.data
          .map(mapOpenDataCompanyToCompanyDto)
          .filter(
            (record) =>
              !!record.registrationDate &&
              !!record.name &&
              !!record.registrationNumber &&
              !!record.status,
          )
          .toSorted((a, b) => {
            if (a.isActive && !b.isActive) {
              return -1;
            }
            if (!a.isActive && b.isActive) {
              return 1;
            }
            return (a.rawRegistrationDate ?? 0) >= (b.rawRegistrationDate ?? 0)
              ? -1
              : 1;
          });
        const [mainRecord, ...remainingRecords] = companyData;
        if (!mainRecord) {
          return {
            status: "success",
            retrievedOn,
            data: null,
          };
        }
        const establishmentResponse = await pRetry(
          () =>
            fetchEstablishments({
              chamberCode: mainRecord.chamber.code,
              registrationNumber: mainRecord.registrationNumber,
            }),
          {
            retries: 3,
            onFailedAttempt: (error) => {
              console.log(
                `Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`,
              );
            },
          },
        );
        mainRecord.establishments = (establishmentResponse.data ?? []).map(
          mapOpenDataEstablishmentToBusinessEstablishmentDto,
        );
        return {
          ...companyResponse,
          retrievedOn,
          data: [mainRecord, ...remainingRecords],
        };
      } catch (error) {
        console.error(error);
        return { error, status: "error" } as const;
      }
    },
    count() {
      return pRetry(
        async () => {
          const response = await openDataRepository.companies.count();
          if (response.status === "error") {
            console.error(response);
            throw new Error("Fetch company count failed");
          }
          const count = response.data.at(0)?.COUNT;
          if (!count) {
            console.warn("Could not get companies count");
            return null;
          }
          return Number(count);
        },
        {
          retries: 3,
          onFailedAttempt: (error) => {
            console.log(
              `Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`,
            );
          },
        },
      );
    },
    getAll({
      offset,
      limit,
      fields,
    }: Parameters<typeof openDataRepository.companies.getAll>[0]) {
      return pRetry(
        async () => {
          const response = await openDataRepository.companies.getAll({
            offset,
            limit,
            fields,
          });
          if (response.status === "error") {
            console.error(response);
            throw new Error("openDataRepository.companies.getAll failed");
          }
          return response.data.map(mapOpenDataCompanyToCompanyDto);
        },
        {
          retries: 5,
          onFailedAttempt: (error) => {
            console.log(
              `Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`,
            );
          },
        },
      );
    },
  },
};

async function fetchCompany(nit: string) {
  const signal = AbortSignal.timeout(3_000);
  const companyResponse = await openDataRepository.companies.get(nit, {
    signal,
  });

  if (companyResponse.code === 404) {
    return {
      status: "success",
      data: null,
    } as const;
  }

  if (companyResponse.status === "error") {
    throw new Error(
      `openDataService.fetchCompany failed ${JSON.stringify(companyResponse)}`,
    );
  }

  return {
    data: companyResponse.data,
    status: "success",
  } as const;
}

async function fetchEstablishments({
  chamberCode,
  registrationNumber,
}: {
  chamberCode: string;
  registrationNumber: string;
}) {
  const signal = AbortSignal.timeout(3_000);
  const companyResponse = await openDataRepository.establishments.get(
    { chamberCode, registrationNumber },
    {
      signal,
    },
  );

  if (companyResponse.code === 404) {
    return {
      status: "success",
      data: null,
    } as const;
  }

  if (companyResponse.status === "error") {
    throw new Error(
      `openDataService.fetchEstablishments failed ${JSON.stringify(companyResponse)}`,
    );
  }

  return {
    data: companyResponse.data,
    status: "success",
  } as const;
}
