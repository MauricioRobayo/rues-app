import { LearnMore } from "@/app/components/LearnMore";
import { DataList as RadixDataList, Flex } from "@radix-ui/themes";
import type { ReactNode } from "react";

export interface Item {
  label: string;
  value: ReactNode;
  learnMore?: ReactNode;
}

export function DataList({
  items,
  horizontal = false,
}: {
  items: Item[];
  horizontal?: boolean;
}) {
  return (
    <RadixDataList.Root
      orientation={horizontal ? "horizontal" : "vertical"}
      size={{ initial: "2", sm: "3" }}
    >
      {items?.map((detail) => {
        if (!detail.value) {
          return null;
        }
        return (
          <RadixDataList.Item key={detail.label}>
            <RadixDataList.Label>
              <Flex align="center" gap="2">
                {detail.label}
                {detail.learnMore && (
                  <LearnMore label={detail.label}>{detail.learnMore}</LearnMore>
                )}
              </Flex>
            </RadixDataList.Label>
            <RadixDataList.Value>{detail.value}</RadixDataList.Value>
          </RadixDataList.Item>
        );
      })}
    </RadixDataList.Root>
  );
}
