import { Link } from "@/app/components/Link";
import type { EconomicActivity } from "@/app/lib/parseEconomicActivities";
import { slugifyCompanyName } from "@/app/lib/slugifyComponentName";
import {
  isActiveCompany,
  isComercialCompany,
  isLegalEntity,
  isValidId,
  isValidName,
  isValidNit,
} from "@/app/services/openData/repository";
import { openDataService } from "@/app/services/openData/service";
import {
  Badge,
  Box,
  Card,
  Container,
  Flex,
  Heading,
  ScrollArea,
  Section,
  Text,
} from "@radix-ui/themes";

export async function RelatedCompanies({
  nit,
  economicActivities,
  chamberCode,
}: {
  nit: number;
  economicActivities: EconomicActivity[];
  chamberCode: string;
}) {
  const relatedCompanies = await openDataService.companyRecords.getAll({
    limit: 100,
    where: [
      isComercialCompany,
      isActiveCompany,
      isLegalEntity,
      isValidId,
      isValidName,
      isValidNit,
      `codigo_camara = '${chamberCode}'`,
      `numero_identificacion != '${nit}'`,
      `cod_ciiu_act_econ_pri IN (${economicActivities.map(({ code }) => `'${code}'`).join(",")})`,
    ],
    order: "ultimo_ano_renovado DESC",
  });

  const sortedRelatedCompanies = relatedCompanies.toSorted((a, b) => {
    const originalCodes = economicActivities.map((ea) => ea.code);

    const score = (companyCodes: string[]) => {
      return originalCodes.reduce((total, code, index) => {
        const weight = originalCodes.length - index; // first = highest weight
        return companyCodes.includes(code) ? total + weight : total;
      }, 0);
    };

    const aScore = score(a.economicActivities.map((ea) => ea.code));
    const bScore = score(b.economicActivities.map((ea) => ea.code));

    return bScore - aScore;
  });

  if (relatedCompanies.length === 0) {
    return null;
  }

  return (
    <Container mx={{ initial: "4", lg: "0" }} asChild>
      <aside>
        <Heading as="h3" size="5">
          Empresas Activas Relacionadas
        </Heading>
        <Section size={{ initial: "1", sm: "2" }}>
          <Flex direction="column" asChild gap="4">
            <ul>
              {sortedRelatedCompanies.map((company) => {
                const companySlug = `${slugifyCompanyName(company.name)}-${company.nit}`;
                return (
                  <li key={company.nit}>
                    <Card>
                      <Flex direction="column">
                        <Text size="4" weight="bold">
                          <Link href={companySlug} prefetch={false}>
                            {company.name}
                          </Link>
                        </Text>
                        <Text color="gray">NIT: {company.fullNit}</Text>
                        <Flex wrap="wrap" gap="1" className="overflow-x-auto">
                          {company.economicActivities.map(
                            (economicActivity, index) => (
                              <Box key={`${economicActivity.code}-${index}`}>
                                <Badge>{economicActivity.description}</Badge>
                              </Box>
                            ),
                          )}
                        </Flex>
                      </Flex>
                    </Card>
                  </li>
                );
              })}
            </ul>
          </Flex>
        </Section>
      </aside>
    </Container>
  );
}
