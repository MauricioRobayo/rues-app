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
  const { isPending, revalidateTag, hasRevalidated } = useRevalidateTag({
    tag: `${chamberCode}${registrationNumber}`,
  });
  if (hasRevalidated && !powers) {
    return (
      <Text color="red" size="2">
        Algo ha salido mal. Por favor, vuelva a intentarlos más tarde.
      </Text>
    );
  }
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
    <Details summary="Facultades del representante legal" open={hasRevalidated}>
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
