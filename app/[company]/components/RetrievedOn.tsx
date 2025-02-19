"use client";

import { useIsClient } from "@/app/hooks/useIsClient";
import { useRevalidatePath } from "@/app/hooks/useRevalidatePath";
import { SymbolIcon } from "@radix-ui/react-icons";
import { Flex, IconButton, Text } from "@radix-ui/themes";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useSearchParams } from "next/navigation";

export function RetrievedOn({ retrievedOn }: { retrievedOn: number }) {
  const isClient = useIsClient();
  const searchParams = useSearchParams();
  const [isPending, onClickHandler] = useRevalidatePath();
  const enableRevalidate = searchParams.get("enableRevalidate");
  const shouldShowRevalidateButton =
    enableRevalidate || Date.now() - retrievedOn > 15 * 24 * 60 * 60 * 1000;
  const distanceToNow = formatDistanceToNow(retrievedOn, {
    locale: es,
    addSuffix: true,
  });
  if (!isClient) {
    return null;
  }
  return (
    <Flex direction="row" gap="2" align="center" justify="start">
      <Text size="1" color="gray">
        {isPending
          ? "Actualizando información…"
          : `Información actualizada ${distanceToNow}.`}
      </Text>
      {shouldShowRevalidateButton ? (
        <IconButton
          aria-label="Actualizar"
          loading={isPending}
          onClick={onClickHandler}
          variant="ghost"
          size="1"
        >
          <SymbolIcon />
        </IconButton>
      ) : null}
    </Flex>
  );
}
