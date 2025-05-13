"use client";

import { formatNit } from "@/app/lib/formatNit";
import { usePathname } from "next/navigation";
import { Flex, Text } from "@radix-ui/themes";
import { ShareButton } from "@/app/[company]/components/ShareButton";
import { Share2Icon } from "@radix-ui/react-icons";

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
  return (
    <ShareButton variant="ghost">
      <Flex gap="1" align="center">
        <Text color="blue" weight="bold">
          <div>{formatNit(nit, options)}</div>
        </Text>
        <Share2Icon />
      </Flex>
    </ShareButton>
  );
}
