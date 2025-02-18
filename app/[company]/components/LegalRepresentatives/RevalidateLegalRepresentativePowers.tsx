"use client";

import { useRevalidateTag } from "@/app/hooks/useRevalidateTag";
import { Button } from "@radix-ui/themes";
import type { ReactNode } from "react";

export function RevalidateLegalRepresentative({
  children,
  chamberCode,
  registrationId,
}: {
  children: ReactNode;
  chamberCode: string;
  registrationId: string;
}) {
  const [isPending, onClickHandler] = useRevalidateTag({
    tag: `${chamberCode}${registrationId}`,
  });
  return (
    <Button loading={isPending} onClick={onClickHandler}>
      {children}
    </Button>
  );
}
