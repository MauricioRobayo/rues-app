import { getChamber } from "@/app/lib/chambers";
import { mapOpenDataCompanyRecordToCompanyRecordDto } from "@/app/mappers/mapOpenDataCompanyRecordToCompanyRecortDto";
import { mapOpenDataEstablishmentToBusinessEstablishmentDto } from "@/app/mappers/mapOpenDataEstablishmentToBusinessEstablishmentDto";
import { openDataRepository } from "@/app/services/openData/repository";
import type { CompanyRecordDto } from "@/app/types/CompanyRecordDto";
import pRetry from "p-retry";

export const openDataService = {
  chamber: {
    async getChamberRecord({
      chamberCode,
      registrationNumber,
    }: {
      chamberCode: string;
      registrationNumber: string;
    }) {
      const signal = AbortSignal.timeout(3_000);
      const chamber = getChamber(chamberCode);
      if (!chamber || !chamber.openDataSetId) {
        return null;
      }
      const response = await pRetry(() =>
        openDataRepository.chambers.getRecord(
          {
            dataSetId: chamber.openDataSetId,
            registrationNumber,
          },
          { signal },
        ),
      );
      const record = response.data?.at(0);
      if (!record) {
        return null;
      }
      return {
        assets: record.activo_total ?? record.total_activos,
        email:
          record.email_comercial ??
          record.correo_comercial ??
          record.emailcomercial,
        phoneNumbers: [
          record.tel_com_1 ?? record.tel_comercial ?? record.telcom1,
          record.tel_com_2,
          record.tel_com_2,
        ].filter((tel): tel is string => !!tel),
        city:
          record.mun_comercial ??
          record.municipio ??
          record.municipio_comercial ??
          record.muncomercial,
        address:
          record.dir_comercial ??
          record.direccion ??
          record.direccion_comercial ??
          record.dircomercial,
        zone: record.barrio_comercial,
        size: record.tam_empresa ?? record.tama_o_empresa,
      };
    },
  },
  companyRecords: {
    async get(nit: string): Promise<
      | {
          status: "success";
          data: CompanyRecordDto[] | null;
          retrievedOn: number;
        }
      | { status: "error"; statusCode?: number; error?: unknown }
    > {
      const retrievedOn = Date.now();
      try {
        const companyResponse = await pRetry(() => fetchCompanyRecords(nit), {
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
        const companyData = companyResponse.data.map(
          mapOpenDataCompanyRecordToCompanyRecordDto,
        );
        const [mainRecord, ...remainingRecords] = companyData;
        if (!mainRecord) {
          return {
            status: "success",
            retrievedOn,
            data: null,
          };
        }
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
          const response = await openDataRepository.companyRecords.count();
          if (response.status === "error") {
            console.error(response);
            throw new Error("Fetch company count failed");
          }
          const count = response.data.at(0)?.count;
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
    getAll(
      options: Parameters<typeof openDataRepository.companyRecords.getAll>[0],
    ) {
      return pRetry(
        async () => {
          const response =
            await openDataRepository.companyRecords.getAll(options);
          if (response.status === "error") {
            console.error(JSON.stringify(response, null, 2));
            throw new Error("openDataRepository.companies.getAll failed");
          }
          return response.data.map((record) => ({
            nit: record.nit,
            name: record.MAX_razon_social,
            updatedDate: record.MAX_fecha_actualizacion,
          }));
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
    search(query: string) {
      return pRetry(
        async () => {
          const response =
            await openDataRepository.companyRecords.search(query);
          if (response.status === "error") {
            console.error(response);
            throw new Error("openDataService.companies.search failed");
          }
          return response.data.map(mapOpenDataCompanyRecordToCompanyRecordDto);
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
  },
  establishments: {
    async get({
      chamberCode,
      registrationNumber,
    }: {
      chamberCode: string;
      registrationNumber: string;
    }) {
      const establishments = await pRetry(
        () =>
          fetchEstablishments({
            chamberCode: chamberCode,
            registrationNumber: registrationNumber,
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
      return (establishments ?? []).map(
        mapOpenDataEstablishmentToBusinessEstablishmentDto,
      );
    },
  },
};

async function fetchCompanyRecords(nit: string) {
  const signal = AbortSignal.timeout(3_000);
  const companyResponse = await openDataRepository.companyRecords.get(nit, {
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
    return null;
  }

  if (companyResponse.status === "error") {
    throw new Error(
      `openDataService.fetchEstablishments failed ${JSON.stringify(companyResponse)}`,
    );
  }

  return companyResponse.data;
}
