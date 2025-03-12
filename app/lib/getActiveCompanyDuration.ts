import { parseDetailsDate } from "@/app/lib/parseDetailsDate";
import { formatDistanceStrict } from "date-fns";
import { es } from "date-fns/locale";

export function getActiveCompanyDuration({
  registrationDate,
  cancellationDate,
}: {
  registrationDate: string | null;
  cancellationDate?: string | null;
}) {
  const startDate = parseDetailsDate(registrationDate);
  const endDate = parseDetailsDate(cancellationDate) ?? new Date();
  if (startDate && endDate) {
    return formatDistanceStrict(startDate, endDate, {
      locale: es,
    });
  }
  return null;
}
