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

  const handleClick = () => {
    const description =
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content") || "";

    navigator.share({
      title: document.title,
      text: description,
      url: window.location.href,
    });
  };

  return (
    <IconButton variant="ghost" onClick={handleClick}>
      <Share2Icon />
    </IconButton>
  );
}
