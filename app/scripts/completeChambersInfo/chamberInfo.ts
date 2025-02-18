import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import { chambersRepository } from "@/app/services/chambers/repository";
import { tokensService } from "@/app/services/tokens/service";
import { advancedSearch, getFile } from "@mauriciorobayo/rues-api";
import * as cheerio from "cheerio";

const defaultCertificateUrl =
  "https://sii.confecamaras.co/vista/plantilla/certificados.php?empresa=";

// https://www.serviciosvirtuales.com.co/es/
const serviciosVirtuales: Record<string, string> = {
  "01": "https://www.serviciosvirtuales.com.co/es/camara/armenia/certificados/",
  "20": "https://www.serviciosvirtuales.com.co/es/camara/manizales/certificados/",
  "27": "https://www.serviciosvirtuales.com.co/es/camara/pereira/certificados/",
  "55": "https://www.serviciosvirtuales.com.co/es/camara/aburrasur/certificados/",
};

async function main() {
  const chambers = await chambersRepository.getAll([
    "name",
    "code",
    "city",
    "state",
  ]);
  for (const { code, name, city, state } of chambers) {
    const moreData = await tryToGetMoreData({ name, city, state });
    const data: {
      url?: string;
      certificateUrl?: string;
      email?: string;
      phoneNumber?: string;
    } = moreData;

    if (serviciosVirtuales[code]) {
      data.certificateUrl = serviciosVirtuales[code];
    } else {
      const url = await verifyDefaultUrl(code);
      data.certificateUrl = url ?? undefined;
    }

    if (!data.certificateUrl) {
      const token = await tokensService.getToken();
      const response = await advancedSearch({
        query: {
          razon: "de",
          cod_camara: code,
        },
        token,
      });

      const company =
        response.status === "success"
          ? response.data.registros?.at(0)
          : (console.warn(
              "failed on ",
              code,
              response.statusCode,
              response.error,
            ),
            null);

      const file = company?.id_rm
        ? await getFile({ registrationId: company.id_rm })
        : (console.warn("no id_rm on", company), null);

      const certificateUrl =
        file?.status === "success"
          ? file.data.registros.url_venta_certificados
          : (console.warn("failed to get file", code), null);

      data.certificateUrl = certificateUrl ?? undefined;
    }

    console.log(code, data);
    await chambersRepository.update(code, data);
  }
}

const chambersData = await scrapeChamberData();
async function tryToGetMoreData({
  name,
  city,
  state,
}: {
  name: string;
  city: string;
  state: string;
}) {
  const shortName = name.replace(/^Cámara de comercio (del |de )?/i, "");
  const normalizedShortName = normalize(shortName);
  const normalizedCity = normalize(city);
  const normalizedState = normalize(state);
  const moreData = chambersData.find((chamber) => {
    const normalizedChamberName = normalize(chamber.name);
    return (
      normalizedChamberName.includes(normalizedShortName) ||
      normalizedShortName.includes(normalizedChamberName) ||
      normalizedChamberName.includes(normalizedCity) ||
      normalizedCity.includes(normalizedChamberName) ||
      normalizedChamberName.includes(normalizedState) ||
      normalizedState.includes(normalizedChamberName)
    );
  });
  return {
    url: moreData?.url,
    phoneNumber: moreData?.phoneNumber,
    email: moreData?.email,
  };
}

async function verifyDefaultUrl(code: string) {
  const body = {
    x_c: "c05MFPDI4pxFc",
    y_c: "c0lkdeKR4%2F0Zk",
    cc: code.padStart(2, "0"),
    acc: 1,
  };
  const response = await fetch(
    "https://sii.confecamaras.co/controlador/Route.php",
    {
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: Object.entries(body)
        .map((entry) => entry.join("="))
        .join("&"),
      method: "POST",
    },
  );

  const data = await response.json();

  if (Number(data.codigoerror)) {
    return null;
  }

  return `${defaultCertificateUrl}${data.cc}`;
}

async function scrapeChamberData() {
  const url =
    "https://confecamaras.org.co/conozca-la-red-de-camaras-de-comercio/";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to get page ${url}`);
  }
  const html = await response.text();

  const $ = cheerio.load(html);

  const tooltips = $("#mapa-zonas .elementor-element .e-hotspot__tooltip");

  const result: {
    name: string;
    email?: string;
    url?: string;
    phoneNumber?: string;
  }[] = [];
  tooltips.each((_, element) => {
    const tooltip = $(element);

    const name = tooltip.find("b, strong").text().replace(/\s+/g, " ").trim();
    const email = tooltip
      .find('a[href^="mailto:"]')
      .attr("href")
      ?.replace("mailto:", "");
    const url = tooltip.find('a[href^="http"]').attr("href");
    const phoneNumber = tooltip
      .text()
      .match(/(?<=>)[\d()\s-]+(?=<)/)?.[0]
      .trim();
    result.push({ name, email, url, phoneNumber });
  });
  return result;
}

function normalize(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
}

main();
