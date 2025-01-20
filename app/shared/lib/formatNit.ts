import { getVerificationDigit } from "nit-verifier";

const numberFormatter = new Intl.NumberFormat("es-CO", {
  useGrouping: true,
});

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
    : String(nit);
  if (showVerificationDigit) {
    const dv = getVerificationDigit(nit);
    formattedNit += `-${dv}`;
  }
  return formattedNit;
}
