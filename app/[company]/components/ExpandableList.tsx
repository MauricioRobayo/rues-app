"use client";

import { Box, Button } from "@radix-ui/themes";
import { useReducer, type ReactNode } from "react";

export function ExpandableList({
  items,
  initialVisibleCount = 10,
}: {
  items: ReactNode[];
  initialVisibleCount?: number;
}) {
  const [shouldShowAll, toggleShouldShowAll] = useReducer(
    (state) => !state,
    false,
  );
  const canExpand = items.length > initialVisibleCount;
  const visibleItems = shouldShowAll
    ? items
    : items.slice(0, initialVisibleCount);

  return (
    <>
      {visibleItems}
      {canExpand && (
        <Box key={`expandable-list-button-${items.length}`}>
          <Button
            onClick={toggleShouldShowAll}
            variant="ghost"
            className="mt-1"
          >
            Mostrar {shouldShowAll ? "menos" : "más"}
          </Button>
        </Box>
      )}
    </>
  );
}
