"use client";

import { Button, Flex, Text } from "@radix-ui/themes";
import { useEffect, useReducer, useRef, useState } from "react";
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
  lineClamp = 4,
}: {
  text: string;
  lineClamp?: 1 | 2 | 3 | 4 | 5 | 6;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [showAllText, toggleShowAllText] = useReducer((state) => !state, false);
  const [isTruncated, setIsTruncated] = useState(false);
  const sanitizedText = xss(text);
  useEffect(() => {
    const container = ref.current;
    if (!container) {
      return;
    }
    setIsTruncated(container.scrollHeight > container.clientHeight);
  }, [text]);
  return (
    <Flex direction="column" gap="2" align="start">
      <Text
        data-open={showAllText}
        className={LINE_CLAMP[lineClamp]}
        dangerouslySetInnerHTML={{ __html: sanitizedText }}
        ref={ref}
      />
      {isTruncated && (
        <Button variant="ghost" onClick={toggleShowAllText}>
          {showAllText ? "Mostrar menos" : "Mostrar más"}
        </Button>
      )}
    </Flex>
  );
}
