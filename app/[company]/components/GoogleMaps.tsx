import { GoogleMapsEmbed } from "@next/third-parties/google";

export default function GoogleMaps({ q }: { q: string }) {
  return (
    <GoogleMapsEmbed
      apiKey={process.env.GOOGLE_MAPS_API_KEY ?? ""}
      height={400}
      width="100%"
      mode="place"
      q={q}
    />
  );
}
