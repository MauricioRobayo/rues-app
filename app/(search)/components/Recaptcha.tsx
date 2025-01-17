import Script from "next/script";

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

export function Recaptcha() {
  return (
    <Script
      src={`https://www.google.com/recaptcha/enterprise.js?render=${siteKey}`}
    />
  );
}
