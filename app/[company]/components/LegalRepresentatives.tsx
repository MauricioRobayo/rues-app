import { Flex, Text } from "@radix-ui/themes";

export function LegalRepresentatives({
  legalRepresentatives,
}: {
  legalRepresentatives: { name: string; type: string }[];
}) {
  return (
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
  );
}
