import { generateSitemaps } from "@/app/(sitemap)/sitemap";
import { BASE_URL } from "@/app/shared/lib/constants";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  try {
    const sitemaps = await generateSitemaps();

    const sitemapIndexXML = await buildSitemapIndex(sitemaps);

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

async function buildSitemapIndex(sitemaps: { id: number }[]) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  for (const { id } of sitemaps) {
    xml += "<sitemap>";
    xml += `<loc>${BASE_URL}/sitemap/${id}.xml</loc>`;
    xml += "</sitemap>";
  }

  xml += "</sitemapindex>";
  return xml;
}
