import type { ReactNode } from "react";
import { twJoin } from "tailwind-merge";

export function CompanyDetail({
  label,
  itemProp,
  children,
}: {
  label: string;
  itemProp?: string;
  children: ReactNode;
}) {
  return (
    <div key={label} className={twJoin("flex flex-col")}>
      <dt className="shrink-0 text-sm text-slate-500">{label}</dt>
      <dd itemProp={itemProp} className="text-balance">
        {children}
      </dd>
    </div>
  );
}
