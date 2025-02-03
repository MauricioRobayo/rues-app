import { parseDetailsDate } from "@/app/shared/lib/parseDetailsDate";
import { formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";

export function yearsDoingBusinesses(value: string) {
  const date = parseDetailsDate(value);
  return date
    ? formatDistanceToNowStrict(date, {
        locale: es,
      })
    : null;
}
