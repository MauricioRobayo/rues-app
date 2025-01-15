import { Badge } from "@/app/[company]/Badge";
import {
  getCompanyRecordFromPathSegment,
  slugifyCompanyName,
} from "@/app/[company]/getCompanyRecordFromPathSegment";
import { getRuesDataByNit } from "@/app/[company]/rues";
import { siisApi, type Source } from "@/app/[company]/siis";
import { formatNit } from "@/app/format-nit";
import { dateFormatter } from "@/app/formatters";
import type { File, BusinessRecord } from "@mauriciorobayo/rues-api";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { type ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { companiesRepository } from "@/app/repositories/companies";
import { permanentRedirect } from "next/navigation";
import { twJoin } from "tailwind-merge";
import { formatDistanceStrict, formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";

interface PageProps {
  params: Promise<{ company: string }>;
}

export const dynamic = "force-static";

type CompanyDetailKey = keyof BusinessRecord | keyof File | keyof Source;

type DetailsMapping = {
  key: CompanyDetailKey;
  label: string;
  renderValue?: (value: string) => ReactNode;
  itemProp?: string;
};

const economicActivityKeys: { code: keyof File; description: keyof File }[] = [
  { code: "cod_ciiu_act_econ_pri", description: "desc_ciiu_act_econ_pri" },
  { code: "cod_ciiu_act_econ_sec", description: "desc_ciiu_act_econ_sec" },
  { code: "ciiu3", description: "desc_ciiu3" },
  { code: "ciiu4", description: "desc_ciiu4" },
];

const detailsMapping: DetailsMapping[] = [
  { key: "razon_social", label: "Razón social" },
  { key: "nit", label: "NIT" },
  { key: "dv", label: "DV" },
  { key: "matricula", label: "Matrícula" },
  { key: "sigla", label: "Sigla" },
  { key: "organizacion_juridica", label: "Organización jurídica" },
  { key: "estado_matricula", label: "Estado matrícula" },
  { key: "motivo_cancelacion", label: "Motivo de cancelación" },
  {
    key: "fecha_matricula",
    label: "Fecha de constitución",
    renderValue: renderDateValue,
  },
  {
    key: "fecha_matricula",
    label: "Antigüedad",
    renderValue(value) {
      const formattedDate = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
      return formatDistanceToNowStrict(new Date(formattedDate), {
        locale: es,
      });
    },
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
  { key: "nom_camara", label: "Cámara de comercio" },
  {
    key: "url_venta_certificados",
    label: "Certificado de tradición",
    renderValue(value: string) {
      return (
        <a
          href={value}
          target="_blank"
          className="flex items-center gap-1 text-blue-600 underline"
        >
          Solicitar Certificado de Tradición
          <ExternalLink size={14} />
        </a>
      );
    },
  },
  { key: "region", label: "Región" },
  { key: "ciudad", label: "Ciudad" },
  { key: "departamento", label: "Departamento" },
  { key: "macroSector", label: "Macro sector" },
  { key: "sector", label: "Sector" },
];

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
  const companyData = await getCompanyData(companyRecord.nit);
  const status = companyData?.details?.estado;
  const companyName = companyData.rues.razon_social;

  if (companyRecord.businessName !== companyName) {
    console.log("Razon Social changed for NIT:", companyRecord.nit);
    await companiesRepository.updateBusinessNameByNit(
      companyRecord.nit,
      companyName,
    );
    const newSlug = slugifyCompanyName(companyName);
    // TODO: I should test this, don't want to fall into an infinite loop
    permanentRedirect(`${newSlug}-${companyRecord.nit}`);
  }

  const economicActivities = economicActivityKeys
    .map((key) => {
      const code = companyData.details?.[key.code];
      const description = companyData.details?.[key.description];
      if (!code || !description) {
        return null;
      }
      return { code, description };
    })
    .filter((economicActivity) => economicActivity !== null);

  return (
    <article itemScope itemType="https://schema.org/Organization">
      <header className="flex flex-col gap-0 py-8 sm:gap-2">
        <h1
          itemProp="name"
          className="text-balance text-xl font-semibold text-brand sm:text-2xl"
        >
          {companyName}
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
      <section className="flex flex-col gap-2">
        <dl className="flex flex-col gap-2 text-sm sm:text-base">
          {detailsMapping.map((detail) => {
            const value = getCompanyDetailValue(detail.key, companyData);
            if (!value) {
              return null;
            }
            return (
              <CompanyDetail
                key={detail.label}
                label={detail.label}
                itemProp={detail.itemProp}
              >
                {detail.renderValue ? detail.renderValue(value) : value}
              </CompanyDetail>
            );
          })}
        </dl>
        <EconomicActivity economicActivities={economicActivities} />
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
  data: Awaited<ReturnType<typeof getCompanyData>>,
) {
  if (isRuesKey(key, data)) {
    return data.rues[key];
  }
  if (isDetailsKey(key, data)) {
    return data.details?.[key];
  }
  return data.siis?.[key];
}

function isRuesKey(
  key: CompanyDetailKey,
  data: Awaited<ReturnType<typeof getCompanyData>>,
): key is keyof BusinessRecord {
  return key in data.rues;
}

function isDetailsKey(
  key: CompanyDetailKey,
  data: Awaited<ReturnType<typeof getCompanyData>>,
): key is keyof File {
  return key in (data?.details ?? {});
}

function CompanyDetail({
  label,
  itemProp,
  children,
  className,
}: {
  label: string;
  itemProp?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      key={label}
      className={twJoin("flex flex-col gap-x-1 sm:flex-row", className)}
    >
      <dt className="shrink-0 text-sm text-slate-500 sm:text-base">
        {label}
        <span className="max-sm:hidden">:</span>
      </dt>
      <dd itemProp={itemProp}>{children}</dd>
    </div>
  );
}

const getCompanyData = unstable_cache(async (nit) => {
  const [companyData, siis] = await Promise.all([
    getRuesDataByNit(nit),
    siisApi(nit),
  ]);
  return {
    ...companyData,
    siis,
  };
});

function EconomicActivity({
  economicActivities,
}: {
  economicActivities: { code: string; description: string }[];
}) {
  if (economicActivities.length === 1) {
    return (
      <CompanyDetail label="Actividad Económica">
        <EconomicActivityItem item={economicActivities[0]} />
      </CompanyDetail>
    );
  }
  return (
    <CompanyDetail label="Actividad Económica" className="gap-2 sm:flex-col">
      {economicActivities.length === 1 ? (
        <EconomicActivityItem item={economicActivities[0]} />
      ) : (
        <ol className="list-decimal pl-8">
          {economicActivities.map((economicActivity) => (
            <li key={economicActivity.code} className="">
              <EconomicActivityItem item={economicActivity} />
            </li>
          ))}
        </ol>
      )}
    </CompanyDetail>
  );
}

function EconomicActivityItem({
  item,
}: {
  item: { code: string; description: string };
}) {
  return (
    <>
      <small className="text-slate-500">[CIIU {item.code}]</small>{" "}
      {item.description}
    </>
  );
}
