import { parseDetailsDate } from "@/app/lib/parseDetailsDate";
import { formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";

export function yearsDoingBusinesses(value?: string) {
  if (!value) return null;
  const date = parseDetailsDate(value);
  return date
    ? formatDistanceToNowStrict(date, {
        locale: es,
      })
    : null;
}
