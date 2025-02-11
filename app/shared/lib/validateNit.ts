export function validateNit(nit: number | string) {
  const nitN = typeof nit === "string" ? Number(nit) : nit;
  return !Number.isNaN(nitN) && String(nitN).length >= 8;
}
