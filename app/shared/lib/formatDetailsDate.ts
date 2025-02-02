import { parseDetailsDate } from "@/app/shared/lib/parseDetailsDate";

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "long",
  timeZone: "America/Bogota",
});

export function formatDetailsDate(value: string) {
  const date = parseDetailsDate(value);
  return date ? dateFormatter.format(date) : null;
}
