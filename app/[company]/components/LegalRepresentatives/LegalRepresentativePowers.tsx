"use client";

import { Details } from "@/app/[company]/components/Details";
import { useRevalidateTag } from "@/app/hooks/useRevalidateTag";
import { Box, Button, Text } from "@radix-ui/themes";

export function LegalRepresentativePowers({
  chamberCode,
  registrationNumber,
  powers,
}: {
  chamberCode: string;
  registrationNumber: string;
  powers: string | null;
}) {
  const [isPending, revalidateTag] = useRevalidateTag({
    tag: `${chamberCode}${registrationNumber}`,
  });
  if (!powers) {
    return (
      <Box>
        <Button loading={isPending} onClick={revalidateTag}>
          Facultades del representante legal
        </Button>
      </Box>
    );
  }

  return (
    <Details summary="Facultades del representante legal">
      <Box p="2" className="rounded bg-[var(--gray-3)]">
        <Text
          size="2"
          dangerouslySetInnerHTML={{
            __html: powers.replaceAll("&nbsp;", " ").trim(),
          }}
        />
      </Box>
    </Details>
  );
}
