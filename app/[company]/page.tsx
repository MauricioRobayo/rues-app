import { BidderRecords } from "@/app/[company]/components/BidderRecords";
import { Chamber, ChamberSkeleton } from "@/app/[company]/components/Chamber";
import { CompanyDetails } from "@/app/[company]/components/CompanyDetails";
import { CopyButton } from "@/app/[company]/components/CopyButton";
import { Details } from "@/app/[company]/components/Details";
import { EconomicActivities } from "@/app/[company]/components/EconomicActivities";
import { ErrorRecovery } from "@/app/[company]/components/ErrorRecovery";
import { LegalRepresentativePowers } from "@/app/[company]/components/LegalRepresentativePowers";
import { LegalRepresentatives } from "@/app/[company]/components/LegalRepresentatives";
import PhoneNumbers from "@/app/[company]/components/PhoneNumbers";
import { ReadMore } from "@/app/[company]/components/ReadMore";
import { RetrievedOn } from "@/app/[company]/components/RetrievedOn";
import { ExpandableList } from "@/app/[company]/components/ExpandableList";
import { ToggleContent } from "@/app/[company]/components/ToogleContent";
import { CompanyStatusBadge } from "@/app/components/CompanyStatusBadge";
import { PageContainer } from "@/app/components/PageContainer";
import { BASE_URL, COMPANY_REVALIDATION_TIME } from "@/app/lib/constants";
import { currencyFormatter } from "@/app/lib/formatters";
import { parseCompanyPathSegment } from "@/app/lib/parseCompanyPathSegment";
import { slugifyCompanyName } from "@/app/lib/slugifyComponentName";
import { validateNit } from "@/app/lib/validateNit";
import { companiesRepository } from "@/app/services/companies/repository";
import { getRuesDataByNit, queryNit } from "@/app/services/rues/service";
import type { CompanyDto } from "@/app/types/CompanyDto";
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
      learnMore: (
        <Box>
          Es el nombre con el que se constituye una empresa y que aparece como
          tal en el documento público o privado de constitución o en los
          documentos posteriores que la reforman.
        </Box>
      ),
    },
    {
      label: "NIT",
      value: (
        <Flex align="center" gap="2">
          <Code variant="ghost">{data.nit}</Code>
          <CopyButton value={data.nit} />
        </Flex>
      ),
      learnMore:
        "Es el Número de Identificación Tributaria, por sus siglas, es el identificador numérico único utilizado para registrar la administración tributaria de las personas naturales y jurídicas. El NIT consta de nueve dígitos y se otorga a través de la Dirección de Impuestos y Aduanas Nacionales (DIAN) con el fin de llevar un registro detallado de las obligaciones tributarias por las que deben responder los colombianos.",
    },
    {
      label: "Dígito de verificación",
      value: <Code variant="ghost">{data.verificationDigit}</Code>,
      learnMore:
        "Es un número que va en un rango del cero (0) a nueve (9) y se ubica al final del NIT. Su objetivo es verificar la autenticidad del NIT.",
    },
    {
      label: "Matrícula",
      value: (
        <Flex align="center" gap="2">
          <Code variant="ghost">{data.registrationNumber}</Code>
          <CopyButton value={data.registrationNumber} />
          <CompanyStatusBadge isActive={data.isActive} />
        </Flex>
      ),
      learnMore:
        "La Matrícula Mercantil es el registro que deben hacer los comerciantes, ya sean personas naturales o jurídicas, y los establecimientos de comercio, en las cámaras de comercio con jurisdicción en el lugar donde van a desarrollar su actividad y donde va a funcionar el establecimiento de comercio, para dar cumplimiento a una de las obligaciones mercantiles dispuestas en el Código de comercio.",
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
      value: data.bidderId ? (
        <Flex direction="column" gap="2">
          <Flex gap="2" align="center">
            <Code variant="ghost">{data.bidderId.padStart(8, "0")}</Code>
            <CopyButton value={data.bidderId.padStart(8, "0")} />
          </Flex>
          <Suspense fallback={<Spinner />}>
            <BidderRecords bidderId={data.bidderId} />
          </Suspense>
        </Flex>
      ) : null,
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
          <Details summary="Facultades del representante legal">
            <Suspense fallback={<Spinner />}>
              <LegalRepresentativePowers
                chamberCode={data.chamber.code}
                registrationId={data.registrationNumber}
              />
            </Suspense>
          </Details>
        </Flex>
      ),
    },
  ];

  const establishments = data.establishments?.map((establishment) => ({
    id: establishment.registrationNumber,
    name: establishment.name,
    tourismRegistries: (establishment.tourismRegistries ?? []).map(
      (registry) => ({
        id: registry.id,
        details: [
          { label: "RNT", value: <Code variant="ghost">{registry.id}</Code> },
          { label: "Nombre", value: registry.name },
          { label: "Estado", value: registry.status },
          { label: "Último año actualizado", value: registry.lastUpdatedYear },
          { label: "Categoría", value: registry.category },
          { label: "Subcategoría", value: registry.subCategory },
          { label: "Municipio", value: registry.municipality },
          { label: "Departamento", value: registry.department },
          { label: "Dirección comercial", value: registry.commercialAddress },
          { label: "Teléfono fijo", value: registry.landlinePhone },
          { label: "Teléfono celular", value: registry.mobilePhone },
          {
            label: "Municipio de notificación",
            value: registry.notificationMunicipality,
          },
          {
            label: "Departamento de notificación",
            value: registry.notificationDepartment,
          },
          {
            label: "Dirección de notificación",
            value: registry.notificationAddress,
          },
          {
            label: "Teléfono de notificación",
            value: registry.notificationPhone ? (
              <Link href={`tel:${registry.notificationPhone}`}>
                {registry.notificationPhone}
              </Link>
            ) : null,
          },
          {
            label: "Correo electrónico",
            value: registry.email ? (
              <Box>
                <ToggleContent label="Ver correo electrónico">
                  <Link href={`mailto:${registry.email}`}>
                    {registry.email}
                  </Link>
                </ToggleContent>
              </Box>
            ) : null,
          },
          { label: "Número de empleados", value: registry.employees },
          {
            label: "Nombre del prestador",
            value: registry.providerCompanyName,
          },
          {
            label: "NIT del prestador",
            value: <Code variant="ghost">{registry.providerNIT}</Code>,
          },
          {
            label: "DV del prestador",
            value: registry.providerDV && (
              <Code variant="ghost">{registry.providerDV}</Code>
            ),
          },
          { label: "Representante legal", value: registry.legalRepresentative },
          {
            label: "Identificación del representante legal",
            value: registry.legalRepresentativeId,
          },
          {
            label: "Teléfono del prestador",
            value: registry.providerPhone ? (
              <Link href={`tel:${registry.providerPhone}`}>
                {registry.providerPhone}
              </Link>
            ) : null,
          },
          {
            label: "Correo electrónico del prestador",
            value: registry.email ? (
              <Box>
                <ToggleContent label="Ver correo electrónico">
                  <Link href={`mailto:${registry.email}`}>
                    {registry.email}
                  </Link>
                </ToggleContent>
              </Box>
            ) : null,
          },
        ],
      }),
    ),
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
        value:
          establishment.economicActivities &&
          establishment.economicActivities.length > 0 ? (
            <EconomicActivities activities={establishment.economicActivities} />
          ) : null,
      },
    ],
  }));

  const financialInformation = data.financialInformation
    ?.toSorted((a, b) => b.financialYear - a.financialYear)
    .map((info) => ({
      year: info.financialYear,
      details: [
        { label: "Activo corriente", value: info.currentAssets },
        { label: "Activo no corriente", value: info.nonCurrentAssets },
        { label: "Activo total", value: info.totalAssets },
        { label: "Pasivo corriente", value: info.currentLiabilities },
        { label: "Pasivo no corriente", value: info.nonCurrentLiabilities },
        { label: "Pasivo total", value: info.totalLiabilities },
        { label: "Patrimonio neto", value: info.netEquity },
        {
          label: "Ingresos de actividad ordinaria",
          value: info.ordinaryActivityIncome,
        },
        { label: "Otros ingresos", value: info.otherIncome },
        { label: "Costo de ventas", value: info.costOfSales },
        { label: "Gastos operacionales", value: info.operatingExpenses },
        { label: "Otros gastos", value: info.otherExpenses },
        { label: "Gastos de impuestos", value: info.taxExpenses },
        {
          label: "Utilidad/Pérdida operacional",
          value: info.operatingProfitOrLoss,
        },
        { label: "Resultado del período", value: info.periodResult },
        {
          label: "Capital social extranjero privado",
          value: info.privateForeignEquity,
        },
        {
          label: "Capital social extranjero público",
          value: info.publicForeignEquity,
        },
        {
          label: "Capital social nacional privado",
          value: info.privateNationalEquity,
        },
        {
          label: "Capital social nacional público",
          value: info.publicNationalEquity,
        },
      ].map(({ label, value }) => ({
        label,
        value: value ? currencyFormatter.format(value) : value,
      })),
    }))
    .at(0);

  const capitalInformation = data.capitalInformation
    ?.toSorted((a, b) => b.capitalModificationDate - a.capitalModificationDate)
    .map((info) => [
      {
        label: "Fecha de modificación del capital",
        value: info.capitalModificationDate,
      },
      {
        label: "Capital social",
        value: info.shareCapital
          ? currencyFormatter.format(info.shareCapital)
          : info.shareCapital,
      },
      {
        label: "Capital autorizado",
        value: info.authorizedCapital
          ? currencyFormatter.format(info.authorizedCapital)
          : info.authorizedCapital,
      },
      {
        label: "Capital suscrito",
        value: info.subscribedCapital
          ? currencyFormatter.format(info.subscribedCapital)
          : info.subscribedCapital,
      },
      {
        label: "Capital pagado",
        value: info.paidCapital
          ? currencyFormatter.format(info.paidCapital)
          : info.paidCapital,
      },
    ])
    .at(0);

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
                      <CopyButton value={data.nit} />
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
          <Grid
            columns={{ initial: "1", sm: "2" }}
            gapX="8"
            width="auto"
            flow="row-dense"
          >
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
              <Section size="2" id="camara-de-comercio">
                <Heading as="h3" size="4" mb="2">
                  Cámara de Comercio
                </Heading>
                <Suspense fallback={<ChamberSkeleton />}>
                  <Chamber code={data.chamber.code} />
                </Suspense>
              </Section>
              {financialInformation && (
                <Section size="2" id="informacion-financiera">
                  <Heading as="h3" size="4" mb="2">
                    Información financiera {financialInformation.year}
                  </Heading>
                  <Details summary="Ver información financiera">
                    <CompanyDetails details={financialInformation.details} />
                  </Details>
                </Section>
              )}
              {capitalInformation && (
                <Section size="2" id="informacion-de-capitales">
                  <Heading as="h3" size="4" mb="2">
                    Información de Capitales
                  </Heading>
                  <Details summary="Ver información de capitales">
                    <CompanyDetails details={capitalInformation} />
                  </Details>
                </Section>
              )}
              {establishments.length > 0 && (
                <Section size="2" id="establecimientos-comerciales">
                  <Heading as="h3" size="4" mb="4">
                    Establecimientos Comerciales
                  </Heading>
                  <Flex asChild direction="column" gap="2">
                    <ul>
                      <ExpandableList
                        initialVisibleCount={25}
                        items={establishments.map((establishment) => {
                          return (
                            <li
                              key={
                                establishment.id ??
                                establishment.tourismRegistries.at(0)?.id
                              }
                            >
                              <details>
                                <summary>
                                  {establishment.name ??
                                    `RNT ${establishment.tourismRegistries.at(0)?.id}`}
                                </summary>
                                <Flex my="4" pl="4" direction="column" gap="4">
                                  <CompanyDetails
                                    details={establishment.details}
                                  />
                                  {(establishment.tourismRegistries ?? []).map(
                                    (registry) => (
                                      <Flex
                                        key={registry.id}
                                        direction="column"
                                        gap="4"
                                      >
                                        <Heading as="h4" size="4">
                                          Registro Nacional de Turismo
                                        </Heading>
                                        <CompanyDetails
                                          details={registry.details}
                                        />
                                      </Flex>
                                    ),
                                  )}
                                </Flex>
                              </details>
                            </li>
                          );
                        })}
                      />
                    </ul>
                  </Flex>
                </Section>
              )}
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

  if (!response.data?.name) {
    notFound();
  }

  const companySlug = slugifyCompanyName(response.data.name);

  if (slug !== companySlug) {
    permanentRedirect(`${companySlug}-${nit}`);
  }

  return response.data;
}

const getCompanyDataCached = unstable_cache(cache(getCompanyData), undefined, {
  revalidate: COMPANY_REVALIDATION_TIME,
});

async function getCompanyData(
  nit: number,
): Promise<
  | { status: "error"; error: unknown }
  | { status: "success"; data: CompanyDto | null }
> {
  try {
    const queryResponse = await queryNit(nit);

    if (queryResponse.data) {
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
