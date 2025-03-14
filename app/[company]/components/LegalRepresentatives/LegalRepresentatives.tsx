// import { LegalRepresentativePowers } from "@/app/[company]/components/LegalRepresentatives/LegalRepresentativePowers";
import { LegalRepresentativePowers } from "@/app/[company]/components/LegalRepresentatives/LegalRepresentativePowers";
import { OPEN_DATA_ENABLED } from "@/app/lib/constants";
import { Flex, Text } from "@radix-ui/themes";

export async function LegalRepresentatives({
  legalRepresentatives,
  chamberCode,
  registrationNumber,
}: {
  legalRepresentatives: {
    name: string;
    type: string;
    id?: string;
    idType?: string;
  }[];
  chamberCode: string;
  registrationNumber: string;
}) {
  if (OPEN_DATA_ENABLED) {
    const legalRepresentative = legalRepresentatives[0];
    return (
      <Flex direction="column" gap="0">
        <Text>{legalRepresentative.name}</Text>
        {legalRepresentative.id ? (
          <Text size="1" color="gray">
            {legalRepresentative.idType} {legalRepresentative.id}
          </Text>
        ) : null}
      </Flex>
    );
  }

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
      {OPEN_DATA_ENABLED && (
        <LegalRepresentativePowers
          chamberCode={chamberCode}
          registrationNumber={registrationNumber}
        />
      )}
    </Flex>
  );
}
