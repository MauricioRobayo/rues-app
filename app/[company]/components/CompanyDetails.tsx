import { CompanyDetail } from "@/app/[company]/components/CompanyDetail";

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "long",
  timeZone: "America/Bogota",
});

type Value =
  | string
  | Date
  | undefined
  | number
  | { url?: string; label: string };

export function CompanyDetails({
  details,
}: {
  details: { label: string; value: Value }[];
}) {
  return (
    <dl className="flex flex-col gap-2">
      {details.map((detail) => {
        const value = getDetailValue(detail.value);
        if (!value) {
          return null;
        }
        return (
          <CompanyDetail
            key={detail.label}
            label={detail.label}
            // TODO: schema.org
            // itemProp={detail.itemProp}
          >
            {value}
          </CompanyDetail>
        );
      })}
    </dl>
  );
}

function getDetailValue(value: Value) {
  if (value instanceof Date) {
    return dateFormatter.format(value);
  }

  if (typeof value !== "object") {
    return value;
  }

  if (value.url) {
    return (
      <a href={value.url} className="text-blue-600 underline">
        {value.label}
      </a>
    );
  }

  return null;
}
