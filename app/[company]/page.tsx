import { BusinessEstablishments } from "@/app/[company]/components/BusinessEstablishments";
import { CapitalDetails } from "@/app/[company]/components/CapitalDetails";
import { CommerceChamber } from "@/app/[company]/components/Chamber";
import { CompanyDetails } from "@/app/[company]/components/CompanyDetails";
import {
  companySummary,
  CompanySummary,
} from "@/app/[company]/components/CompanySummary";
import { CompanyDescription } from "@/app/[company]/components/CompanyDescription";
import { CompanyHeader } from "@/app/[company]/components/CompanyHeader";
import { ErrorRecovery } from "@/app/[company]/components/ErrorRecovery";
import { FinancialDetails } from "@/app/[company]/components/FinancialDetails";
import { NameChanges } from "@/app/[company]/components/NameChanges";
import { RetrievedOn } from "@/app/[company]/components/RetrievedOn";
import { UserReport } from "@/app/[company]/components/UserReport";
import { PageContainer } from "@/app/components/PageContainer";
import { BASE_URL, COMPANY_REVALIDATION_TIME } from "@/app/lib/constants";
import { parseCompanyPathSegment } from "@/app/lib/parseCompanyPathSegment";
import { slugifyCompanyName } from "@/app/lib/slugifyComponentName";
import { validateNit } from "@/app/lib/validateNit";
import { companiesRepository } from "@/app/services/companies/repository";
import { queryNit } from "@/app/services/rues/service";
import { Box, Flex, Grid } from "@radix-ui/themes";
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
        <PageContainer mt={{ initial: "6", sm: "8" }}>
          <CompanySummary company={data.mainRecord} />
          <CompanyDetails company={data.mainRecord} isMain />
        </PageContainer>
      </article>
      {data.remainingRecords.length > 0 && (
        <PageContainer className="bg-[var(--gray-2)]">
          {data.remainingRecords.map((companyRecord) => (
            <article key={companyRecord.registrationNumber}>
              <CompanyDetails company={companyRecord} />
            </article>
          ))}
        </PageContainer>
      )}
      <PageContainer>
        <Box mb="4">
          <RetrievedOn retrievedOn={data.mainRecord.retrievedOn} />
        </Box>
      </PageContainer>
      <aside>
        <Box style={{ background: "var(--blue-a2)" }} py="6">
          <PageContainer>
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
    data: { mainRecord, remainingRecords },
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
