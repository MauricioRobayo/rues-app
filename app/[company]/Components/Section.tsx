import type { ComponentProps } from "react";

export function Section({
  children,
  ...props
}: Omit<ComponentProps<"section">, "className">) {
  return (
    <section {...props} className="flex flex-col gap-4">
      {children}
    </section>
  );
}
function Title({
  children,
  ...props
}: Omit<ComponentProps<"h3">, "className">) {
  return (
    <h3 {...props} className="text-lg font-semibold">
      {children}
    </h3>
  );
}

Section.title = Title;
