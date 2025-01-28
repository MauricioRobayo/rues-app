import { Code, DataList, Link } from "@radix-ui/themes";

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "long",
  timeZone: "America/Bogota",
});

type Value =
  | string
  | Date
  | undefined
  | number
  | { url?: string; label: string }
  | { label: string; code: string; description: string }[];

export function CompanyDetails({
  details,
  horizontal = false,
}: {
  details: { label: string; value: Value }[];
  horizontal?: boolean;
}) {
  return (
    <DataList.Root
      orientation={horizontal ? "horizontal" : "vertical"}
      size={{ initial: "2", sm: "3" }}
    >
      {details.map((detail) => {
        const value = getDetailValue(detail.value);
        if (!value) {
          return null;
        }
        return (
          <DataList.Item key={detail.label}>
            <DataList.Label>{detail.label}</DataList.Label>
            <DataList.Value>{value}</DataList.Value>
          </DataList.Item>
        );
      })}
    </DataList.Root>
  );
}

function getDetailValue(value: Value) {
  if (value instanceof Date) {
    return dateFormatter.format(value);
  }

  if (Array.isArray(value)) {
    return (
      <ol>
        {value.map((item) => (
          <li key={item.label}>
            <DataList.Root orientation="horizontal">
              <DataList.Item>
                <DataList.Label minWidth="0">
                  <Code>{item.code}</Code>
                </DataList.Label>
                <DataList.Value>{item.description}</DataList.Value>
              </DataList.Item>
            </DataList.Root>
          </li>
        ))}
      </ol>
    );
  }

  if (typeof value !== "object") {
    return value;
  }

  if (value !== null && "url" in value && value.url) {
    return <Link href={value.url}>{value.label}</Link>;
  }

  return null;
}
