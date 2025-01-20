export function isValidNit(nit: number) {
  return !Number.isNaN(nit) && String(nit).length >= 8;
}
