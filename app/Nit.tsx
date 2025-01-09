"use client";

import { usePathname } from "next/navigation";

export function Nit() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }
  const nit = pathname.replace(/.*-/g, "");
  return <div>{nit}</div>;
}
