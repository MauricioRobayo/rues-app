import { numberFormatter } from "@/app/lib/formatters";
import { getVerificationDigit } from "nit-verifier";

export function formatNit(
  nit: number,
  {
    showDecimalSeparator = true,
    showVerificationDigit = true,
  }: {
    showDecimalSeparator?: boolean;
    showVerificationDigit?: boolean;
  } = {},
) {
  let formattedNit = showDecimalSeparator
    ? numberFormatter.format(Number(nit))
    : nit;
  if (showVerificationDigit) {
    const dv = getVerificationDigit(nit);
    formattedNit += `-${dv}`;
  }
  return formattedNit;
}
