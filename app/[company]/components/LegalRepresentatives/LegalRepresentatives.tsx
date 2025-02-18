import { LegalRepresentativePowers } from "@/app/[company]/components/LegalRepresentatives/LegalRepresentativePowers";
import { COMPANY_REVALIDATION_TIME } from "@/app/lib/constants";
import { getLegalPowers } from "@/app/services/rues/service";
import { Flex, Spinner, Text } from "@radix-ui/themes";
import { unstable_cache } from "next/cache";
import { Suspense } from "react";

export async function LegalRepresentatives({
  legalRepresentatives,
  chamberCode,
  registrationNumber,
}: {
  legalRepresentatives: { name: string; type: string }[];
  chamberCode: string;
  registrationNumber: string;
}) {
  const powers = await getPowersCached({
    chamberCode,
    registrationNumber,
  });
  return (
    <Flex direction="column" gap="2">
      <Flex asChild direction="column" gap={{ initial: "2", sm: "0" }}>
        <ol>
          {legalRepresentatives.map(({ type, name }, index) => (
            <Flex
              key={index}
              direction={{ initial: "column", sm: "row" }}
              gap={{ initial: "0", sm: "1" }}
              align={{ initial: "start", sm: "baseline" }}
              asChild
            >
              <li>
                <Text size="1" color="gray" className="uppercase">
                  {type}
                </Text>
                <Text>{name}</Text>
              </li>
            </Flex>
          ))}
        </ol>
      </Flex>
      <Suspense fallback={<Spinner />}>
        <LegalRepresentativePowers
          chamberCode={chamberCode}
          registrationNumber={registrationNumber}
          powers={powers}
        />
      </Suspense>
    </Flex>
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
