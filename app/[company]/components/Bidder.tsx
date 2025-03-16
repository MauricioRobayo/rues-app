import { CopyButton } from "@/app/[company]/components/CopyButton";
import { Code, Flex } from "@radix-ui/themes";

export async function Bidder({ bidderId }: { bidderId: string }) {
  return (
    <Flex direction="column" gap="2">
      <Flex gap="2" align="center">
        <Code variant="ghost">{bidderId}</Code>
        <CopyButton value={bidderId} />
      </Flex>
    </Flex>
  );
}
