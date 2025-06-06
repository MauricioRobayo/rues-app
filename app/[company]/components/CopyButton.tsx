"use client";
import { useCopy } from "@/app/hooks/useCopy";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import { AccessibleIcon, Flex, IconButton, Tooltip } from "@radix-ui/themes";

export function CopyButton({ value }: { value: string | number }) {
  const [isCopied, handleCopy] = useCopy(value);

  return (
    <Flex gap="2">
      <Tooltip
        content={isCopied ? "Copiado" : "Copiar"}
        open={isCopied ? true : undefined}
      >
        <IconButton
          size="1"
          aria-label="Copiar valor"
          variant="ghost"
          color="gray"
          onClick={handleCopy}
        >
          {isCopied ? (
            <AccessibleIcon label="Valor copiado">
              <CheckIcon color="green" />
            </AccessibleIcon>
          ) : (
            <CopyIcon />
          )}
        </IconButton>
      </Tooltip>
    </Flex>
  );
}
