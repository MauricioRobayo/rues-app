import { DataList } from "@radix-ui/themes";
import type { JSX } from "react";

export function CompanyDetails({
  details,
  horizontal = false,
}: {
  details: {
    label: string;
    value?: string | null | number;
    render?: () => JSX.Element;
  }[];
  horizontal?: boolean;
}) {
  return (
    <DataList.Root
      orientation={horizontal ? "horizontal" : "vertical"}
      size={{ initial: "2", sm: "3" }}
    >
      {details?.map((detail) => {
        if (!detail.value && !detail.render) {
          return null;
        }
        return (
          <DataList.Item key={detail.label}>
            <DataList.Label>{detail.label}</DataList.Label>
            <DataList.Value>
              {detail.render ? detail.render() : detail.value}
            </DataList.Value>
          </DataList.Item>
        );
      })}
    </DataList.Root>
  );
}
