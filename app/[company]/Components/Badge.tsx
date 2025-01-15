import type { ReactNode } from "react";
import { twJoin } from "tailwind-merge";

export function Badge({
  children,
  variant,
}: {
  children: ReactNode;
  variant: "success" | "error";
}) {
  return (
    <div
      className={twJoin(
        "flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 px-2 text-xs font-semibold uppercase leading-5",
        variant === "success" ? "text-green-600" : "text-red-600",
      )}
    >
      <div
        className={twJoin(
          "size-2 rounded-full",
          variant === "success" ? "bg-green-600" : "bg-red-600",
        )}
      />
      {children}
    </div>
  );
}
