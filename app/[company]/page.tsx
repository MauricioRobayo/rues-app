import { Container } from "@/app/(search)/components/Container";
import { Badge } from "@/app/[company]/components2/Badge";
import { CompanyDetail } from "@/app/[company]/components2/CompanyDetail";
import { EconomicActivity } from "@/app/[company]/components2/EconomicActivity";
import { Section } from "@/app/[company]/components2/Section";
import { getCompanyRecordFromPathSegment } from "@/app/[company]/getCompanyRecordFromPathSegment";
import { getRuesDataByNit } from "@/app/[company]/services/rues";
import { siisApi, type Source } from "@/app/[company]/services/siis";
import type { chambers } from "@/app/db/schema";
import { formatNit } from "@/app/format-nit";
import { dateFormatter } from "@/app/formatters";
import { companiesRepository } from "@/app/repositories/companies";
import { slugifyCompanyName } from "@/app/utils/slugify-company-name";
import type {
  BusinessEstablishment,
  BusinessRecord,
  File,
} from "@mauriciorobayo/rues-api";
import { formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { permanentRedirect } from "next/navigation";
import { type ReactNode } from "react";

interface PageProps {
  params: Promise<{ company: string }>;
}

export const dynamic = "force-static";

type CompanyDetailKey = keyof BusinessRecord | keyof File | keyof Source;

type DetailsMapping<T> = {
  key: T;
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

type ChamberDetailKey =
  | keyof Omit<typeof chambers.$inferSelect, "id" | "code">
  | keyof File;
const chamberDetails: DetailsMapping<ChamberDetailKey>[] = [
  { key: "name", label: "Nombre" },
  { key: "address", label: "Dirección" },
  { key: "city", label: "Ciudad" },
  { key: "state", label: "Departamento" },
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
];

type EstablishmentKeys = keyof BusinessEstablishment;
const establishmentsDetails: DetailsMapping<EstablishmentKeys>[] = [
  { key: "RAZON_SOCIAL", label: "Razón social" },
  { key: "SIGLA", label: "Sigla" },
  { key: "MATRICULA", label: "Matrícula" },
  { key: "DESC_TIPO_SOCIEDAD", label: "Tipo de sociedad" },
  { key: "DESC_ORGANIZACION_JURIDICA", label: "Organización jurídica" },
  { key: "CATEGORIA_MATRICULA", label: "Categoría" },
  { key: "DESC_ESTADO_MATRICULA", label: "Estado" },
  {
    key: "FECHA_MATRICULA",
    label: "Fecha de constitución",
    renderValue: renderDateValue,
  },
  {
    key: "FECHA_MATRICULA",
    label: "Antigüedad",
    renderValue(value) {
      const formattedDate = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
      return formatDistanceToNowStrict(new Date(formattedDate), {
        locale: es,
      });
    },
  },
  {
    key: "FECHA_RENOVACION",
    label: "Fecha de renovación",
    renderValue: renderDateValue,
  },
  { key: "ULTIMO_ANO_RENOVADO", label: "Último año renovado" },
];

const companyDetails: DetailsMapping<CompanyDetailKey>[] = [
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
    console.warn("Razon Social changed for NIT:", companyRecord.nit);
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
    <article
      itemScope
      itemType="https://schema.org/Organization"
      className="mb-16 flex w-full flex-col gap-8"
    >
      <header className="flex flex-col gap-0 border-t-2 border-slate-200 bg-slate-100 sm:gap-2">
        <Container className="my-8">
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
              <Badge
                status={status === "ACTIVA" ? "success" : "error"}
                type="color"
              >
                {status}
              </Badge>
            )}
          </div>
        </Container>
      </header>
      <Container className="mx-auto grid max-w-4xl grid-flow-row-dense grid-cols-1 gap-6 sm:grid-cols-2">
        <Section id="detalles-de-la-empresa">
          <Section.title>Detalles de la Empresa</Section.title>
          <dl className="flex flex-col gap-2">
            {companyDetails.map((detail) => {
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
        </Section>
        <div className="contents flex-col sm:flex sm:gap-6">
          <Section id="camara-de-comercio">
            <Section.title>Cámara de Comercio</Section.title>
            <dl className="flex flex-col gap-2">
              {chamberDetails.map((detail) => {
                const value = getChamberDetailValue(detail.key, companyData);
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
          </Section>
          {(companyData.establishments ?? []).length > 0 && (
            <Section id="establecimientos-comerciales">
              <Section.title>Establecimientos Comerciales</Section.title>
              {companyData.establishments?.map((establishment) => {
                return (
                  <details key={establishment.MATRICULA}>
                    <summary>{establishment.RAZON_SOCIAL}</summary>
                    <dl className="flex flex-col gap-2 p-4">
                      {establishmentsDetails.map((detail) => {
                        const value = establishment[detail.key];
                        if (!value) {
                          return null;
                        }
                        return (
                          <CompanyDetail
                            key={detail.label}
                            label={detail.label}
                            itemProp={detail.itemProp}
                          >
                            {detail.renderValue
                              ? detail.renderValue(String(value))
                              : value}
                          </CompanyDetail>
                        );
                      })}
                    </dl>
                  </details>
                );
              })}
            </Section>
          )}
        </div>
      </Container>
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

function getChamberDetailValue(
  key: ChamberDetailKey,
  data: Awaited<ReturnType<typeof getCompanyData>>,
) {
  if (isDetailsKey(key, data)) {
    return data.details?.[key];
  }
  return data.chamber?.[key];
}

function isRuesKey(
  key: CompanyDetailKey,
  data: Awaited<ReturnType<typeof getCompanyData>>,
): key is keyof BusinessRecord {
  return key in data.rues;
}

function isDetailsKey(
  key: CompanyDetailKey | ChamberDetailKey,
  data: Awaited<ReturnType<typeof getCompanyData>>,
): key is keyof File {
  return key in (data?.details ?? {});
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
