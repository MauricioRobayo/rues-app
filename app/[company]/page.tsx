import { CompanyDetails } from "@/app/[company]/components/CompanyDetails";
import { getRuesDataByNit } from "@/app/shared/services/rues/api";
import { siisApi } from "@/app/[company]/services/siis";
import { companiesRepository } from "@/app/repositories/companies";
import { CompanyStatusBadge } from "@/app/shared/component/CompanyStatusBadge";
import { PageContainer } from "@/app/shared/component/PageContainer";
import { BASE_URL } from "@/app/shared/lib/constants";
import { isValidNit } from "@/app/shared/lib/isValidNit";
import { parseCompanyPathSegment } from "@/app/shared/lib/parseCompanyPathSegment";
import { slugifyCompanyName } from "@/app/shared/lib/slugifyComponentName";
import { mapRuesResultToCompanySummary } from "@/app/shared/mappers/mapRuesResultToCompany";
import type { File } from "@mauriciorobayo/rues-api";
import {
  Box,
  Card,
  Flex,
  Grid,
  Heading,
  Section,
  Separator,
} from "@radix-ui/themes";
import { formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { notFound, permanentRedirect } from "next/navigation";
import { after } from "next/server";
import { cache } from "react";

interface PageProps {
  params: Promise<{ company: string }>;
}

export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { company } = await params;
  const companyData = await getPageData(company);

  return {
    title: `${companyData.name} NIT ${companyData.fullNit}`,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: companyData.slug,
    },
  };
}

export default async function page({ params }: PageProps) {
  const { company } = await params;
  const companyData = await getPageData(company);

  return (
    <article itemScope itemType="https://schema.org/Organization">
      <Box asChild style={{ position: "sticky", top: 0, background: "white" }}>
        <header>
          <PageContainer py={{ initial: "6", sm: "8" }}>
            <Card size="4" variant="ghost">
              <Heading itemProp="name" color="sky">
                {companyData.name}
              </Heading>
              <Flex align="center" gap="2">
                <Heading as="h2" size="4" itemProp="taxID">
                  NIT: {companyData.fullNit}
                </Heading>
                <CompanyStatusBadge isActive={companyData.isActive} />
              </Flex>
            </Card>
          </PageContainer>
          <Separator mb={{ initial: "4", sm: "4" }} size="4" />
        </header>
      </Box>
      <PageContainer>
        <Grid columns={{ initial: "1", sm: "2" }} gapX="8" width="auto">
          <Section size={{ initial: "1", sm: "2" }} id="detalles-de-la-empresa">
            <Heading as="h3" size="4" mb="2">
              Detalles de la Empresa
            </Heading>
            <CompanyDetails details={companyData.details} />
          </Section>
          <Box>
            <Section size="2" id="camara-de-comercio">
              <Heading as="h3" size="4" mb="2">
                Cámara de Comercio
              </Heading>
              <CompanyDetails details={companyData.chamber} />
            </Section>
            {companyData.businessEstablishments.length > 0 && (
              <Section size="2" id="establecimientos-comerciales">
                <Heading as="h3" size="4" mb="4">
                  Establecimientos Comerciales
                </Heading>
                {companyData.businessEstablishments.map((establishment) => {
                  return (
                    <details key={establishment.id}>
                      <summary style={{ marginBottom: "1rem" }}>
                        {establishment.name}
                      </summary>
                      <CompanyDetails details={establishment.details} />
                    </details>
                  );
                })}
              </Section>
            )}
          </Box>
        </Grid>
      </PageContainer>
    </article>
  );
}

