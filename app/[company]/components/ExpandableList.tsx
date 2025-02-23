"use client";

import { Box, Button } from "@radix-ui/themes";
import { useReducer, type ReactNode } from "react";

export function ExpandableList({
  items,
  visibleItemsCount = 10,
}: {
  items: ReactNode[];
  visibleItemsCount?: number;
}) {
  const [shouldShowAll, toggleShouldShowAll] = useReducer(
    (state) => !state,
    false,
  );
  const canExpand = items.length > visibleItemsCount;
  const visibleItems = shouldShowAll
    ? items
    : items.slice(0, visibleItemsCount);

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
            Mostrar{" "}
            {shouldShowAll
              ? "menos"
              : `(${items.length - visibleItemsCount}) más`}
          </Button>
        </Box>
      )}
    </>
  );
}
