import type { ReactNode } from "react";
import { twJoin } from "tailwind-merge";

export function CompanyDetail({
  label,
  itemProp,
  children,
  direction = "row",
}: {
  label: string;
  itemProp?: string;
  children: ReactNode;
  direction?: "row" | "column";
}) {
  return (
    <div
      key={label}
      className={twJoin(
        "flex flex-col gap-x-1",
        direction === "row" ? "sm:flex-row" : "gap-y-2",
      )}
    >
      <dt className="shrink-0 text-sm text-slate-500 sm:text-base">
        {label}
        <span className="max-sm:hidden">:</span>
      </dt>
      <dd itemProp={itemProp}>{children}</dd>
    </div>
  );
}
