"use client";

import { Button } from "@radix-ui/themes";
import { useReducer, type ReactNode } from "react";

export function ToggleContent({
  children,
  label,
}: {
  children: ReactNode;
  label: ReactNode;
}) {
  const [showContent, toggleShowContent] = useReducer((state) => !state, false);
  return showContent ? (
    children
  ) : (
    <Button onClick={toggleShowContent}>{label}</Button>
  );
}
