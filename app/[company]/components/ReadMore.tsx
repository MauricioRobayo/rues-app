"use client";

import { Button, Flex, Text } from "@radix-ui/themes";
import { useReducer } from "react";
import xss from "xss";

const LINE_CLAMP = {
  1: "data-[open=false]:line-clamp-1",
  2: "data-[open=false]:line-clamp-2",
  3: "data-[open=false]:line-clamp-3",
  4: "data-[open=false]:line-clamp-4",
  5: "data-[open=false]:line-clamp-5",
  6: "data-[open=false]:line-clamp-6",
};

export function ReadMore({
  text,
  lineClamp = 6,
}: {
  text: string;
  lineClamp?: 1 | 2 | 3 | 4 | 5 | 6;
}) {
  const [showAllText, toggleShowAllText] = useReducer((state) => !state, false);
  const sanitizedText = xss(text);
  return (
    <Flex direction="column" gap="2" align="start">
      <Text
        data-open={showAllText}
        className={LINE_CLAMP[lineClamp]}
        dangerouslySetInnerHTML={{ __html: sanitizedText }}
      />
      <Button variant="ghost" onClick={toggleShowAllText}>
        {showAllText ? "Mostrar menos" : "Mostrar más"}
      </Button>
    </Flex>
  );
}
