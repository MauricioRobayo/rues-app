import { useState } from "react";

export function useCopy(value: string | number) {
  const [isCopied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return [isCopied, handleCopy] as const;
}
