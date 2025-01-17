import { CompanyDetail } from "@/app/[company]/components/CompanyDetail";
import { dateFormatter } from "@/app/lib/formatters";

export function CompanyDetails({
  details,
}: {
  details: { label: string; value: string | Date | undefined | number }[];
}) {
  return (
    <dl className="flex flex-col gap-2">
      {details.map((detail) => {
        if (!detail.value) {
          return null;
        }
        return (
          <CompanyDetail
            key={detail.label}
            label={detail.label}
            // TODO: schema.org
            // itemProp={detail.itemProp}
          >
            {detail.value instanceof Date
              ? dateFormatter.format(detail.value)
              : detail.value}
          </CompanyDetail>
        );
      })}
    </dl>
  );
}
