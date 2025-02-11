import { validateNit } from "@/app/shared/lib/validateNit";
import { getVerificationDigit } from "nit-verifier";

const numberFormatter = new Intl.NumberFormat("es-CO", {
  useGrouping: true,
});

export function formatNit(
  nit: number | string,
  {
    showDecimalSeparator = true,
    showVerificationDigit = true,
  }: {
    showDecimalSeparator?: boolean;
    showVerificationDigit?: boolean;
  } = {},
) {
  if (!validateNit(nit)) {
    return "";
  }
  let formattedNit = showDecimalSeparator
    ? numberFormatter.format(Number(nit))
    : String(nit);
  if (showVerificationDigit) {
    const dv = getVerificationDigit(nit);
    formattedNit += `-${dv}`;
  }
  return formattedNit;
}
