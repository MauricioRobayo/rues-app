import { dateFormatter } from "@/app/lib/formatters";
import { parseDetailsDate } from "@/app/lib/parseDetailsDate";

export function formatDetailsDate(value?: string) {
  if (!value) return null;
  const date = parseDetailsDate(value);
  return date ? dateFormatter.format(date) : null;
}
