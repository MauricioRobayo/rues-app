export const Action = {
  SEARCH: "SEARCH",
  REVALIDATE_PATH: "REVALIDATE_PATH",
  REVALIDATE_TAG: "REVALIDATE_TAG",
} as const;

export function getRecaptchaToken(action: keyof typeof Action) {
  return window.grecaptcha.enterprise.execute(
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    { action },
  );
}
