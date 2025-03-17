export function parseDetailsDate(value?: string | null) {
  if (!value?.trim() || value.length !== 8) {
    return null;
  }

  const date = Date.parse(
    /^\d{8}$/.test(value)
      ? `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`
      : value,
  );
  return Number.isNaN(date) ? null : date;
}
