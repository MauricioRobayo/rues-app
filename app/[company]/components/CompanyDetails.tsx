import { LearnMore } from "@/app/components/LearnMore";
import { DataList, Flex } from "@radix-ui/themes";
import type { ReactNode } from "react";

export interface CompanyDetail {
  label: string;
  value: ReactNode;
  learnMore?: ReactNode;
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
            <DataList.Label>
              <Flex align="center" gap="2">
                {detail.label}
                {detail.learnMore && (
                  <LearnMore label={detail.label}>{detail.learnMore}</LearnMore>
                )}
              </Flex>
            </DataList.Label>
            <DataList.Value>{detail.value}</DataList.Value>
          </DataList.Item>
        );
      })}
    </DataList.Root>
  );
}
