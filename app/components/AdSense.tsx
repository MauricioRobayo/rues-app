import Script from "next/script";

const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";
const isPreview = process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";
const shouldShowAds = isProduction || isPreview;

export function AdSense() {
  if (shouldShowAds) {
    return (
      <Script
        id="adsense-script"
        strategy="afterInteractive"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7218488611142089"
        crossOrigin="anonymous"
      />
    );
  }

  return null;
}
