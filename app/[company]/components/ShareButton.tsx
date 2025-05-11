"use client";

import { Share2Icon } from "@radix-ui/react-icons";
import { IconButton } from "@radix-ui/themes";
import { useEffect, useState } from "react";

export function ShareButton() {
  const [hasShare, setHasShare] = useState(false);

  useEffect(() => {
    setHasShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  if (!hasShare) {
    return null;
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
    <IconButton variant="ghost" onClick={handleClick}>
      <Share2Icon />
    </IconButton>
  );
}
