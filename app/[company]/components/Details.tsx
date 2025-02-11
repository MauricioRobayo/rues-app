import { Button } from "@radix-ui/themes";
import type { ReactNode } from "react";

export function Details({
  children,
  summary,
}: {
  children: ReactNode;
  summary: ReactNode;
}) {
  return (
    <details className="group">
      <Button asChild>
        <summary className="group-open:hidden">{summary}</summary>
      </Button>
      {children}
    </details>
  );
}
