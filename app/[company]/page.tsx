import { CompanyDetails } from "@/app/[company]/components/CompanyDetails";
import {
  getChamber,
  getRuesDataByNit,
  queryNit,
} from "@/app/shared/services/rues/api";
import { getSiisInfo } from "@/app/[company]/services/siis";
import { companiesRepository } from "@/app/repositories/companies";
import { CompanyStatusBadge } from "@/app/shared/component/CompanyStatusBadge";
import { PageContainer } from "@/app/shared/component/PageContainer";
import { BASE_URL, COMPANY_SIZE } from "@/app/shared/lib/constants";
import { isValidNit } from "@/app/shared/lib/isValidNit";
import { parseCompanyPathSegment } from "@/app/shared/lib/parseCompanyPathSegment";
import { slugifyCompanyName } from "@/app/shared/lib/slugifyComponentName";
import { mapRuesResultToCompanySummary } from "@/app/shared/mappers/mapRuesResultToCompany";
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
import { decodeBase64 } from "@/app/shared/lib/decodeBase64";

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "long",
  timeZone: "America/Bogota",
});

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
            {companyData.businessEstablishments.length > 0 && (
              <Section size="2" id="establecimientos-comerciales">
                <Heading as="h3" size="4" mb="4">
                  Establecimientos Comerciales
                </Heading>
                <Flex asChild direction="column" gap="2">
                  <ul>
                    {companyData.businessEstablishments.map((establishment) => {
                      return (
                        <li key={establishment.id}>
                          <details>
                            <summary>{establishment.name}</summary>
                            <Box my="4" pl="4">
                              <CompanyDetails details={establishment.details} />
                            </Box>
                          </details>
                        </li>
                      );
                    })}
                  </ul>
                </Flex>
              </Section>
            )}
            {companyData.chamber && companyData.chamber.length > 0 && (
              <Section size="2" id="camara-de-comercio">
                <Heading as="h3" size="4" mb="2">
                  Cámara de Comercio
                </Heading>
                <CompanyDetails details={companyData.chamber} />
              </Section>
            )}
          </Box>
        </Grid>
      </PageContainer>
    </article>
  );
}

