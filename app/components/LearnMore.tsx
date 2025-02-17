import { InfoCircledIcon } from "@radix-ui/react-icons";
import {
  AccessibleIcon,
  Box,
  IconButton,
  Popover,
  Text,
} from "@radix-ui/themes";
import type { ReactNode } from "react";

export function LearnMore({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <IconButton variant="ghost" color="gray">
          <AccessibleIcon label={`¿Qué es ${label}`}>
            <InfoCircledIcon />
          </AccessibleIcon>
        </IconButton>
      </Popover.Trigger>
      <Popover.Content size="3" maxWidth={{ initial: "280px", sm: "500px" }}>
        <Text trim="both" size="2">
          <strong>{label}</strong>: <Box>{children}</Box>
        </Text>
      </Popover.Content>
    </Popover.Root>
  );
}
