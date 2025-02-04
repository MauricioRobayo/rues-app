import type { CompanyDto } from "@/app/[company]/types/CompanyDto";
import { CompanyStatusBadge } from "@/app/shared/component/CompanyStatusBadge";
import { Card, Heading, Flex, type CardProps } from "@radix-ui/themes";

export function CompanyCard({
  name,
  fullNit,
  isActive,
  ...props
}: CompanyDto & CardProps) {
  return (
    <Card {...props}>
      <Heading itemProp="name" color="blue">
        {name}
      </Heading>
      <Flex align="center" gap="2">
        <Heading as="h2" size="4" itemProp="taxID">
          NIT: {fullNit}
        </Heading>
        <CompanyStatusBadge isActive={isActive} />
      </Flex>
    </Card>
  );
}
