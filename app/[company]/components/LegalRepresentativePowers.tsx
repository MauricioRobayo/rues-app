import { getPowers } from "@/app/shared/services/rues/ruesService";
import { Box, Text } from "@radix-ui/themes";

export async function LegalRepresentativePowers({
  chamberCode,
  registrationId,
}: {
  chamberCode: number;
  registrationId: string;
}) {
  await new Promise((resolve) => setTimeout(resolve, 10_000));
  const powers = await getPowers({
    chamberCode,
    registrationId,
  });

  if (!powers) {
    return null;
  }

  return (
    <Box p="2" className="rounded bg-[var(--gray-3)]">
      <Text size="2" dangerouslySetInnerHTML={{ __html: powers }}></Text>
    </Box>
  );
}
