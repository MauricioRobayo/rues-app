import { Bidder } from "@/app/[company]/components/Bidder/Bidder";
import { Chamber, ChamberSkeleton } from "@/app/[company]/components/Chamber";
import { DataList } from "@/app/[company]/components/DataList";
import { CopyButton } from "@/app/[company]/components/CopyButton";
import { Details } from "@/app/[company]/components/Details";
import { EconomicActivities } from "@/app/[company]/components/EconomicActivities";
import { ErrorRecovery } from "@/app/[company]/components/ErrorRecovery";
import { ExpandableList } from "@/app/[company]/components/ExpandableList";
import { LegalRepresentatives } from "@/app/[company]/components/LegalRepresentatives/LegalRepresentatives";
import PhoneNumbers from "@/app/[company]/components/PhoneNumbers";
import { ReadMore } from "@/app/[company]/components/ReadMore";
import { RetrievedOn } from "@/app/[company]/components/RetrievedOn";
import { ToggleContent } from "@/app/[company]/components/ToogleContent";
import { UserReport } from "@/app/[company]/components/UserReport";
import { CompanyStatusBadge } from "@/app/components/CompanyStatusBadge";
import { PageContainer } from "@/app/components/PageContainer";
import { BASE_URL, COMPANY_REVALIDATION_TIME } from "@/app/lib/constants";
import { currencyFormatter } from "@/app/lib/formatters";
import { parseCompanyPathSegment } from "@/app/lib/parseCompanyPathSegment";
import { slugifyCompanyName } from "@/app/lib/slugifyComponentName";
import { validateNit } from "@/app/lib/validateNit";
import { companiesRepository } from "@/app/services/companies/repository";
import { queryNit } from "@/app/services/rues/service";
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
  Text,
} from "@radix-ui/themes";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { notFound, permanentRedirect } from "next/navigation";
import { after } from "next/server";
import { cache, Suspense } from "react";
import { CompanyDetails } from "@/app/[company]/components/CompanyDetails";

interface PageProps {
  params: Promise<{ company: string }>;
}

export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { company } = await params;
  const { isError, data, nit } = await getPageData(company);

  if (isError) {
    return {
      title: `${nit}: Algo ha salido mal`,
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
  const { isError, data } = await getPageData(company);

  if (isError) {
    return <ErrorRecovery />;
  }

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
    <Box>
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
            <CompanyDetails company={data} />
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
                    <DataList items={financialInformation.details} />
                  </Details>
                </Section>
              )}
              {capitalInformation && (
                <Section size="2" id="informacion-de-capitales">
                  <Heading as="h3" size="4" mb="2">
                    Información de Capitales
                  </Heading>
                  <Details summary="Ver información de capitales">
                    <DataList items={capitalInformation} />
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
                                  <DataList items={establishment.details} />
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
                                        <DataList items={registry.details} />
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
          <Box mb="4">
            <RetrievedOn retrievedOn={data.retrievedOn} />
          </Box>
        </PageContainer>
      </article>
      <aside>
        <Box style={{ background: "var(--blue-a2)" }} py="6">
          <PageContainer>
            <Flex direction="column" gap="4" align="center">
              <UserReport slug={data.slug} />
            </Flex>
          </PageContainer>
        </Box>
      </aside>
    </Box>
  );
}

const getPageData = cache(async (company: string) => {
  const { nit, slug } = parseCompanyPathSegment(company);

  if (!validateNit(nit)) {
    notFound();
  }

  const response = await queryNitCached(nit);

  if (response.status === "error") {
    return {
      nit,
      slug,
      ...responseStatus("error"),
    };
  }

  if (!response.data?.name) {
    notFound();
  }

  const { name } = response.data;
  const companySlug = slugifyCompanyName(name);

  if (slug !== companySlug) {
    permanentRedirect(`/${companySlug}-${nit}`);
  }

  after(async () => {
    // This record might not be in the db.
    // If it is we always want to update it
    // so the "lastmod" in the sitemap is
    // also updated.
    await companiesRepository.upsertName({
      nit,
      name,
    });
  });

  return {
    nit,
    slug,
    data: response.data,
    ...responseStatus("success"),
  };
});

function responseStatus(status: "success"): {
  isError: false;
  isSuccess: true;
};
function responseStatus(status: "error"): {
  data?: never;
  isError: true;
  isSuccess: false;
};
function responseStatus(status: "success" | "error") {
  return {
    isSuccess: status === "success",
    isError: status === "error",
  };
}

const queryNitCached = unstable_cache(queryNit, undefined, {
  revalidate: COMPANY_REVALIDATION_TIME,
});

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
