"use client";
import { CopyIcon } from "@radix-ui/react-icons";
import { Flex, IconButton, Text } from "@radix-ui/themes";
import { useState } from "react";

export function CopyButton({ value }: { value: string | number }) {
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
    <Flex gap="1">
      <IconButton
        size="1"
        aria-label="Copy value"
        color="gray"
        variant="ghost"
        onClick={handleCopy}
      >
        <CopyIcon />
      </IconButton>
      {copied && (
        <Text
          color="green"
          size="1"
          weight={{ initial: "regular", sm: "bold" }}
        >
          ✓ Copiado
        </Text>
      )}
    </Flex>
  );
}
