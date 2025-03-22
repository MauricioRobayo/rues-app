import { numberFormatter } from "@/app/lib/formatters";
import { Flex, Text } from "@radix-ui/themes";

export async function LegalRepresentative({
  legalRepresentative,
}: {
  legalRepresentative: {
    name: string;
    id?: string;
    idType?: string;
  };
}) {
  console.dir(legalRepresentative, { depth: Infinity });
  const id = Number(legalRepresentative.id);
  return (
    <Flex direction="column" gap="0">
      <Text>{legalRepresentative.name}</Text>
      {legalRepresentative.id ? (
        <Text size="1" color="gray">
          {legalRepresentative.idType}{" "}
          {Number.isNaN(id)
            ? legalRepresentative.id
            : numberFormatter.format(Number(legalRepresentative.id))}
        </Text>
      ) : null}
    </Flex>
  );
}
