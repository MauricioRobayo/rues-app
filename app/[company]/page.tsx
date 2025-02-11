import { Chamber, ChamberSkeleton } from "@/app/[company]/components/Chamber";
import { CompanyDetails } from "@/app/[company]/components/CompanyDetails";
import { CopyButton } from "@/app/[company]/components/CopyButton";
import { EconomicActivities } from "@/app/[company]/components/EconomicActivities";
import { ErrorRecovery } from "@/app/[company]/components/ErrorRecovery";
import { LegalRepresentativePowers } from "@/app/[company]/components/LegalRepresentativePowers";
import { LegalRepresentatives } from "@/app/[company]/components/LegalRepresentatives";
import PhoneNumbers from "@/app/[company]/components/PhoneNumbers";
import { ReadMore } from "@/app/[company]/components/ReadMore";
import { RetrievedOn } from "@/app/[company]/components/RetrievedOn";
import { ToggleContent } from "@/app/[company]/components/ToogleContent";
import type { CompanyDto } from "@/app/[company]/types/CompanyDto";
import { companiesRepository } from "@/app/repositories/companies";
import { CompanyStatusBadge } from "@/app/shared/components/CompanyStatusBadge";
import { PageContainer } from "@/app/shared/components/PageContainer";
import { BASE_URL } from "@/app/shared/lib/constants";
import { validateNit } from "@/app/shared/lib/validateNit";
import { parseCompanyPathSegment } from "@/app/shared/lib/parseCompanyPathSegment";
import { slugifyCompanyName } from "@/app/shared/lib/slugifyComponentName";
import {
  getRuesDataByNit,
  queryNit,
} from "@/app/shared/services/rues/ruesService";
import { GoogleMapsEmbed } from "@next/third-parties/google";
import {
  Box,
  Card,
  Code,
  Flex,
  Grid,
  Heading,
  Link,
  Section,
  Separator,
  Spinner,
  Text,
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

  if (!data) {
    return {
      title: "Algo ha salido mal",
    };
  }

  return {
    title: `${data.name} NIT ${data.fullNit}`,
    description: companyDescription(data),
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: data.slug,
    },
  };
}

export default async function page({ params }: PageProps) {
  const { company } = await params;
  const data = await getPageData(company);

  if (!data) {
    return <ErrorRecovery />;
  }

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
          <CopyButton value={data.nit} tooltip="Copiar NIT" />
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
    {
      label: "Sigla",
      value: data.shortName,
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
    { label: "Municipio", value: data.city },
    { label: "Departamento", value: data.state },
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
              <ToggleContent label="Ver mapa">
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
    { label: "Zona comercial", value: data.area },
    {
      label: "Teléfono",
      value:
        data.phoneNumbers && data.phoneNumbers.length > 0 ? (
          <PhoneNumbers phoneNumbers={data.phoneNumbers} />
        ) : null,
    },
    {
      label: "Corre electrónico",
      value: data.email ? (
        <Box>
          <ToggleContent label="Ver correo electrónico">
            <Link href={`mailto:${data.email}`}>{data.email}</Link>
          </ToggleContent>
        </Box>
      ) : null,
    },
    {
      label: "Cantidad de establecimientos",
      value: data.totalBusinessEstablishments,
    },
    { label: "Número de empleados", value: data.totalEmployees },
    {
      label: "Registro proponente",
      value: data.bidderId,
    },
    {
      label: "Objecto social",
      value: data.scope ? <ReadMore text={data.scope} /> : null,
    },
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
      label: "Representante legal",
      value: (
        <Flex direction="column" gap="2">
          {data.legalRepresentatives && data.legalRepresentatives.length > 0 ? (
            <LegalRepresentatives
              legalRepresentatives={data.legalRepresentatives}
            />
          ) : null}
          <details>
            <summary>Facultades del representante legal</summary>
            <Suspense fallback={<Spinner />}>
              <LegalRepresentativePowers
                chamberCode={data.chamber.code}
                registrationId={data.registrationNumber}
              />
            </Suspense>
          </details>
        </Flex>
      ),
    },
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
        value:
          establishment.phoneNumbers &&
          establishment.phoneNumbers.length > 0 ? (
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
    <Box mb="2" asChild>
      <article itemScope itemType="https://schema.org/Organization">
        <Box
          asChild
          style={{ position: "sticky", top: 0, background: "white" }}
        >
          <header>
            <PageContainer py={{ initial: "6", sm: "8" }}>
              <Card size="4" variant="ghost">
                <Flex direction="column" gap="1">
                  <Heading itemProp="name" color="blue">
                    {data.name}
                  </Heading>
                  <Flex
                    align={{ initial: "start", sm: "center" }}
                    gap="2"
                    direction={{ initial: "column", sm: "row" }}
                  >
                    <Flex justify="center" align="center" gap="2">
                      <Heading as="h2" size="4" weight="regular">
                        NIT: <span itemProp="taxID">{data.fullNit}</span>
                      </Heading>
                      <CopyButton value={data.nit} tooltip="Copiar NIT" />
                    </Flex>
                    <CompanyStatusBadge
                      isActive={data.isActive}
                      variant="long"
                    />
                  </Flex>
                </Flex>
              </Card>
            </PageContainer>
            <Separator mb={{ initial: "4", sm: "4" }} size="4" />
          </header>
        </Box>
        <PageContainer mt={{ initial: "6", sm: "8" }}>
          <Text>{companyDescription(data)}</Text>
          <Grid columns={{ initial: "1", sm: "2" }} gapX="8" width="auto">
            <Section
              size={{ initial: "1", sm: "2" }}
              id="detalles-de-la-empresa"
            >
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
                                <CompanyDetails
                                  details={establishment.details}
                                />
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
          <RetrievedOn retrievedOn={data.retrievedOn} />
        </PageContainer>
      </article>
    </Box>
  );
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

  if (!validateNit(nit)) {
    notFound();
  }

  // Cache at the NIT level to avoid multiple path segments
  // with same NIT triggering multiple duplicated API calls
  const response = await getCompanyDataCached(nit);

  if (response.status === "error") {
    return null;
  }

  if (!response.data) {
    notFound();
  }

  const companySlug = slugifyCompanyName(response.data.name);

  if (slug !== companySlug) {
    permanentRedirect(`${companySlug}-${nit}`);
  }

  return response.data;
}

