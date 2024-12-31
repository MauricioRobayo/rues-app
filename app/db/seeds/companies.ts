import { type CompanyRecord } from "@/app/rues/panel";
import { db } from "..";
import { companies } from "../schema";

const seedData: CompanyRecord[] = [
  {
    org_juridica: "Persona Jurídica",
    categoria: "SOCIEDAD ó PERSONA JURIDICA PRINCIPAL ó ESAL",
    fecha_matricula: "2021-01-21",
    razon_social: "CONSTRUCTORA A.I.A. S.A.S.",
    tipo_identificacion: "NIT",
    numero_identificacion: "00000901447492",
    actividad_economica: "Construcción de edificios residenciales",
    actividad_economica2: "Construcción de edificios no residenciales",
    actividad_economica3: "",
    actividad_economica4: "",
    desc_tamano_empresa: "GRANDE",
    departamento: "ANTIOQUIA",
    municipio: "MEDELLIN",
    direccion_comercial: "CALLE 16 A SUR NO. 48 A 32",
    correo_comercial: "impuestos@aia.com.co",
    rep_legal: "ARQUITECTOS E INGENIEROS ASOCIADOS S. A.",
  },
  {
    org_juridica: "Persona Jurídica",
    categoria: "SOCIEDAD ó PERSONA JURIDICA PRINCIPAL ó ESAL",
    fecha_matricula: "2021-01-20",
    razon_social: "MUEVE USME SAS",
    tipo_identificacion: "NIT",
    numero_identificacion: "00000901446500",
    actividad_economica: "Transporte de pasajeros",
    actividad_economica2: "Otras actividades complementarias al transporte",
    actividad_economica3: "",
    actividad_economica4: "",
    desc_tamano_empresa: "GRANDE",
    departamento: "BOGOTA",
    municipio: "BOGOTA D.C.",
    direccion_comercial: "Calle 137 Sur 11B 80",
    correo_comercial: "info@mueveusme.co",
    rep_legal: "YUBER HOLMEDIS CALIXTO CASTRO",
  },
  {
    org_juridica: "Persona Jurídica",
    categoria: "SOCIEDAD ó PERSONA JURIDICA PRINCIPAL ó ESAL",
    fecha_matricula: "2021-01-20",
    razon_social: "MUEVE FONTIBON SAS",
    tipo_identificacion: "NIT",
    numero_identificacion: "00000901446499",
    actividad_economica: "Transporte de pasajeros",
    actividad_economica2: "Otras actividades complementarias al transporte",
    actividad_economica3: "",
    actividad_economica4: "",
    desc_tamano_empresa: "GRANDE",
    departamento: "BOGOTA",
    municipio: "BOGOTA D.C.",
    direccion_comercial: "Cra 134 N 22a 80",
    correo_comercial: "info@muevefontibon.co",
    rep_legal: "GINA MELANI GONZALEZ BETANCOURT",
  },
  {
    org_juridica: "Persona Jurídica",
    categoria: "SOCIEDAD ó PERSONA JURIDICA PRINCIPAL ó ESAL",
    fecha_matricula: "2021-01-28",
    razon_social: "CLINICA DENTAL KERALTY SAS",
    tipo_identificacion: "NIT",
    numero_identificacion: "00000901449584",
    actividad_economica: "Actividades de la práctica odontológica",
    actividad_economica2: "Otras actividades de atención de la salud humana",
    actividad_economica3: "",
    actividad_economica4: "",
    desc_tamano_empresa: "GRANDE",
    departamento: "BOGOTA",
    municipio: "BOGOTA D.C.",
    direccion_comercial: "CL 100 NO. 11 B 67",
    correo_comercial: "impuestososi@colsanitas.com",
    rep_legal: "FRANCK HARB HARB",
  },
];

async function main() {
  await db
    .insert(companies)
    .values(seedData.map(mapCompanyRecordToCompanyModel))
    .onConflictDoNothing();
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

main();
