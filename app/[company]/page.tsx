import { Chamber, ChamberSkeleton } from "@/app/[company]/components/Chamber";
import { CompanyDetails } from "@/app/[company]/components/CompanyDetails";
import { CopyButton } from "@/app/[company]/components/CopyButton";
import { EconomicActivities } from "@/app/[company]/components/EconomicActivities";
import GoogleMaps from "@/app/[company]/components/GoogleMaps";
import PhoneNumbers from "@/app/[company]/components/PhoneNumbers";
import { ToggleContent } from "@/app/[company]/components/ToogleContent";
import { companiesRepository } from "@/app/repositories/companies";
import { CompanyStatusBadge } from "@/app/shared/component/CompanyStatusBadge";
import { PageContainer } from "@/app/shared/component/PageContainer";
import { BASE_URL } from "@/app/shared/lib/constants";
import { isValidNit } from "@/app/shared/lib/isValidNit";
import { parseCompanyPathSegment } from "@/app/shared/lib/parseCompanyPathSegment";
import { slugifyCompanyName } from "@/app/shared/lib/slugifyComponentName";
import { getRuesDataByNit, queryNit } from "@/app/shared/services/rues/api";
import { GoogleMapsEmbed } from "@next/third-parties/google";
import {
  Box,
  Card,
  Code,
  Flex,
  Grid,
  Heading,
  Section,
  Separator,
} from "@radix-ui/themes";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { notFound, permanentRedirect } from "next/navigation";
import { after } from "next/server";
import { cache, Suspense } from "react";

interface PageProps {
  params: Promise<{ company: string }>;
}

export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { company } = await params;
  const data = await getPageData(company);

  return {
    title: `${data.name} NIT ${data.fullNit}`,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: data.slug,
    },
  };
}

