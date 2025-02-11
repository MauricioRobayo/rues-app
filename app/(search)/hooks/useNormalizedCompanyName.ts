import { useSearchParams } from "next/navigation";

export function useNormalizedCompanyName() {
  const searchParams = useSearchParams();
  const companyName = searchParams.get("razon-social");
  if (!companyName) {
    return "";
  }
  return companyName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}
