"use client";
import { Recaptcha } from "@/app/(search)/components/Recaptcha";
import { getPowers } from "@/app/[company]/actions";
import { RECAPTCHA_POWERS_ACTION } from "@/app/shared/lib/constants";
import { Box, Button, Flex, Text } from "@radix-ui/themes";
import { useState, useTransition, type ReactNode } from "react";

export function LegalRepresentativePowers({
  chamberCode,
  registrationId,
  children,
}: {
  chamberCode: string;
  registrationId: string;
  children: ReactNode;
}) {
  const [powers, setPowers] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleOnClick = () => {
    startTransition(async () => {
      const recaptchaToken = await window.grecaptcha.enterprise.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        { action: RECAPTCHA_POWERS_ACTION },
      );
      const data = await getPowers({
        query: { chamberCode, businessRegistrationNumber: registrationId },
        recaptchaToken,
      });
      setPowers(data ?? "");
    });
  };
  return (
    <>
      <Recaptcha />
      {powers ? (
        <Box p="2" className="rounded bg-[var(--gray-3)]">
          <Text size="2" dangerouslySetInnerHTML={{ __html: powers }}></Text>
        </Box>
      ) : (
        <Flex direction="column" gap="2">
          {children}
          <Box>
            <Button onClick={handleOnClick} loading={isPending}>
              Ver facultades
            </Button>
          </Box>
        </Flex>
      )}
    </>
  );
}
