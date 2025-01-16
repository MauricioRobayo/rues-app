import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export function Section({ className, ...props }: ComponentProps<"section">) {
  return (
    <section className={twMerge("flex flex-col gap-4", className)} {...props} />
  );
}
function Title({ className, ...props }: ComponentProps<"h3">) {
  return (
    <h3 className={twMerge("text-lg font-semibold", className)} {...props} />
  );
}

Section.title = Title;
