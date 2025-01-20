import { CompanyStatusBadge } from "@/app/shared/component/CompanyStatusBadge";
import { Card, Heading, Flex, type CardProps } from "@radix-ui/themes";

export interface CompanySummary {
  name: string;
  fullNit: string;
  isActive: boolean;
  slug: string;
  nit: string;
  registrationId: string;
}

export function CompanyCard({
  name,
  fullNit,
  isActive,
  ...props
}: CompanySummary & CardProps) {
  return (
    <Card {...props}>
      <Heading itemProp="name" color="sky">
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
