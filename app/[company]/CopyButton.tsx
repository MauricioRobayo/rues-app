"use client";
import { useState } from "react";

export function Copy({
  value,
  className,
  copiedClassName,
}: {
  value: string;
  className?: string;
  copiedClassName?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={copied ? copiedClassName : className}
    >
      {copied ? "Copiado 👍" : "Copiar"}
    </button>
  );
}
