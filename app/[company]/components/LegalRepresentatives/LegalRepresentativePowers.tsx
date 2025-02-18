import { Details } from "@/app/[company]/components/Details";
import { RevalidateLegalRepresentative } from "@/app/[company]/components/LegalRepresentatives/RevalidateLegalRepresentativePowers";
import { COMPANY_REVALIDATION_TIME } from "@/app/lib/constants";
import { getLegalPowers } from "@/app/services/rues/service";
import { Box, Text } from "@radix-ui/themes";
import { unstable_cache } from "next/cache";

export async function LegalRepresentativePowers({
  chamberCode,
  registrationNumber: registrationNumber,
}: {
  chamberCode: string;
  registrationNumber: string;
}) {
  const powers = await getPowersCached({
    chamberCode,
    registrationNumber,
  });

  if (!powers) {
    return (
      <Box>
        <RevalidateLegalRepresentative
          chamberCode={chamberCode}
          registrationId={registrationNumber}
        >
          Facultades del representante legal
        </RevalidateLegalRepresentative>
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

const getPowersCached = ({
  chamberCode,
  registrationNumber,
}: {
  chamberCode: string;
  registrationNumber: string;
}) => {
  const tag = `${chamberCode}${registrationNumber}`;
  return unstable_cache(
    () =>
      getLegalPowers({
        chamberCode,
        registrationNumber,
      }),
    [tag],
    {
      revalidate: COMPANY_REVALIDATION_TIME,
      tags: [tag],
    },
  )();
};
