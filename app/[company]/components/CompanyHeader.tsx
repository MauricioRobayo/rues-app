import { CopyButton } from "@/app/[company]/components/CopyButton";
import { ShareButton } from "@/app/[company]/components/ShareButton";
import { CompanyStatusBadge } from "@/app/components/CompanyStatusBadge";
import type { CompanyRecordDto } from "@/app/types/CompanyRecordDto";
import { Share2Icon } from "@radix-ui/react-icons";
import { Box, Flex, Heading } from "@radix-ui/themes";

export function CompanyHeader({ company }: { company: CompanyRecordDto }) {
  return (
    <header>
      <Flex direction="column" gap="1">
        <Box>
          <ShareButton>
            <Heading itemProp="name" color="blue" className="line-clamp-3">
              {company.name} <Share2Icon className="inline size-4" />
            </Heading>
          </ShareButton>
        </Box>
        <Flex
          align={{ initial: "start", sm: "center" }}
          gap="2"
          direction={{ initial: "column", sm: "row" }}
        >
          <Flex justify="center" align="center" gap="2">
            <Heading as="h2" size="4" weight="regular">
              NIT: <span itemProp="taxID">{company.formattedFullNit}</span>
            </Heading>
            <CopyButton value={company.nit} />
          </Flex>
          <CompanyStatusBadge isActive={company.isActive} variant="long" />
        </Flex>
      </Flex>
    </header>
  );
}
