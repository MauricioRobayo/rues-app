import csvParser from "csv-parser";
import pRetry from "p-retry";
import { Readable } from "stream";
export const CompanySize = {
  "NO DETERMINADO": "00",
  MICRO: "01",
  PEQUEÑA: "02",
  MEDIANA: "03",
  GRANDE: "04",
} as const;
export type CompanySize = (typeof CompanySize)[keyof typeof CompanySize];
export interface Filters {
  startDate: string;
  endDate: string;
  companySize?: CompanySize[];
}

export type CompanyRecord = {
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

export async function getFileUrl(filters: Filters) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  const response = await pRetry(
    () =>
      fetch(
        "https://3qdqz6yla2.execute-api.us-east-1.amazonaws.com/panel-beneficiarios/reporte-informacion-detallada",
        { method: "POST", headers, body: getFilters(filters) },
      ),
    { retries: 5 },
  );
  return response.json() as Promise<string>;
}

export async function streamData({
  fileUrl,
  fn,
  onEnd,
  batchSize = 500,
  debug = false,
}: {
  fileUrl: string;
  fn: (batch: CompanyRecord[]) => Promise<void>;
  onEnd?: () => Promise<void>;
  batchSize?: number;
  debug?: boolean;
}) {
  const header = new Headers();
  header.append(
    "accept",
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
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
    requestOptions,
  );

  return processStream({
    response,
    encoding: "ISO-8859-1",
    fn,
    onEnd,
    batchSize,
    debug,
  });
}

function readableStreamToNodeReadable(
  readableStream: ReadableStream,
  encoding: string,
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

async function processStream({
  response,
  encoding,
  fn,
  onEnd,
  batchSize = 500,
  debug = false,
}: {
  response: Response;
  encoding: string;
  fn: (batch: CompanyRecord[]) => Promise<void>;
  onEnd?: () => Promise<void>;
  batchSize: number;
  debug?: boolean;
}): Promise<number> {
  if (!response.body) {
    throw new Error("Response body is empty or not streamable.");
  }

  const nodeReadable = readableStreamToNodeReadable(response.body, encoding);

  const batch: CompanyRecord[] = [];
  let total = 0;
  let processing = Promise.resolve();

  return new Promise((resolve, reject) => {
    nodeReadable
      .pipe(csvParser())
      .on("data", (row: CompanyRecord) => {
        const nit = Number(row.numero_identificacion);
        if (nit === 0 || Number.isNaN(nit)) {
          return;
        }
        batch.push(row);
        if (batch.length >= batchSize) {
          const currentBatch = [...batch];
          batch.length = 0;
          processing = processing.then(async () => {
            try {
              await fn(currentBatch);
              total = total + currentBatch.length;
              if (debug) {
                console.log(`Processed ${total}`);
              }
            } catch (error) {
              console.error(
                "Error processing batch",
                JSON.stringify(currentBatch),
                error,
              );
            }
          });
        }
      })
      .on("end", async () => {
        try {
          await processing;
          if (batch.length > 0) {
            await fn(batch);
            total = total + batch.length;
            if (debug) {
              console.log(`Processed ${total}`);
            }
          }
          if (onEnd) {
            await onEnd();
          }
          if (debug) {
            console.log("Finished processing CSV.");
          }
          resolve(total);
        } catch (error) {
          reject(error);
        }
      })
      .on("error", (error) => {
        console.error("Error while processing CSV", error);
        reject(error);
      });
  });
}

export async function getTotal(filters: Filters) {
  const response = await pRetry(
    () =>
      fetch(
        "https://3qdqz6yla2.execute-api.us-east-1.amazonaws.com/panel-beneficiarios/total-registros",
        {
          method: "POST",
          body: getFilters(filters),
        },
      ),
    { retries: 5 },
  );
  return response.json();
}

function getFilters({ startDate, endDate, companySize = [] }: Filters) {
  return JSON.stringify({
    fecha_inicio: startDate,
    fecha_fin: endDate,
    tipo_organizacion: ["Persona Juridica"],
    departamento_: [""],
    departamento: [],
    municipio: [],
    sector_economico: [],
    actividad_economica: [],
    ingresos: "",
    tamanio: companySize,
    motivo_consulta: ["Otros"],
  });
}
