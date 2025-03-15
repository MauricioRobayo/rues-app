export const BASE_URL = "https://www.registronit.com";
export const MAX_URLS_PER_SITEMAP = 2_000;
export const VALID_RUES_CATEGORIES = [
  "SOCIEDAD ó PERSONA JURIDICA PRINCIPAL ó ESAL",
];
export const COMPANY_SIZE = {
  "01": "Microempresa",
  "02": "Pequeña empresa",
  "03": "Mediana empresa",
  "04": "Gran empresa",
} as const;
export const COMPANY_REVALIDATION_TIME = 3 * 30 * 24 * 60 * 60;
export const OPEN_DATA_ENABLED = !!process.env.FEATURE_DATOS_ABIERTOS_ENABLED;
