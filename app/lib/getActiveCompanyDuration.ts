import { parseDetailsDate } from "@/app/lib/parseDetailsDate";
import { formatDistanceStrict, formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";

export function getActiveCompanyDuration({
  registrationDate,
  cancellationDate,
}: {
  registrationDate?: string;
  cancellationDate?: string;
}) {
  const date1 = parseDetailsDate(registrationDate);
  const date2 = parseDetailsDate(cancellationDate);
  if (date1 && date2) {
    return formatDistanceStrict(date1, date2, {
      locale: es,
    });
  }
  if (date1) {
    return formatDistanceToNowStrict(date1, {
      locale: es,
    });
  }
  return null;
}