export default async function page({ params }: PageProps) {
  const { company } = await params;
  const data = await getPageData(company);

  const details = [
    {
      label: "Razón social",
      value: data.name,
    },
    {
      label: "NIT",
      value: (
        <Flex align="center" gap="2">
          <Code variant="ghost">{data.nit}</Code>
          <CopyButton value={data.nit} />
        </Flex>
      ),
    },
    {
      label: "Dígito de verificación",
      value: <Code variant="ghost">{data.verificationDigit}</Code>,
    },
    {
      label: "Matrícula",
      value: (
        <Flex align="center" gap="2">
          <Code variant="ghost">{data.registrationNumber}</Code>
          <CompanyStatusBadge isActive={data.isActive} />
        </Flex>
      ),
    },
    {
      label: "Estado",
      value: data.status.split(" ").length > 1 ? data.status : null,
    },
    { label: "Tipo de sociedad", value: data.type },
    { label: "Organización jurídica", value: data.legalEntityType },
    { label: "Categoría de la matrícula", value: data.category },
    { label: "Fecha de matrícula", value: data.registrationDate },
    { label: "Antigüedad", value: data.yearsDoingBusinesses },
    { label: "Último año renovado", value: data.lastRenewalYear },
    { label: "Fecha de renovación", value: data.renewalDate },
    { label: "Fecha de cancelación", value: data.cancellationDate },
    { label: "Tamaño de la empresa", value: data.size },
    {
      label: "Dirección",
      value:
        data.address &&
        data.city &&
        data.state &&
        process.env.GOOGLE_MAPS_API_KEY ? (
          <Flex direction="column" gap="2" width="100%">
            {data.address}
            <Box>
              <ToggleContent>
                <GoogleMapsEmbed
                  apiKey={process.env.GOOGLE_MAPS_API_KEY}
                  height={400}
                  width="100%"
                  mode="place"
                  q={`${data.address},${data.city},${data.state},Colombia`}
                />
              </ToggleContent>
            </Box>
          </Flex>
        ) : null,
    },
    {
      label: "Teléfono",
      value: data.phoneNumbers ? (
        <PhoneNumbers phoneNumbers={data.phoneNumbers} />
      ) : null,
    },
    { label: "Zona comercial", value: data.area },
    { label: "Municipio", value: data.city },
    { label: "Departamento", value: data.state },
    { label: "Objecto social", value: data.scope },
    {
      label: "Actividad económica",
      value: <EconomicActivities activities={data.economicActivities} />,
    },
    {
      label: "Actividad económica de mayores ingresos",
      value: data.highestRevenueEconomicActivityCode ? (
        <Code size="2">{data.highestRevenueEconomicActivityCode}</Code>
      ) : null,
    },
    {
      label: "Cantidad de establecimientos",
      value: data.totalBusinessEstablishments,
    },
    { label: "Número de empleados", value: data.totalEmployees },
  ];

  const establishments = data.establishments?.map((establishment) => ({
    id: establishment.registrationNumber,
    name: establishment.name,
    details: [
      {
        label: "Razón social",
        value: establishment.name,
      },
      {
        label: "Matrícula",
        value: establishment.registrationNumber,
      },
      {
        label: "Fecha de matrícula",
        value: establishment.registrationDate,
      },
      {
        label: "Antigüedad",
        value: establishment.yearsDoingBusinesses,
      },
      {
        label: "Fecha de cancelación",
        value: establishment.cancellationDate,
      },
      {
        label: "Último año renovado",
        value: establishment.lastRenewalYear,
      },
      {
        label: "Fecha de renovación",
        value: establishment.renewalDate,
      },
      {
        label: "Teléfono",
        value: establishment.phoneNumbers ? (
          <PhoneNumbers phoneNumbers={establishment.phoneNumbers} />
        ) : null,
      },
      {
        label: "Dirección comercial",
        value: establishment.address,
      },
      {
        label: "Descripción actividad económica",
        value: establishment.economicActivityDescription,
      },
      {
        label: "Actividad económica",
        value: establishment.economicActivities ? (
          <EconomicActivities activities={establishment.economicActivities} />
        ) : null,
      },
    ],
  }));

  return (
    <article itemScope itemType="https://schema.org/Organization">
      <Box asChild style={{ position: "sticky", top: 0, background: "white" }}>
        <header>
          <PageContainer py={{ initial: "6", sm: "8" }}>
            <Card size="4" variant="ghost">
              <Flex direction="column" gap="1">
                <Heading itemProp="name" color="blue">
                  {data.name}
                </Heading>
                <Flex align="center" gap="2">
                  <Heading as="h2" size="4" weight="regular">
                    NIT: <span itemProp="taxID">{data.fullNit}</span>
                  </Heading>
                  <CompanyStatusBadge isActive={data.isActive} variant="long" />
                </Flex>
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
            <CompanyDetails details={details} />
          </Section>
          <Box>
            {data.establishments.length > 0 && (
              <Section size="2" id="establecimientos-comerciales">
                <Heading as="h3" size="4" mb="4">
                  Establecimientos Comerciales
                </Heading>
                <Flex asChild direction="column" gap="2">
                  <ul>
                    {establishments.map((establishment) => {
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
            <Section size="2" id="camara-de-comercio">
              <Heading as="h3" size="4" mb="2">
                Cámara de Comercio
              </Heading>
              <Suspense fallback={<ChamberSkeleton />}>
                <Chamber code={data.chamber.code} />
              </Suspense>
            </Section>
          </Box>
        </Grid>
      </PageContainer>
    </article>
  );
}

async function getCompanyData(nit: number) {
  const queryResponse = await queryNit(nit);

  if (queryResponse?.data) {
    return queryResponse.data;
  }

  const companyData = await getRuesDataByNit({
    nit,
    token: queryResponse.token,
  });

  if (!companyData) {
    return null;
  }

  after(async () => {
    // This record might not be in the db.
    // If it is we always want to update it
    // so the "lastmod" in the sitemap is
    // also updated.
    await companiesRepository.upsertName({
      nit,
      name: companyData.name,
    });
  });

  return companyData;
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
  const data = await getCompanyDataCached(nit);

  if (!data) {
    notFound();
  }

  const companySlug = slugifyCompanyName(data.name);

  if (slug !== companySlug) {
    permanentRedirect(`${companySlug}-${nit}`);
  }

  return data;
}

const getCompanyDataCached = unstable_cache(cache(getCompanyData), undefined, {
  revalidate: 7 * 24 * 60 * 60,
});
