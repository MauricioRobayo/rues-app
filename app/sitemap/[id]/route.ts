import { BASE_URL, MAX_URLS_PER_SITEMAP } from "@/app/lib/constants";
import { slugifyCompanyName } from "@/app/lib/slugifyComponentName";
import { openDataService } from "@/app/services/openData/service";
import {
  getTotalSitemaps,
  sitemapInclusionCriteria,
} from "@/app/sitemap/getTotalSitemaps";
import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = false;

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

    const data = await openDataService.companyRecords.getAll({
      offset: sitemapId * MAX_URLS_PER_SITEMAP,
      limit: MAX_URLS_PER_SITEMAP,
      where: sitemapInclusionCriteria,
      select: ["numero_identificacion", "razon_social"],
    });

    const companies = data.map((company) => {
      const companySlug = slugifyCompanyName(company.razon_social);
      return {
        url: `${BASE_URL}/${companySlug}-${company.numero_identificacion}`,
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

async function buildSitemap(companies: { url: string }[]) {
  let xml = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  for (const { url } of companies) {
    xml += "<url>";
    xml += `<loc>${url}</loc>`;
    xml += `<lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>`;
    xml += "</url>";
  }

  xml += "</urlset>";
  return xml;
}
