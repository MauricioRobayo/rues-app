import { parseDetailsDate } from "@/app/lib/parseDetailsDate";

export const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "long",
  timeZone: "America/Bogota",
});

export function formatDetailsDate(value?: string) {
  if (!value) return null;
  const date = parseDetailsDate(value);
  return date ? dateFormatter.format(date) : null;
}
