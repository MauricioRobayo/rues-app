import { Badge } from "@/app/[company]/Badge";
import { getCompanyRecordFromPathSegment } from "@/app/[company]/getCompanyRecordFromPathSegment";
import { getRuesDataByNit } from "@/app/[company]/rues";
import { siisApi } from "@/app/[company]/siis";
import { formatNit } from "@/app/format-nit";
import { dateFormatter } from "@/app/formatters";
import type { File, BusinessRecord } from "@mauriciorobayo/rues-api";
import type { Metadata } from "next";
import { type ReactNode } from "react";

interface PageProps {
  params: Promise<{ company: string }>;
}

export const dynamic = "force-static";

type CompanyDetailKey = keyof BusinessRecord | keyof File;

type DetailsMapping = {
  key: CompanyDetailKey;
  label: string;
  renderValue?: (value: string) => ReactNode;
  itemProp?: string;
};

const detailsMapping: DetailsMapping[] = [
  { key: "razon_social", label: "Razón social" },
  { key: "nit", label: "NIT" },
  { key: "dv", label: "DV" },
  { key: "matricula", label: "Matrícula" },
  { key: "sigla", label: "Sigla" },
  { key: "nom_camara", label: "Cámara de comercio" },
  { key: "organizacion_juridica", label: "Organización jurídica" },
  { key: "estado_matricula", label: "Estado matrícula" },
  { key: "motivo_cancelacion", label: "Motivo de cancelación" },
  {
    key: "fecha_matricula",
    label: "Fecha de constitución",
    renderValue: renderDateValue,
  },
  {
    key: "fecha_renovacion",
    label: "Fecha de renovación",
    renderValue: renderDateValue,
  },
  {
    key: "fecha_actualizacion",
    label: "Fecha actualización",
    renderValue: renderDateValue,
  },
  {
    key: "fecha_cancelacion",
    label: "Fecha cancelación",
    renderValue: renderDateValue,
  },
  { key: "ultimo_ano_renovado", label: "Último año renovado" },
  {
    key: "indicador_emprendimiento_social",
    label: "Indicador emprendimiento social",
  },
  { key: "tipo_sociedad", label: "Tipo de sociedad" },
  { key: "url_venta_certificados", label: "Certificado de tradición" },
];

/*
{
    "cod_ciiu_act_econ_pri": "4111",
    "desc_ciiu_act_econ_pri": "Construcción de edificios residenciales",
    "cod_ciiu_act_econ_sec": "4112",
    "desc_ciiu_act_econ_sec": "Construcción de edificios no residenciales",
    "ciiu3": "",
    "desc_ciiu3": "",
    "ciiu4": "",
    "desc_ciiu4": "",
    "cod_tipo_sociedad": "02",
    "fecha_actualizacion": "20240405",
}

*/

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { company } = await params;
  const companyRecord = await getCompanyRecordFromPathSegment(company);
  const formattedNit = formatNit(companyRecord.nit);
  return {
    title: `${companyRecord.businessName} - NIT ${formattedNit}`,
    // description: "Generated by create next app",
  };
}

export default async function page({ params }: PageProps) {
  const { company } = await params;
  const companyRecord = await getCompanyRecordFromPathSegment(company);
  const formattedNit = formatNit(companyRecord.nit);
  const [companyData, siisData] = await Promise.all([
    getRuesDataByNit(companyRecord.nit),
    siisApi(companyRecord.nit),
  ]);
  const status = companyData?.details?.estado;

  console.log(companyData, siisData);

  return (
    <article itemScope itemType="https://schema.org/Organization">
      <header className="flex flex-col gap-0 py-8 sm:gap-2">
        <h1
          itemProp="name"
          className="text-balance text-xl font-semibold text-brand sm:text-2xl"
        >
          {companyRecord.businessName}
        </h1>
        <div className="flex items-center gap-2">
          <h2 className="text-base text-slate-500 sm:text-lg">
            NIT: {formattedNit}
          </h2>
          {!!status && (
            <Badge variant={status === "ACTIVA" ? "success" : "error"}>
              {status}
            </Badge>
          )}
        </div>
      </header>
      <section>
        <h3>Detalles de la empresa</h3>
        <dl className="flex flex-col gap-2 text-sm sm:text-base">
          {detailsMapping.map((detail) => {
            const value = getCompanyDetailValue(detail.key, companyData);
            if (!value) {
              return null;
            }
            return (
              <CompanyDetail
                key={detail.label}
                value={detail.renderValue ? detail.renderValue(value) : value}
                label={detail.label}
                itemProp={detail.itemProp}
              />
            );
          })}
        </dl>
      </section>
      <section></section>
    </article>
  );
}

function renderDateValue(value: string) {
  const formattedDate = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
  return dateFormatter.format(new Date(formattedDate));
}

function getCompanyDetailValue(
  key: CompanyDetailKey,
  data: Awaited<ReturnType<typeof getRuesDataByNit>>,
) {
  if (isRuesKey(key, data)) {
    return data.rues[key];
  }
  return data.details?.[key];
}

function isRuesKey(
  key: CompanyDetailKey,
  data: Awaited<ReturnType<typeof getRuesDataByNit>>,
): key is keyof BusinessRecord {
  return key in data.rues;
}

function CompanyDetail({
  label,
  itemProp,
  value,
}: {
  label: string;
  itemProp?: string;
  value: ReactNode;
}) {
  return (
    <div key={label} className="flex flex-col gap-x-1 sm:flex-row">
      <dt className="shrink-0 text-sm text-slate-500 sm:text-base">
        {label}
        <span className="max-sm:hidden">:</span>
      </dt>
      <dd itemProp={itemProp}>{value}</dd>
    </div>
  );
}
