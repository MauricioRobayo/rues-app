import { MAX_URLS_PER_SITEMAP } from "@/app/lib/constants";
import {
  companyStatus,
  companyType,
  registryCategoryCode,
} from "@/app/services/openData/constants";
import { validNit } from "@/app/services/openData/repository";
import { openDataService } from "@/app/services/openData/service";
import { unstable_cache } from "next/cache";

export const sitemapInclusionCriteria = [
  `codigo_tipo_sociedad='${companyType.SOCIEDAD_COMERCIAL}'`,
  `codigo_estado_matricula='${companyStatus.ACTIVA}'`,
  `codigo_categoria_matricula='${registryCategoryCode.SOCIEDAD_O_PERSONA_JURIDICA_PRINCIPAL_O_ESAL}'`,
  "numero_identificacion IS NOT NULL",
  "razon_social IS NOT NULL",
  validNit,
];

export const getTotalSitemaps = unstable_cache(
  async () => {
    const total = await openDataService.companyRecords.count({
      where: sitemapInclusionCriteria,
    });
    if (!total) {
      return 0;
    }
    return Math.ceil(total / MAX_URLS_PER_SITEMAP);
  },
  undefined,
  { revalidate: false },
);
