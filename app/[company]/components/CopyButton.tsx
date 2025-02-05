"use client";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import {
  Box,
  Flex,
  IconButton,
  Text,
  Tooltip,
  AccessibleIcon,
} from "@radix-ui/themes";
import { useState, type ReactNode } from "react";

export function CopyButton({
  value,
  tooltip,
}: {
  value: string | number;
  tooltip: ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <Flex gap="2">
      <Tooltip content={copied ? "¡Copiado!" : tooltip}>
        <IconButton
          size="1"
          aria-label="Copiar valor"
          color="gray"
          variant="ghost"
          onClick={handleCopy}
          disabled={copied}
        >
          {copied ? (
            <AccessibleIcon label="Copiado">
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
