export function isCompanyActive(status: string) {
  return !/cancel/i.test(status);
}
