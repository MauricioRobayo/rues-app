import { db } from "@/app/db";
import { companies } from "@/app/db/schema";
import csvParser from "csv-parser";
import { Readable } from "stream";

type CompanyRecord = {
  org_juridica: string;
  categoria: string;
  fecha_matricula: string;
  razon_social: string;
  tipo_identificacion: string;
  numero_identificacion: string;
  actividad_economica: string;
  actividad_economica2: string;
  actividad_economica3: string;
  actividad_economica4: string;
  desc_tamano_empresa: string;
  departamento: string;
  municipio: string;
  direccion_comercial: string;
  correo_comercial: string;
  rep_legal: string;
};

const filters = JSON.stringify({
  tipo_organizacion: ["Persona Juridica"],
  departamento_: [],
  departamento: [],
  municipio: [],
  // fecha_inicio: "1910-01-01",
  fecha_inicio: "2024-12-01",
  fecha_fin: "2024-12-24",
  sector_economico: [],
  actividad_economica: [],
  ingresos: "",
  // tamanio: ["04"],
  tamanio: [],
  motivo_consulta: ["Otros"],
});

export async function main() {
  const [fileUrl, total] = await Promise.all([
    getFileUrl(filters),
    getTotal(filters),
  ]);
  console.log("Total:", total);
  await getData(fileUrl);
}

async function getFileUrl(filters: string) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  const requestOptions = {
    method: "POST",
    body: filters,
  };
  const response = await fetch(
    "https://3qdqz6yla2.execute-api.us-east-1.amazonaws.com/panel-beneficiarios/reporte-informacion-detallada",
    requestOptions
  );
  const data: string = await response.json();
  return data;
}

async function getData(fileUrl: string) {
  const header = new Headers();
  header.append(
    "accept",
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"
  );
  const urlencoded = new URLSearchParams();
  urlencoded.append("bucket", fileUrl);

  const requestOptions = {
    method: "POST",
    headers: header,
    body: urlencoded,
  };

  const response = await fetch(
    "https://beneficios.rues.org.co/logs/download_detail.php",
    requestOptions
  );

  await processStream(response);
}

function readableStreamToNodeReadable(
  readableStream: ReadableStream,
  encoding: string
): Readable {
  const reader = readableStream.getReader();
  const decoder = new TextDecoder(encoding);
  return new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) {
        this.push(null);
      } else {
        this.push(decoder.decode(value, { stream: true }));
      }
    },
  });
}

async function processStream(
  response: Response,
  encoding: string = "ISO-8859-1"
): Promise<void> {
  if (!response.body) {
    throw new Error("Response body is empty or not streamable.");
  }

  const nodeReadable = readableStreamToNodeReadable(response.body, encoding);

  const batchSize = 500;
  const batch: (typeof companies.$inferInsert)[] = [];
  let total = 0;
  let processing = Promise.resolve();

  nodeReadable
    .pipe(csvParser())
    .on("data", (row: CompanyRecord) => {
      const company = mapCompanyRecordToCompanyModel(row);
      if (company.nit === 0) {
        return;
      }
      batch.push(company);
      if (batch.length >= batchSize) {
        const batchToInsert = [...batch];
        batch.length = 0;
        processing = processing.then(async () => {
          try {
            await db
              .insert(companies)
              .values(batchToInsert)
              .onConflictDoUpdate({
                target: companies.nit,
                set: companies,
              });
            total = total + batchToInsert.length;
            console.log(`Inserted ${total} companies`);
          } catch (error) {
            console.error(
              "Error inserting batch",
              JSON.stringify(batchToInsert),
              error
            );
          }
        });
      }
    })
    .on("end", async () => {
      await processing;
      if (batch.length > 0) {
        await db.insert(companies).values(batch).onConflictDoUpdate({
          target: companies.nit,
          set: companies,
        });
        total = total + batch.length;
        console.log(`Inserted ${total} companies`);
      }
      console.log("Finished processing CSV.");
    })
    .on("error", () => {
      console.error("Error while processing CSV");
    });
}

function mapCompanyRecordToCompanyModel(
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

async function getTotal(filters: string) {
  const requestOptions = {
    method: "POST",
    body: filters,
  };
  const response = await fetch(
    "https://3qdqz6yla2.execute-api.us-east-1.amazonaws.com/panel-beneficiarios/total-registros",
    requestOptions
  );
  return response.json();
}

main();
