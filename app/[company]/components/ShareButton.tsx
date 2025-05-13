"use client";

import { Button, IconButton, type ButtonProps } from "@radix-ui/themes";
import { useEffect, useState } from "react";

export function ShareButton(props: ButtonProps) {
  const { handleClick, hasShare } = useShare();

  if (!hasShare) {
    return props.children;
  }

  return (
    <Button
      {...props}
      onClick={handleClick}
      aria-label="Compartir"
      title="Compartir"
    />
  );
}

export function ShareIconButton(props: ButtonProps) {
  const { handleClick, hasShare } = useShare();

  if (!hasShare) {
    return props.children;
  }

  return (
    <IconButton
      {...props}
      onClick={handleClick}
      aria-label="Compartir"
      title="Compartir"
    />
  );
}

function useShare() {
  const [hasShare, setHasShare] = useState(false);

  useEffect(() => {
    setHasShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

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
  if (hasShare) {
    return { handleClick, hasShare } as const;
  }
  return { hasShare } as const;
}
