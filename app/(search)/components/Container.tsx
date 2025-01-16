import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={twMerge("mx-auto max-w-4xl px-4 sm:px-0", className)}
      {...props}
    />
  );
}
