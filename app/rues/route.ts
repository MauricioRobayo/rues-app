import {
  getData,
  getFileUrl,
  getTotal,
  type CompanyRecord,
} from "@/app/rues/panel";
import { ruesSyncRepository } from "../db/rues-sync";
import { companies, ruesSync } from "@/app/db/schema";
import { db } from "@/app/db";
import { companiesRepository } from "@/app/db/tokens copy";

const syncToken = process.env.RUES_SYNC_TOKEN;

if (!syncToken) {
  throw new Error("RUES_SYNC_TOKEN is required");
}

export async function POST(request: Request) {
  const token = request.headers.get("Authorization")?.split("Bearer ")[1];
  if (token !== syncToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const startedAtMs = new Date();
  const latestRuesSync = await ruesSyncRepository.getLatest();
  const previousSyncEndDate = new Date(
    latestRuesSync?.syncEndDate ?? "2025-01-05"
  );
  const syncStartDate = new Date(
    previousSyncEndDate.setUTCDate(previousSyncEndDate.getUTCDate() - 1)
  )
    .toISOString()
    .slice(0, 10);
  const syncEndDate = new Date().toISOString().slice(0, 10);
  const randomId = crypto.randomUUID().slice(0, 8);
  const syncId = `${syncStartDate}${syncEndDate}${randomId}`.replaceAll(
    "-",
    ""
  );
  if (syncStartDate >= syncEndDate) {
    return Response.json(
      { message: "startDate is not before endDate" },
      {
        status: 500,
      }
    );
  }
  const filters = {
    endDate: syncEndDate,
    startDate: syncStartDate,
  };

  const [fileUrl, totalRecords] = await Promise.all([
    getFileUrl(filters),
    getTotal(filters),
  ]);
  const ruesSyncId = await ruesSyncRepository.insert({
    startedAtMs,
    syncStartDate,
    syncEndDate,
    totalRecords,
    status: "started",
    syncFileUrl: fileUrl,
  });

  if (!ruesSyncId) {
    return Response.json(
      {
        message: "Could not generate rues_sync init record.",
      },
      {
        status: 500,
      }
    );
  }

  console.log("RUES sync started successfully:", ruesSyncId);

  try {
    const recordsInserted = await getData({
      fileUrl,
      fn: async (batch) => {
        const companies = batch.map((company) => ({
          ...mapCompanyRecordToCompanyModel(company),
          ruesSyncId,
        }));
        await companiesRepository.insertMany(companies);
      },
    });
    await ruesSyncRepository.update(ruesSyncId, {
      endedAtMs: new Date(),
      recordsInserted,
      status: "success",
    });
    console.log("RUES sync finished successfully:", ruesSyncId);
  } catch (err) {
    console.error("Error while processing data", err);
    await ruesSyncRepository.update(ruesSyncId, {
      endedAtMs: new Date(),
      status: "error",
      errorMessage: JSON.stringify(err),
    });
  }

  return Response.json({ message: "Alright." });
}

export function mapCompanyRecordToCompanyModel(
  company: CompanyRecord
): typeof companies.$inferInsert {
  const companySizes: Record<string, number> = {
    "NO DETERMINADO": 0,
    MICRO: 1,
    PEQUEÑA: 2,
    MEDIANA: 3,
    GRANDE: 4,
  };
  return {
    legalEntity: company.org_juridica,
    category: company.categoria,
    registrationDate: new Date(company.fecha_matricula),
    businessName: company.razon_social,
    documentType: company.tipo_identificacion,
    nit: Number(company.numero_identificacion),
    economicActivity1: company.actividad_economica,
    economicActivity2: company.actividad_economica2 || null,
    economicActivity3: company.actividad_economica3 || null,
    economicActivity4: company.actividad_economica4 || null,
    companySize: companySizes[company.desc_tamano_empresa] ?? 0,
    businessAddress: company.direccion_comercial,
  };
}
