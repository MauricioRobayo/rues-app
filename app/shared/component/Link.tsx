import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import {
  Link as RadixLink,
  LinkProps as RadixLinkProps,
} from "@radix-ui/themes";
import type { ReactNode } from "react";

interface LinkProps extends NextLinkProps {
  children: ReactNode;
  underline: RadixLinkProps["underline"];
}
export function Link({ underline, ...props }: LinkProps) {
  return (
    <RadixLink asChild underline={underline}>
      <NextLink {...props} />
    </RadixLink>
  );
}
