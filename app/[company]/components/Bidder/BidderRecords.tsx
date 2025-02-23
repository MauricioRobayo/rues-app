"use client";

import { getBidderRecordsAction } from "@/app/[company]/actions";
import { ExpandableList } from "@/app/[company]/components/ExpandableList";
import { Action, getRecaptchaToken } from "@/app/lib/getRecapchaToken";
import type { BidderRecordDto } from "@/app/types/BidderDto";
import { Box, Button, Code, Flex, Text } from "@radix-ui/themes";
import { startTransition, useActionState } from "react";

export function BidderRecords({ bidderId }: { bidderId: string }) {
  const [state, fetchRecords, isPending] = useActionState<
    | { status: "idle" }
    | { status: "success"; records: BidderRecordDto[] }
    | { status: "error" },
    string
  >(
    async (_, bidderId) => {
      const recaptchaToken = await getRecaptchaToken(Action.BIDDER_RECORDS);
      return getBidderRecordsAction({ bidderId, recaptchaToken });
    },
    { status: "idle" },
  );
  if (state.status === "error") {
    return (
      <Text color="red" size="2">
        Algo ha salido mal. Por favor, vuelva a intentarlo más tarde.
      </Text>
    );
  }
  if (state.status === "idle") {
    return (
      <Box>
        <Button
          loading={isPending}
          onClick={() => {
            startTransition(() => {
              fetchRecords(bidderId);
            });
          }}
        >
          Ver actas
        </Button>
      </Box>
    );
  }

  return (
    <ul>
      <ExpandableList
        items={state.records.map((record) => (
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
