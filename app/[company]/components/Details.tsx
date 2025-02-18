import { Button } from "@radix-ui/themes";
import type { ComponentProps, ReactNode } from "react";

interface DetailsProps extends ComponentProps<"details"> {
  summary: ReactNode;
}
export function Details({ children, summary, ...props }: DetailsProps) {
  return (
    <details className="group" {...props}>
      <Button asChild>
        <summary className="group-open:hidden">{summary}</summary>
      </Button>
      {children}
    </details>
  );
}
