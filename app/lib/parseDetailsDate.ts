export function parseDetailsDate(value?: string) {
  if (!value?.trim() || value.length !== 8) {
    return null;
  }
  const formattedDate = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
  const date = new Date(formattedDate);
  return Number.isNaN(date.getTime()) ? null : date;
}
