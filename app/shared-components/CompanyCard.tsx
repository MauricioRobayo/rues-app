import { CompanyStatusBadge } from "@/app/shared-components/CompanyStatusBadge";
import { Card, Heading, Flex, type CardProps } from "@radix-ui/themes";

export interface Company {
  name: string;
  fullNit: string;
  isActive: boolean;
  slug: string;
  nit: string;
}

export function CompanyCard({
  name,
  fullNit,
  isActive,
  ...props
}: Company & CardProps) {
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