async function getCompanyData(nit: number) {
  const queryResponse = await queryNit(nit);

  if (queryResponse?.data) {
    const chamber = await getChamber(Number(queryResponse.data.codigo_camara));
    const record = queryResponse.data;
    return {
      ...mapRuesResultToCompanySummary(record),
      details: [
        { label: "Razón social", value: record.razon_social },
        { label: "NIT", value: record.numero_identificacion },
        { label: "Dígito de verificación", value: record.digito_verificacion },
        { label: "Matrícula", value: record.matricula },
        { label: "Estado", value: record.estado_matricula },
        { label: "Tipo de sociedad", value: record.tipo_sociedad },
        { label: "Organización jurídica", value: record.organizacion_juridica },
        {
          label: "Categoría de la matrícula",
          value: record.categoria_matricula,
        },
        {
          label: "Fecha de matrícula",
          value: formatDetailsDate(record.fecha_matricula),
        },
        {
          label: "Antigüedad",
          value: yearsDoingBusinesses(record.fecha_matricula),
        },
        { label: "Último año renovado", value: record.ultimo_ano_renovado },
        {
          label: "Fecha de renovación",
          value: formatDetailsDate(record.fecha_renovacion),
        },
        {
          label: "Fecha de cancelación",
          value: formatDetailsDate(record.fecha_cancelacion),
        },
        {
          label: "Tamaño de la empresa",
          value: COMPANY_SIZE[record.codigo_tamano_empresa],
        },
        { label: "Dirección", value: record.direccion_comercial },
        {
          label: "Teléfono",
          value: {
            url: `tel:${record.telefono_comercial_1}`,
            label: record.telefono_comercial_1,
          },
        },
        {
          label: "Teléfono 2",
          value: {
            url: `tel:${record.telefono_comercial_2}`,
            label: record.telefono_comercial_2,
          },
        },
        { label: "Zona comercial", value: record.zona_comercial },
        { label: "Código postal", value: record.codigo_postal_comercial },
        { label: "Municipio", value: record.municipio_comercial },
        { label: "Departamento", value: record.dpto_comercial },
        {
          label: "Objecto social",
          value: decodeBase64(record.objeto_social),
        },
        {
          label: "Actividad económica",
          value: getEconomicActivitiesFromDetails({
            ciiu1: record.cod_ciiu_act_econ_pri,
            ciiu2: record.cod_ciiu_act_econ_sec,
            ciiu3: record.ciiu3,
            ciiu4: record.ciiu4,
            descCiiu1: record.desc_ciiu_act_econ_pri,
            descCiiu2: record.desc_ciiu_act_econ_sec,
            descCiiu3: record.desc_ciiu3,
            descCiiu4: record.desc_ciiu4,
          }),
        },
        {
          label: "Actividad económica de mayores ingresos",
          value: record.ciiu_mayores_ingresos,
        },
        {
          label: "Cantidad de establecimientos",
          value: Number(record.cantidad_establecimientos),
        },
        {
          label: "Número de empleados",
          value: Number(record.numero_empleados),
        },
      ],
      chamber: getChamberDetails(chamber),
      businessEstablishments: (record.establecimientos ?? []).map(
        (establishment) => {
          return {
            name: establishment.razon_social,
            id: establishment.matricula,
            details: [
              {
                label: "Razón social",
                value: establishment.razon_social,
              },
              {
                label: "Matrícula",
                value: establishment.matricula,
              },
              {
                label: "Fecha de matrícula",
                value: formatDetailsDate(establishment.fecha_matricula),
              },
              {
                label: "Antigüedad",
                value: yearsDoingBusinesses(establishment.fecha_matricula),
              },
              {
                label: "Fecha de cancelación",
                value: formatDetailsDate(establishment.fecha_cancelacion),
              },
              {
                label: "Último año renovado",
                value: establishment.ultimo_ano_renovado,
              },
              {
                label: "Fecha de renovación",
                value: formatDetailsDate(establishment.fecha_renovacion),
              },
              {
                label: "Dirección comercial",
                value: establishment.direccion_comercial,
              },
              {
                label: "Barrio comercial",
                value: establishment.barrio_comercial,
              },
              {
                label: "Descripción actividad económico",
                value: establishment.desc_Act_Econ,
              },
              {
                label: "Actividad económica",
                value: getEconomicActivitiesFromDetails({
                  ciiu1: establishment.ciiu1,
                  ciiu2: establishment.ciiu2,
                  ciiu3: establishment.ciiu3,
                  ciiu4: establishment.ciiu4,
                  descCiiu1: establishment.desc_ciiu1,
                  descCiiu2: establishment.desc_ciiu2,
                  descCiiu3: establishment.desc_ciiu3,
                  descCiiu4: establishment.desc_ciiu4,
                }),
              },
            ],
          };
        },
      ),
    };
  }

  const [companyData, siis] = await Promise.all([
    getRuesDataByNit({ nit, token: queryResponse.token }),
    getSiisInfo(nit),
  ]);

  if (!companyData?.rues) {
    return null;
  }

  after(async () => {
    if (companyData.company?.name !== companyData.rues.razon_social) {
      await companiesRepository.upsertName({
        nit,
        name: companyData.rues.razon_social,
      });
    }
  });

  return {
    ...mapRuesResultToCompanySummary(companyData.rues),
    details: [
      {
        label: "Razón social",
        value: companyData.rues.razon_social,
      },
      { label: "NIT", value: companyData.rues.nit },
      { label: "Dígito de verificación", value: companyData.rues.dv },
      {
        label: "Matrícula",
        value: companyData.rues.matricula,
      },
      {
        label: "Estado",
        value: companyData.rues.estado_matricula,
      },
      {
        label: "Organización jurídica",
        value: companyData.rues.organizacion_juridica,
      },
      { label: "Sigla", value: companyData.rues.sigla },
      {
        label: "Fecha de creación",
        value: formatDetailsDate(companyData.details?.["fecha_matricula"]),
      },
      {
        label: "Antigüedad",
        value: yearsDoingBusinesses(companyData.details?.["fecha_matricula"]),
      },
      {
        label: "Fecha de renovación",
        value: formatDetailsDate(companyData.details?.["fecha_renovacion"]),
      },
      {
        label: "Fecha de actualización",
        value: formatDetailsDate(companyData.details?.["fecha_actualizacion"]),
      },
      {
        label: "Fecha de cancelación",
        value: formatDetailsDate(companyData.details?.["fecha_cancelacion"]),
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
        value: getEconomicActivitiesFromDetails({
          ciiu1: companyData.details?.cod_ciiu_act_econ_pri,
          ciiu2: companyData.details?.cod_ciiu_act_econ_sec,
          ciiu3: companyData.details?.ciiu3,
          ciiu4: companyData.details?.ciiu4,
          descCiiu1: companyData.details?.desc_ciiu_act_econ_pri,
          descCiiu2: companyData.details?.desc_ciiu_act_econ_sec,
          descCiiu3: companyData.details?.desc_ciiu3,
          descCiiu4: companyData.details?.desc_ciiu4,
        }),
      },
    ],
    chamber: getChamberDetails(companyData.chamber),
    businessEstablishments: (companyData.establishments ?? []).map(
      (establishment) => {
        return {
          name: establishment.RAZON_SOCIAL,
          id: establishment.MATRICULA,
          details: [
            {
              label: "Razón social",
              value: establishment.RAZON_SOCIAL,
            },
            {
              label: "Sigla",
              value: establishment.SIGLA,
            },
            {
              label: "Matrícula",
              value: establishment.MATRICULA,
            },
            {
              label: "Tipo de sociedad",
              value: establishment.DESC_TIPO_SOCIEDAD,
            },
            {
              label: "Organización jurídica",
              value: establishment.DESC_ORGANIZACION_JURIDICA,
            },
            {
              label: "Categoría",
              value: establishment.CATEGORIA_MATRICULA,
            },
            {
              label: "Estado",
              value: establishment.DESC_ESTADO_MATRICULA,
            },
            {
              label: "Fecha de constitución",
              value: formatDetailsDate(establishment.FECHA_MATRICULA),
            },
            {
              label: "Antigüedad",
              value: yearsDoingBusinesses(establishment.FECHA_MATRICULA),
            },
            {
              label: "Fecha de renovación",
              value: formatDetailsDate(establishment.FECHA_RENOVACION),
            },
            {
              label: "Último año renovado",
              value: establishment.ULTIMO_ANO_RENOVADO,
            },
          ],
        };
      },
    ),
  };
}

