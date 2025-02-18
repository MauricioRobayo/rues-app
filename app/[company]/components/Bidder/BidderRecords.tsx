"use client";

import { ExpandableList } from "@/app/[company]/components/ExpandableList";
import { useRevalidateTag } from "@/app/hooks/useRevalidateTag";
import type { BidderRecordDto } from "@/app/types/BidderDto";
import { Box, Button, Code, Flex, Text } from "@radix-ui/themes";

export function BidderRecords({
  bidderId,
  records,
}: {
  bidderId: string;
  records: BidderRecordDto[] | null;
}) {
  const { isPending, revalidateTag, hasRevalidated } = useRevalidateTag({
    tag: bidderId,
  });

  if (hasRevalidated && !records) {
    return (
      <Text color="red" size="2">
        Algo ha salido mal. Por favor, vuelva a intentarlos más tarde.
      </Text>
    );
  }

  if (!records) {
    return (
      <Box>
        <Button loading={isPending} onClick={revalidateTag}>
          Ver actas
        </Button>
      </Box>
    );
  }

  if (records.length === 0) {
    return null;
  }

  return (
    <ul>
      <ExpandableList
        items={records.map((record) => (
          <li key={record.id}>
            <Flex align="center" asChild gap="2">
              <Text size="2">
                <Code variant="ghost" color="gray">
                  {record.date}
                </Code>
                {record.type}
              </Text>
            </Flex>
          </li>
        ))}
      />
    </ul>
  );
}
