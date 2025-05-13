"use client";

import { Button, type ButtonProps } from "@radix-ui/themes";
import { useEffect, useState } from "react";

export function ShareButton(props: ButtonProps) {
  const [hasShare, setHasShare] = useState(false);

  useEffect(() => {
    setHasShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  if (!hasShare) {
    return props.children;
  }

  const handleClick = async () => {
    try {
      const description =
        document
          .querySelector('meta[name="description"]')
          ?.getAttribute("content") || "";

      await navigator.share({
        title: document.title,
        text: description,
        url: window.location.href,
      });
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error sharing:", error);
      }
    }
  };

  return (
    <Button {...props} onClick={handleClick} aria-label="Compartir empresa" />
  );
}
