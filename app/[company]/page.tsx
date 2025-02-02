import { CompanyDetails } from "@/app/[company]/components/CompanyDetails";
import { CopyButton } from "@/app/[company]/components/CopyButton";
import { EconomicActivities } from "@/app/[company]/components/EconomicActivities";
import PhoneNumbers from "@/app/[company]/components/PhoneNumbers";
import { companiesRepository } from "@/app/repositories/companies";
import { CompanyStatusBadge } from "@/app/shared/component/CompanyStatusBadge";
import { PageContainer } from "@/app/shared/component/PageContainer";
import { BASE_URL } from "@/app/shared/lib/constants";
import { isValidNit } from "@/app/shared/lib/isValidNit";
import { parseCompanyPathSegment } from "@/app/shared/lib/parseCompanyPathSegment";
import { slugifyCompanyName } from "@/app/shared/lib/slugifyComponentName";
import { getRuesDataByNit, queryNit } from "@/app/shared/services/rues/api";
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
  const { company: slug } = await params;
  const company = await getPageData(slug);

  const details = [
    { label: "Razón social", value: company.name },
    {
      label: "NIT",
      value: (
        <Flex align="center" gap="2">
          <Code variant="ghost">{company.nit}</Code>
          <CopyButton value={company.nit} />
        </Flex>
      ),
    },
    {
      label: "Dígito de verificación",
      value: <Code variant="ghost">{company.verificationDigit}</Code>,
    },
    {
      label: "Matrícula",
      value: (
        <Flex align="center" gap="2">
          <Code variant="ghost">{company.registrationNumber}</Code>
          <CompanyStatusBadge isActive={company.isActive} />
        </Flex>
      ),
    },
    {
      label: "Estado",
      value: company.status.split(" ").length > 1 ? company.status : null,
    },
    { label: "Tipo de sociedad", value: company.type },
    { label: "Organización jurídica", value: company.legalEntityType },
    { label: "Categoría de la matrícula", value: company.category },
    { label: "Fecha de matrícula", value: company.registrationDate },
    { label: "Antigüedad", value: company.yearsDoingBusinesses },
    { label: "Último año renovado", value: company.lastRenewalYear },
    { label: "Fecha de renovación", value: company.renewalDate },
    { label: "Fecha de cancelación", value: company.cancellationDate },
    { label: "Tamaño de la empresa", value: company.size },
    { label: "Dirección", value: company.address },
    {
      label: "Teléfono",
      value: company.phoneNumbers ? (
        <PhoneNumbers phoneNumbers={company.phoneNumbers} />
      ) : null,
    },
    { label: "Zona comercial", value: company.area },
    { label: "Municipio", value: company.city },
    { label: "Departamento", value: company.state },
    { label: "Objecto social", value: company.scope },
    {
      label: "Actividad económica",
      value: <EconomicActivities activities={company.economicActivities} />,
    },
    {
      label: "Actividad económica de mayores ingresos",
      value: company.highestRevenueEconomicActivityCode,
    },
    {
      label: "Cantidad de establecimientos",
      value: company.totalBusinessEstablishments,
    },
    { label: "Número de empleados", value: company.totalEmployees },
  ];

  const establishments = company.establishments.map((establishment) => ({
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
                <Heading itemProp="name" color="sky">
                  {company.name}
                </Heading>
                <Flex align="center" gap="2">
                  <Heading as="h2" size="4" itemProp="taxID" weight="regular">
                    NIT {company.fullNit}
                  </Heading>
                  <CopyButton value={company.nit} />
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
            {company.establishments.length > 0 && (
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
            {/* {companyData.chamber && companyData.chamber.length > 0 && (
              <Section size="2" id="camara-de-comercio">
                <Heading as="h3" size="4" mb="2">
                  Cámara de Comercio
                </Heading>
                <CompanyDetails details={companyData.chamber} />
              </Section>
            )} */}
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

const getCompanyDataCached = unstable_cache(cache(getCompanyData), undefined, {
  revalidate: 7 * 24 * 60 * 60,
});

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
