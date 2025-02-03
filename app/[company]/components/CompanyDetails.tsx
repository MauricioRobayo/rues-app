import { DataList } from "@radix-ui/themes";
import type { ReactNode } from "react";

export interface CompanyDetail {
  label: string;
  value: ReactNode;
}

export function CompanyDetails({
  details,
  horizontal = false,
}: {
  details: CompanyDetail[];
  horizontal?: boolean;
}) {
  return (
    <DataList.Root
      orientation={horizontal ? "horizontal" : "vertical"}
      size={{ initial: "2", sm: "3" }}
    >
      {details?.map((detail) => {
        if (!detail.value) {
          return null;
        }
        return (
          <DataList.Item key={detail.label}>
            <DataList.Label>{detail.label}</DataList.Label>
            <DataList.Value>{detail.value}</DataList.Value>
          </DataList.Item>
        );
      })}
    </DataList.Root>
  );
}
