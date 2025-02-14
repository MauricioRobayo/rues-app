"use client";

import { formatNit } from "@/app/lib/formatNit";
import { usePathname } from "next/navigation";

export function Nit({
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
  return <div>{formatNit(nit, options)}</div>;
}