const getCompanyDataCached = unstable_cache(cache(getCompanyData), undefined, {
  revalidate: false,
});

async function getCompanyData(
  nit: number,
): Promise<
  | { status: "error"; error: unknown }
  | { status: "success"; data: CompanyDto | null }
> {
  try {
    const queryResponse = await queryNit(nit);

    if (queryResponse?.data?.name) {
      return {
        status: "success",
        data: queryResponse.data,
      };
    }

    const companyData = await getRuesDataByNit({
      nit,
      token: queryResponse.token,
    });

    if (!companyData) {
      return {
        status: "success",
        data: null,
      } as const;
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

    return {
      status: "success",
      data: companyData,
    } as const;
  } catch (err) {
    console.error("Failed to get Company data for nit", nit, err);
    return {
      error: err,
      status: "error",
    } as const;
  }
}

function companyDescription(company: CompanyDto) {
  let description = `${company.name} NIT ${company.fullNit}`;

  if (company.size) {
    const companySize = company.size.toLocaleUpperCase();
    if (companySize.includes("EMPRESA")) {
      description += ` es una ${companySize}`;
    } else {
      description += ` es una ${companySize} EMPRESA`;
    }
  } else {
    description += " es una empresa";
  }

  if (company.city) {
    description += ` ubicada en ${company.city}`;
  }

  if (company.state) {
    description += `, ${company.state}`;
  }

  if (company.address) {
    description += `. Su dirección comercial es ${company.address}`;
  }

  if (company.phoneNumbers?.[0]) {
    description += ` y su teléfono de contacto es ${company.phoneNumbers[0]}`;
  }

  description += `. Fundada hace ${company.yearsDoingBusinesses}`;

  if (company.chamber?.name) {
    description += ` y registrada en la cámara de comercio de ${company.chamber.name}`;
  }

  if (company.economicActivities && company.economicActivities.length > 0) {
    const mainEconomicActivity = company.economicActivities[0];
    description += `. Su principal actividad económica corresponde al código CIIU ${mainEconomicActivity.code}: ${mainEconomicActivity.description}`;
  }

  if (company.totalEmployees || company.totalBusinessEstablishments) {
    description += ". Cuenta con";
    const totals: string[] = [];
    if (company.totalEmployees) {
      totals.push(
        ` ${company.totalEmployees} empleado${company.totalEmployees === 1 ? "" : "s"}`,
      );
    }
    if (company.totalBusinessEstablishments) {
      totals.push(
        `${company.totalBusinessEstablishments} establecimiento${company.totalBusinessEstablishments === 1 ? "" : "s"} comercial${company.totalBusinessEstablishments === 1 ? "" : "es"}`,
      );
    }
    description += totals.join(" y ");
  }

  return `${description}.`;
}
