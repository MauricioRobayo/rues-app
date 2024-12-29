import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import prisma from "@/app/db/tokens";
import type { BusinessRegistration } from "@prisma/client";
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

const businessSizeCode: Record<string, number> = {
  "NO DETERMINADO": 0,
  MICRO: 1,
  PEQUEÑA: 2,
  MEDIANA: 3,
  GRANDE: 4,
};
const businessSize = {
  undefined: "00",
  micro: "01",
  small: "02",
  medium: "03",
  large: "04",
} as const;
type BusinessSize = (keyof typeof businessSize)[number];

export async function getFileUrl({
  startDate,
  endDate,
  businessSize,
}: {
  startDate: string;
  endDate: string;
  businessSize: BusinessSize[];
}) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const body = JSON.stringify({
    tipo_organizacion: ["Persona Juridica"],
    departamento_: [],
    departamento: [],
    municipio: [],
    fecha_inicio: startDate,
    fecha_fin: endDate,
    sector_economico: [],
    actividad_economica: [],
    ingresos: "",
    tamanio: businessSize,
    motivo_consulta: ["Identificación de posibles proveedores"],
  });

  const requestOptions = {
    method: "POST",
    headers,
    body,
  };

  const [response, total] = await Promise.all([
    fetch(
      "https://3qdqz6yla2.execute-api.us-east-1.amazonaws.com/panel-beneficiarios/reporte-informacion-detallada",
      requestOptions
    ),
    getTotalRecords(body),
  ]);

  const fileUrl: string = await response.json();

  console.log("Total Records:", total);
  console.log("File URL:", fileUrl);
  return fileUrl;
}

async function getFile(fileUrl: string) {
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

  return fetch(
    "https://beneficios.rues.org.co/logs/download_detail.php",
    requestOptions
  );
}

function readableStreamToNodeReadable(
  readableStream: ReadableStream,
  encoding: string
): Readable {
  const reader = readableStream.getReader();
  const decoder = new TextDecoder(encoding); // Specify encoding here
  return new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) {
        this.push(null); // End of stream
      } else {
        this.push(decoder.decode(value, { stream: true })); // Decode with specified encoding
      }
    },
  });
}

async function getTotalRecords(body: string) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const requestOptions = {
    method: "POST",
    headers,
    body,
  };

  const response = await fetch(
    "https://3qdqz6yla2.execute-api.us-east-1.amazonaws.com/panel-beneficiarios/total-registros",
    requestOptions
  );

  const data: string = await response.json();
  return Number(data);
}

async function processStream(
  response: Response,
  encoding: string = "ISO-8859-1"
): Promise<void> {
  if (!response.body) {
    throw new Error("Response body is empty or not streamable.");
  }

  const nodeReadable = readableStreamToNodeReadable(response.body, encoding);

  nodeReadable
    .pipe(csvParser())
    .on("data", async (row: CompanyRecord) => {
      const businessRegistration = mapCompanyToBusiness(row);
      console.log("Parsed Row:", businessRegistration);
      // await prisma.businessRegistration.create({
      //   data: businessRegistration,
      // });
    })
    .on("end", () => {
      console.log("CSV processing completed.");
    })
    .on("error", (error) => {
      console.error("Error while processing CSV:", error);
    });
}

function mapCompanyToBusiness(
  company: CompanyRecord
): Omit<BusinessRegistration, "id"> {
  return {
    legal_entity: company.org_juridica,
    category: company.categoria,
    registration_date: new Date(company.fecha_matricula),
    business_name: company.razon_social,
    document_type: company.tipo_identificacion,
    nit: Number(company.numero_identificacion),
    economic_activity1: company.actividad_economica,
    economic_activity2: company.actividad_economica2 || null,
    economic_activity3: company.actividad_economica3 || null,
    economic_activity4: company.actividad_economica4 || null,
    company_size: businessSizeCode[company.desc_tamano_empresa] ?? 0,
    state: company.departamento,
    city: company.municipio,
    business_address: company.direccion_comercial,
    chamber_code: null,
    last_renewed_year: null,
    legal_organization: null,
    registration_id: null,
    registration_number: null,
    is_active: null,
  };
}

async function main() {
  // const fileUrl = await getFileUrl({
  //   startDate: "2024-12-01",
  //   endDate: "2024-12-24",
  //   businessSize: [businessSize.medium],
  // });

  const fileUrl =
    "s3://aws-athena-query-results-035967235690-us-east-1/4344ed40-4b09-4c83-a21b-39e1eff487fa.csv";
  const response = await getFile(fileUrl);

  await processStream(response);
}

main();
