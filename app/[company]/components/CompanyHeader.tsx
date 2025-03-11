import { CopyButton } from "@/app/[company]/components/CopyButton";
import { CompanyStatusBadge } from "@/app/components/CompanyStatusBadge";
import { PageContainer } from "@/app/components/PageContainer";
import type { CompanyDto } from "@/app/types/CompanyDto";
import { Box, Card, Flex, Heading, Separator } from "@radix-ui/themes";

export function CompanyHeader({ company }: { company: CompanyDto }) {
  return (
    <Box asChild style={{ position: "sticky", top: 0, background: "white" }}>
      <header>
        <PageContainer wide py={{ initial: "6", sm: "8" }}>
          <Card size="4" variant="ghost">
            <Flex direction="column" gap="1">
              <Heading itemProp="name" color="blue">
                {company.name}
              </Heading>
              <Flex
                align={{ initial: "start", sm: "center" }}
                gap="2"
                direction={{ initial: "column", sm: "row" }}
              >
                <Flex justify="center" align="center" gap="2">
                  <Heading as="h2" size="4" weight="regular">
                    NIT: <span itemProp="taxID">{company.fullNit}</span>
                  </Heading>
                  <CopyButton value={company.nit} />
                </Flex>
                <CompanyStatusBadge
                  isActive={company.isActive}
                  variant="long"
                />
              </Flex>
            </Flex>
          </Card>
        </PageContainer>
        <Separator mb={{ initial: "4", sm: "4" }} size="4" />
      </header>
    </Box>
  );
}
