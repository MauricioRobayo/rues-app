"use client";

import { formatNit } from "@/app/lib/format-nit";
import { usePathname } from "next/navigation";

export function Nit({
  className,
  options,
}: {
  className?: string;
  options?: Parameters<typeof formatNit>[1];
}) {
  const pathname = usePathname();
  if (pathname === "/") {
    return null;
  }
  const nit = Number(pathname.replace(/.*-/g, ""));
  return <div className={className}>{formatNit(nit, options)}</div>;
}
