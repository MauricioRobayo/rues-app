import { montserrat } from "@/app/fonts";
import { Text } from "@radix-ui/themes";

export function Logo() {
  return (
    <div className={montserrat.className}>
      <Text size="4" className="uppercase">
        Registro
      </Text>
      <Text size="4" className="font-extrabold">
        NIT
      </Text>
    </div>
  );
}
