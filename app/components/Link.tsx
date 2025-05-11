import {
  Link as RadixLink,
  LinkProps as RadixLinkProps,
} from "@radix-ui/themes";
import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

interface LinkProps
  extends NextLinkProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  children: ReactNode;
  underline?: RadixLinkProps["underline"];
}
export function Link({ underline, ...props }: LinkProps) {
  return (
    <RadixLink asChild underline={underline}>
      <NextLink {...props} />
    </RadixLink>
  );
}
