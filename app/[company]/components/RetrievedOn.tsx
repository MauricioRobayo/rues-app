import { dateFormatter } from "@/app/shared/lib/formatDetailsDate";
import { SymbolIcon } from "@radix-ui/react-icons";
import { Flex, IconButton, Text } from "@radix-ui/themes";

export function RetrievedOn({ retrievedOn }: { retrievedOn: number }) {
  const canRefresh = Date.now() - retrievedOn > 7 * 24 * 60 * 60;
  return (
    <Flex>
      <Text size="1" color="gray">
        Última actualización: {dateFormatter.format(retrievedOn)}
      </Text>
      {canRefresh ? (
        <IconButton
          aria-label="Actualizar information"
          onClick={() => console.log("revalidate")}
        >
          <SymbolIcon />
        </IconButton>
      ) : null}
    </Flex>
  );
}
