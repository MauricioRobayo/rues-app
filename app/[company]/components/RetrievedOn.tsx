"use client";

import { useIsClient } from "@/app/shared/hooks/useIsClient";
import { useRevalidatePath } from "@/app/shared/hooks/useRevalidatePath";
import { SymbolIcon } from "@radix-ui/react-icons";
import { Flex, IconButton, Text } from "@radix-ui/themes";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export function RetrievedOn({ retrievedOn }: { retrievedOn: number }) {
  const isClient = useIsClient();
  const { isRetrying, onClickHandler } = useRevalidatePath();
  const canRefresh = Date.now() - retrievedOn > 7 * 24 * 60 * 60;
  const distanceToNow = formatDistanceToNow(retrievedOn, {
    locale: es,
    addSuffix: true,
  });
  if (!isClient) {
    return null;
  }
  return (
    <Flex>
      <Text size="1" color="gray">
        Actualizado {distanceToNow}
      </Text>
      {canRefresh ? (
        <IconButton
          aria-label="Actualizar information"
          loading={isRetrying}
          onClick={onClickHandler}
        >
          <SymbolIcon />
        </IconButton>
      ) : null}
    </Flex>
  );
}
