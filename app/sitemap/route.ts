import { BASE_URL } from "@/app/lib/constants";
import { getTotalSitemaps } from "@/app/sitemap/getTotalSitemaps";
import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  try {
    const totalSitemaps = await getTotalSitemapsCached();

    const sitemapIndexXML = buildSitemapIndex(totalSitemaps);

    return new NextResponse(sitemapIndexXML, {
      headers: {
        "Content-Type": "application/xml",
        "Content-Length": Buffer.byteLength(sitemapIndexXML).toString(),
      },
    });
  } catch (error) {
    console.error("Error generating sitemap index:", error);
    return NextResponse.error();
  }
}

function buildSitemapIndex(totalSitemaps: number) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  for (let i = 0; i < totalSitemaps; i++) {
    xml += "<sitemap>";
    xml += `<loc>${BASE_URL}/sitemap/${i}</loc>`;
    xml += "</sitemap>";
  }

  xml += "</sitemapindex>";
  return xml;
}

const getTotalSitemapsCached = unstable_cache(getTotalSitemaps, undefined, {
  revalidate: 24 * 60 * 60,
});
