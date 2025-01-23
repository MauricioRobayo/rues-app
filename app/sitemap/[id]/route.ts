import { companiesRepository } from "@/app/repositories/companies";
import { BASE_URL, MAX_URLS_PER_SITEMAP } from "@/app/shared/lib/constants";
import { slugifyCompanyName } from "@/app/shared/lib/slugifyComponentName";
import { getTotalSitemaps } from "@/app/sitemap/getTotalSitemaps";
import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import pRetry from "p-retry";

export const dynamic = "force-static";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const sitemapId = Number(id);
    if (Number.isNaN(sitemapId)) {
      return Response.json(
        { message: "Not found" },
        {
          status: 404,
        },
      );
    }
    const totalSitemaps = await getTotalSitemaps();
    if (sitemapId < 0 || sitemapId >= totalSitemaps) {
      return Response.json(
        { message: "Not found" },
        {
          status: 404,
        },
      );
    }

    const companies = (await getAllCompanies(sitemapId)).map((company) => {
      const companySlug = slugifyCompanyName(company.name);
      const url = `${BASE_URL}/${companySlug}-${company.nit}`;
      return {
        url,
        lastModified: company.timestamp?.toISOString(),
      };
    });

    const sitemap = await buildSitemap(companies);

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Content-Length": Buffer.byteLength(sitemap).toString(),
      },
    });
  } catch (error) {
    console.error("Error generating sitemap index:", error);
    return NextResponse.error();
  }
}

async function buildSitemap(
  companies: { url: string; lastModified: string }[],
) {
  let xml = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  for (const { url, lastModified } of companies) {
    xml += "<url>";
    xml += `<loc>${url}</loc>`;
    xml += `<lastmod>${lastModified}</lastmod>`;
    xml += "</url>";
  }

  xml += "</urlset>";
  return xml;
}

const getAllCompanies = unstable_cache((sitemapId) =>
  pRetry(
    () =>
      companiesRepository.getAll({
        offset: sitemapId * MAX_URLS_PER_SITEMAP,
        limit: MAX_URLS_PER_SITEMAP,
      }),
    {
      retries: 5,
      onFailedAttempt: (error) => {
        console.log("companiesRepository.getAll failed with error:", error);
      },
    },
  ),
);
