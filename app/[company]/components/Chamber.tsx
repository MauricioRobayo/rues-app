import {
  CompanyDetails,
  type CompanyDetail,
} from "@/app/[company]/components/CompanyDetails";

export async function Chamber({
  chamberPromise,
}: {
  chamberPromise: Promise<CompanyDetail[] | null>;
}) {
  const chamber = await chamberPromise;
  if (!chamber) {
    return <div>Algo salió mal.</div>;
  }
  return <CompanyDetails details={chamber} />;
}
