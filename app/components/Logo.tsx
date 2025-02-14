import { montserrat } from "@/app/fonts";
import { Text } from "@radix-ui/themes";

export function Logo() {
  return (
    <div className={montserrat.className}>
      <Text size="2">registro</Text>
      <Text size="4" weight="bold">
        NIT
      </Text>
    </div>
  );
}
