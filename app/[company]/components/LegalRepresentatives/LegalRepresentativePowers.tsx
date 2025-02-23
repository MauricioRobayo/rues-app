"use client";

import { getLegalPowersAction } from "@/app/[company]/actions";
import { Action, getRecaptchaToken } from "@/app/lib/getRecapchaToken";
import { Box, Button, Text } from "@radix-ui/themes";
import { startTransition, useActionState } from "react";

export function LegalRepresentativePowers({
  chamberCode,
  registrationNumber,
}: {
  chamberCode: string;
  registrationNumber: string;
}) {
  const [state, fetchLegalPowers, isPending] = useActionState<
    | { status: "idle" }
    | { status: "error" }
    | { status: "success"; data: string },
    { chamberCode: string; registrationNumber: string }
  >(
    async (_, { chamberCode, registrationNumber }) => {
      const recaptchaToken = await getRecaptchaToken(Action.LEGAL_POWERS);
      return getLegalPowersAction({
        chamberCode,
        registrationNumber,
        recaptchaToken,
      });
    },
    { status: "idle" },
  );
  if (state.status === "error") {
    return (
      <Text color="red" size="2">
        Algo ha salido mal. Por favor, vuelva a intentarlos más tarde.
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
              fetchLegalPowers({ chamberCode, registrationNumber });
            });
          }}
        >
          Facultades del representante legal
        </Button>
      </Box>
    );
  }

  return (
    <Box p="2" className="rounded-[var(--radius-2)] bg-[var(--gray-2)]">
      <Text
        size="2"
        dangerouslySetInnerHTML={{
          __html: state.data.replaceAll("&nbsp;", " ").trim(),
        }}
      />
    </Box>
  );
}
