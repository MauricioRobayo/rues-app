import { getPowers } from "@/app/shared/services/rues/ruesService";
import { Box, Text } from "@radix-ui/themes";
import { unstable_cache } from "next/cache";

export async function LegalRepresentativePowers({
  chamberCode,
  registrationId,
}: {
  chamberCode: number;
  registrationId: string;
}) {
  const powers = await getPowersCached({
    chamberCode,
    registrationId,
  });

  if (!powers) {
    return null;
  }

  return (
    <Box p="2" className="rounded bg-[var(--gray-3)]">
      <Text size="2" asChild dangerouslySetInnerHTML={{ __html: powers }} />j
    </Box>
  );
}

const getPowersCached = unstable_cache(getPowers, undefined, {
  revalidate: 7 * 24 * 60 * 60,
});
