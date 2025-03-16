import { numberFormatter } from "@/app/lib/formatters";
import { Flex, Text } from "@radix-ui/themes";

export async function LegalRepresentatives({
  legalRepresentatives,
}: {
  legalRepresentatives: {
    name: string;
    type: string;
    id?: string;
    idType?: string;
  }[];
}) {
  const legalRepresentative = legalRepresentatives[0];
  return (
    <Flex direction="column" gap="0">
      <Text>{legalRepresentative.name}</Text>
      {legalRepresentative.id ? (
        <Text size="1" color="gray">
          {legalRepresentative.idType}{" "}
          {numberFormatter.format(Number(legalRepresentative.id))}
        </Text>
      ) : null}
    </Flex>
  );
}
