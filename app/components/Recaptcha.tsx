import Script from "next/script";

export function Recaptcha({
  siteKey,
  language,
}: {
  siteKey: string;
  language?: string;
}) {
  const searchParams = new URLSearchParams();
  searchParams.append("render", siteKey);
  if (language) {
    searchParams.append("hl", language);
  }
  return (
    <Script
      id="google-recaptcha"
      src={`https://www.google.com/recaptcha/enterprise.js?render=${siteKey}&hl=${language}`}
    />
  );
}