async function getCompanyData(nit: number) {
  const [companyData, siis] = await Promise.all([
    getRuesDataByNit(nit),
    siisApi(nit),
  ]);

  if (!companyData?.rues) {
    return null;
  }

  after(async () => {
    await companiesRepository.upsertName({
      nit,
      name: companyData.rues.razon_social,
    });
  });

  const registrationDate = gatDateFromDetailsDate(
    companyData.details?.["fecha_matricula"],
  );

  return {
    ...mapRuesResultToCompanySummary(companyData.rues),
    details: [
      {
        label: "Razón social",
        value: companyData.rues["razon_social"],
      },
      { label: "NIT", value: companyData.rues["nit"] },
      { label: "DV", value: companyData.rues["dv"] },
      {
        label: "Matrícula",
        value: companyData.rues["matricula"],
      },
      { label: "Sigla", value: companyData.rues["sigla"] },
      {
        label: "Organización jurídica",
        value: companyData.rues["organizacion_juridica"],
      },
      {
        label: "Estado",
        value: companyData.rues["estado_matricula"],
      },
      {
        label: "Fecha de creación",
        value: registrationDate,
      },
      {
        label: "Antigüedad",
        value: getYearsOfBusiness(registrationDate),
      },
      {
        label: "Fecha de renovación",
        value: gatDateFromDetailsDate(
          companyData.details?.["fecha_renovacion"],
        ),
      },
      {
        label: "Fecha de actualización",
        value: gatDateFromDetailsDate(
          companyData.details?.["fecha_actualizacion"],
        ),
      },
      {
        label: "Fecha de cancelación",
        value: gatDateFromDetailsDate(
          companyData.details?.["fecha_cancelacion"],
        ),
      },
      {
        label: "Último año renovado",
        value: companyData.details?.["ultimo_ano_renovado"],
      },
      {
        label: "Indicador de emprendimiento social",
        value: companyData.details?.["indicador_emprendimiento_social"],
      },
      {
        label: "Tipo de sociedad",
        value: companyData.details?.["tipo_sociedad"],
      },
      {
        label: "Tamaño de la empresa",
        value: companyData.company?.size ?? undefined,
      },
      { label: "Dirección", value: companyData.company?.address ?? undefined },
      {
        label: "Extinción de dominio",
        value: companyData.details?.extincion_dominio,
      },
      { label: "Región", value: siis?.region },
      {
        label: "Departamento",
        value:
          siis?.["departamento"] ?? companyData.company?.state ?? undefined,
      },
      {
        label: "Ciudad",
        value: siis?.ciudad ?? companyData.company?.city ?? undefined,
      },
      { label: "Macro sector", value: siis?.macroSector },
      { label: "Sector", value: siis?.sector },
      {
        label: "Actividad económica",
        value: getEconomicActivitiesFromDetails(companyData.details),
      },
    ],
    chamber: [
      { label: "Nombre", value: companyData.chamber?.["name"] },
      { label: "Dirección", value: companyData.chamber?.["address"] },
      { label: "Ciudad", value: companyData.chamber?.["city"] },
      { label: "Departamento", value: companyData.chamber?.["state"] },
      {
        label: "Certificado de tradición",
        value: {
          url: companyData.details?.["url_venta_certificados"],
          label: "Descargar certificado de tradición en línea",
        },
      },
    ],
    businessEstablishments: (companyData.establishments ?? []).map(
      (establishment) => {
        const creationDate = gatDateFromDetailsDate(
          establishment["FECHA_MATRICULA"],
        );
        return {
          name: establishment["RAZON_SOCIAL"],
          id: establishment["MATRICULA"],
          details: [
            {
              label: "Razón social",
              value: establishment["RAZON_SOCIAL"],
            },
            {
              label: "Sigla",
              value: establishment["SIGLA"],
            },
            {
              label: "Matrícula",
              value: establishment["MATRICULA"],
            },
            {
              label: "Tipo de sociedad",
              value: establishment["DESC_TIPO_SOCIEDAD"],
            },
            {
              label: "Organización jurídica",
              value: establishment["DESC_ORGANIZACION_JURIDICA"],
            },
            {
              label: "Categoría",
              value: establishment["CATEGORIA_MATRICULA"],
            },
            {
              label: "Estado",
              value: establishment["DESC_ESTADO_MATRICULA"],
            },
            {
              label: "Fecha de constitución",
              value: creationDate,
            },
            {
              label: "Antigüedad",
              value: getYearsOfBusiness(creationDate),
            },
            {
              label: "Fecha de renovación",
              value: gatDateFromDetailsDate(establishment["FECHA_RENOVACION"]),
            },
            {
              label: "Último año renovado",
              value: establishment["ULTIMO_ANO_RENOVADO"],
            },
          ],
        };
      },
    ),
  };
}

const getCompanyDataCached = unstable_cache(cache(getCompanyData), undefined, {
  revalidate: 2 * 24 * 60 * 60, // 2 Days
});

function getYearsOfBusiness(date?: Date) {
  return date
    ? formatDistanceToNowStrict(date, {
        locale: es,
      })
    : undefined;
}

function getEconomicActivitiesFromDetails(details: File | undefined) {
  if (!details) {
    return [];
  }
  const economicActivities = [
    {
      code: details["cod_ciiu_act_econ_pri"],
      description: details["desc_ciiu_act_econ_pri"],
    },
  ];

  if (details["cod_ciiu_act_econ_sec"] && details["desc_ciiu_act_econ_sec"]) {
    economicActivities.push({
      code: details["cod_ciiu_act_econ_sec"],
      description: details["desc_ciiu_act_econ_sec"],
    });
  }

  if (details["ciiu3"] && details["desc_ciiu3"]) {
    economicActivities.push({
      code: details["ciiu3"],
      description: details["desc_ciiu3"],
    });
  }

  if (details["ciiu4"] && details["desc_ciiu_act_econ_sec"]) {
    economicActivities.push({
      code: details["ciiu4"],
      description: details["desc_ciiu4"],
    });
  }

  return economicActivities;
}

function gatDateFromDetailsDate(value?: string) {
  if (!value?.trim() || value.length !== 8) {
    return undefined;
  }
  const formattedDate = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
  const date = new Date(formattedDate);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

// This function is unintentionally not cached so we can handle logic based
// on the segmentPath which can be different given the same nit:
//   - rnit.co/930123456
//   - rnit.co/razon-social-930123456
//   - rnit.co/razon-social-cambio-930123456
// all of the above should trigger this uncached logic to do proper redirects
// Get DO cache fetching the data based on the NIT, so we avoid doing requests
// to the APIs given the same NIT if we already got the data.
async function getPageData(company: string) {
  const { nit, slug } = parseCompanyPathSegment(company);

  if (!isValidNit(nit)) {
    notFound();
  }

  // Cache at the NIT level to avoid multiple path segments with same NIT
  // triggering multiple duplicated API calls
  const companyData = await getCompanyDataCached(nit);

  if (!companyData) {
    notFound();
  }

  const companySlug = slugifyCompanyName(companyData.name);

  if (slug !== companySlug) {
    permanentRedirect(`${companySlug}-${nit}`);
  }

  return companyData;
}
