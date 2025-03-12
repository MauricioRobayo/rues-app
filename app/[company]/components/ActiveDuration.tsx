"use client";

import { useIsClient } from "@/app/hooks/useIsClient";
import { getActiveCompanyDuration } from "@/app/lib/getActiveCompanyDuration";

export function ActiveDuration({
  registrationDate,
  cancellationDate,
}: {
  registrationDate: string | null;
  cancellationDate?: string | null;
}) {
  const isClient = useIsClient();
  if (!isClient) {
    return null;
  }
  debugger;
  return getActiveCompanyDuration({
    registrationDate,
    cancellationDate,
  });
}
