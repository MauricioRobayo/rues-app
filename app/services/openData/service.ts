import { mapOpenDataCompanyToCompanyDto } from "@/app/mappers/mapOpenDataCompanyToCompanyDto";
import { mapOpenDataEstablishmentToBusinessEstablishmentDto } from "@/app/mappers/mapOpenDataEstablishmentToBusinessEstablishmentDto";
import { openDataApi } from "@/app/services/openData/api";
import type { CompanyDto } from "@/app/types/CompanyDto";
import pRetry from "p-retry";

export const openDataService = {
  async getCompany(
    nit: string,
  ): Promise<
    | { status: "success"; data: CompanyDto[] | null; retrievedOn: number }
    | { status: "error"; statusCode?: number; error?: unknown }
  > {
    const retrievedOn = Date.now();
    try {
      const companyResponse = await pRetry(() => fetchCompany(nit), {
        retries: 3,
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
      const establishmentResponse = await pRetry(() =>
        fetchEstablishments({
          chamberCode: mainRecord.chamber.code,
          registrationNumber: mainRecord.registrationNumber,
        }),
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
};

async function fetchCompany(nit: string) {
  const signal = AbortSignal.timeout(3_000);
  const companyResponse = await openDataApi.getCompanyByNit(nit, {
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
  const companyResponse = await openDataApi.getEstablishments(
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
