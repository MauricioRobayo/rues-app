"use client";

import { Button } from "@radix-ui/themes";
import { useReducer, type ReactNode } from "react";

export function ToggleContent({ children }: { children: ReactNode }) {
  const [showContent, toggleShowContent] = useReducer((state) => !state, false);
  return showContent ? (
    children
  ) : (
    <Button onClick={toggleShowContent}>Ver mapa</Button>
  );
}