const getCompanyDataCached = unstable_cache(cache(getCompanyData), undefined, {
  revalidate: 7 * 24 * 60 * 60,
});

function getEconomicActivitiesFromDetails(details: {
  ciiu1?: string;
  ciiu2?: string;
  ciiu3?: string;
  ciiu4?: string;
  descCiiu1?: string;
  descCiiu2?: string;
  descCiiu3?: string;
  descCiiu4?: string;
}) {
  if (!details) {
    return [];
  }
  const economicActivities: {
    label: string;
    code: string;
    description: string;
  }[] = [];

  if (details.ciiu1 && details.descCiiu1) {
    economicActivities.push({
      label: "ciiu1",
      code: details.ciiu1,
      description: details.descCiiu1,
    });
  }

  if (details.ciiu2 && details.descCiiu2) {
    economicActivities.push({
      label: "ciiu2",
      code: details.ciiu2,
      description: details.descCiiu2,
    });
  }

  if (details.ciiu3 && details.descCiiu3) {
    economicActivities.push({
      label: "ciiu3",
      code: details.ciiu3,
      description: details.descCiiu3,
    });
  }

  if (details.ciiu4 && details.descCiiu4) {
    economicActivities.push({
      label: "ciiu4",
      code: details.ciiu4,
      description: details.descCiiu4,
    });
  }

  return economicActivities;
}

function getDateFromDetailsDate(value?: string) {
  if (!value?.trim() || value.length !== 8) {
    return undefined;
  }
  const formattedDate = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
  const date = new Date(formattedDate);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function yearsDoingBusinesses(value?: string) {
  const date = getDateFromDetailsDate(value);
  if (date) {
    return formatDistanceToNowStrict(date, {
      locale: es,
    });
  }
}

function formatDetailsDate(value?: string) {
  const date = getDateFromDetailsDate(value);
  if (date) {
    return dateFormatter.format(date);
  }
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

function getChamberDetails(chamber: Awaited<ReturnType<typeof getChamber>>) {
  if (!chamber) {
    return null;
  }
  return [
    { label: "Nombre", value: chamber.name },
    { label: "Dirección", value: chamber.address },
    { label: "Ciudad", value: chamber.city },
    { label: "Departamento", value: chamber.state },
  ];
}
