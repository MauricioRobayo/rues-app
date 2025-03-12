import { CompanyDetails } from "@/app/[company]/components/CompanyDetails";
import { CompanyHeader } from "@/app/[company]/components/CompanyHeader";
import {
  companySummary,
  CompanySummary,
} from "@/app/[company]/components/CompanySummary";
import { ErrorRecovery } from "@/app/[company]/components/ErrorRecovery";
import { RetrievedOn } from "@/app/[company]/components/RetrievedOn";
import { UserReport } from "@/app/[company]/components/UserReport";
import { CompanyStatusBadge } from "@/app/components/CompanyStatusBadge";
import { PageContainer } from "@/app/components/PageContainer";
import { BASE_URL, COMPANY_REVALIDATION_TIME } from "@/app/lib/constants";
import { parseCompanyPathSegment } from "@/app/lib/parseCompanyPathSegment";
import { slugifyCompanyName } from "@/app/lib/slugifyComponentName";
import { validateNit } from "@/app/lib/validateNit";
import { companiesRepository } from "@/app/services/companies/repository";
import { ruesService } from "@/app/services/rues/service";
import { Box, Flex, Heading } from "@radix-ui/themes";
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
  const { isError, data, nit } = await getPageData(company);

  if (isError) {
    return {
      title: `${nit}: Algo ha salido mal`,
    };
  }

  return {
    title: `${data.mainRecord.name} NIT ${data.mainRecord.fullNit}`,
    description: companySummary(data.mainRecord),
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: data.mainRecord.slug,
    },
  };
}

export default async function page({ params }: PageProps) {
  const { company } = await params;
  const { isError, data } = await getPageData(company);

  if (isError) {
    return <ErrorRecovery />;
  }

  return (
    <Box>
      <article itemScope itemType="https://schema.org/Organization">
        <CompanyHeader company={data.mainRecord} />
        <PageContainer wide mt={{ initial: "6", sm: "8" }}>
          <CompanySummary company={data.mainRecord} />
          <CompanyDetails company={data.mainRecord} />
        </PageContainer>
      </article>
      {data.remainingRecords.length > 0 && (
        <PageContainer wide>
          <Heading as="h4" mb="4">
            Registros Anteriores ({data.remainingRecords.length})
          </Heading>
          <Flex direction="column" gap="2">
            {data.remainingRecords.map((companyRecord) => (
              <details
                key={companyRecord.registrationNumber}
                name="matricula-mercantil"
              >
                <summary>
                  <Flex gap="2" display="inline-flex">
                    {companyRecord.registrationNumber}
                    <CompanyStatusBadge
                      isActive={companyRecord.isActive}
                      variant="long"
                    />
                  </Flex>
                </summary>
                <Box
                  px="4"
                  my="2"
                  className="rounded-[var(--radius-2)] bg-[var(--gray-2)]"
                  asChild
                >
                  <article>
                    <CompanyDetails company={companyRecord} />
                  </article>
                </Box>
              </details>
            ))}
          </Flex>
        </PageContainer>
      )}
      <PageContainer wide>
        <Box my="4">
          <RetrievedOn retrievedOn={data.retrievedOn} />
        </Box>
      </PageContainer>
      <aside>
        <Box style={{ background: "var(--blue-a2)" }} py="6">
          <PageContainer wide>
            <Flex direction="column" gap="4" align="center">
              <UserReport slug={data.mainRecord.slug} />
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

  const [mainRecord, ...remainingRecords] = response.data ?? [];
  if (!mainRecord) {
    notFound();
  }

  const { name } = mainRecord;
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
    data: {
      mainRecord,
      remainingRecords,
      retrievedOn: response.retrievedOn,
    },
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

const queryNitCached = unstable_cache(ruesService.queryNit, undefined, {
  revalidate: COMPANY_REVALIDATION_TIME,
});
