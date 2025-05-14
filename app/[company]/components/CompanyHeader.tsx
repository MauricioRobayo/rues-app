import { ShareIconButton } from "@/app/[company]/components/ShareButton";
import { CompanyStatusBadge } from "@/app/components/CompanyStatusBadge";
import type { CompanyRecordDto } from "@/app/types/CompanyRecordDto";
import { Share2Icon } from "@radix-ui/react-icons";
import { Box, Flex, Heading } from "@radix-ui/themes";

export function CompanyHeader({ company }: { company: CompanyRecordDto }) {
  return (
    <header>
      <Flex direction="column" gap="1">
        <Heading
          itemProp="name"
          color="blue"
          className="line-clamp-2"
          wrap="balance"
        >
          {company.name}
        </Heading>
        <Flex
          align={{ initial: "start", sm: "center" }}
          gap="2"
          direction={{ initial: "column", sm: "row" }}
        >
          <Flex justify="center" align="center" gap="2">
            <Heading as="h2" size="4" weight="regular">
              NIT: <span itemProp="taxID">{company.formattedFullNit}</span>
            </Heading>
            <Box display={{ initial: "block", sm: "none" }} asChild>
              <ShareIconButton variant="ghost">
                <Share2Icon />
              </ShareIconButton>
            </Box>
          </Flex>
          <CompanyStatusBadge isActive={company.isActive} variant="long" />
          <Box display={{ initial: "none", sm: "block" }} asChild>
            <ShareIconButton variant="ghost">
              <Share2Icon />
            </ShareIconButton>
          </Box>
        </Flex>
      </Flex>
    </header>
  );
}
