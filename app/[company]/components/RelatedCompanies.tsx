import { Link } from "@/app/components/Link";
import { formatNit } from "@/app/lib/formatNit";
import {
  parseEconomicActivities,
  type EconomicActivity,
} from "@/app/lib/parseEconomicActivities";
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
  Card,
  Container,
  Flex,
  Heading,
  Section,
  Separator,
  Text,
} from "@radix-ui/themes";

export async function RelatedCompanies({
  nit,
  economicActivities,
  chamber,
}: {
  nit: number;
  economicActivities: EconomicActivity[];
  chamber: { name: string; code: string };
}) {
  const relatedCompanies = await getRelatedCompanies({
    nit,
    economicActivities,
    chamberCode: chamber.code,
  });

  if (relatedCompanies.length === 0) {
    return null;
  }

  const topRelatedCompanies = relatedCompanies
    .toSorted((a, b) => {
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
    })
    .slice(0, 100);

  return (
    <Container mx={{ initial: "4", lg: "0" }}>
      <Separator size="4" />
      <Section size={{ initial: "1", sm: "2" }}>
        <Heading as="h4" mb="4">
          Empresas similares registradas en {chamber.name} (
          {relatedCompanies.length > 100 ? "100+" : relatedCompanies.length})
        </Heading>
        <Flex direction="column" asChild gap="2">
          <ul>
            {topRelatedCompanies.map((company) => {
              const companySlug = `${slugifyCompanyName(company.name)}-${company.nit}`;
              return (
                <li key={company.nit}>
                  <Card>
                    <Flex direction="column" gap="2">
                      <Flex direction="column">
                        <Text size="4" weight="bold" wrap="balance">
                          <Link href={companySlug} prefetch={false}>
                            {company.name}
                          </Link>
                        </Text>
                        <Text>NIT: {company.fullNit}</Text>
                      </Flex>
                      <Heading as="h5" size="2" weight="regular">
                        Actividad Económica:
                      </Heading>
                      <Text size="2">
                        <ol className="list-inside list-decimal">
                          {company.economicActivities.map(
                            (economicActivity, index) => (
                              <li key={`${economicActivity.code}-${index}`}>
                                {economicActivity.description}
                              </li>
                            ),
                          )}
                        </ol>
                      </Text>
                    </Flex>
                  </Card>
                </li>
              );
            })}
          </ul>
        </Flex>
      </Section>
    </Container>
  );
}

async function getRelatedCompanies({
  chamberCode,
  nit,
  economicActivities,
}: {
  chamberCode: string;
  nit: number;
  economicActivities: EconomicActivity[];
}) {
  if (economicActivities.length === 0) {
    return [];
  }
  try {
    const relatedCompanies = await openDataService.companyRecords.getAll({
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
      select: [
        "numero_identificacion",
        "razon_social",
        "cod_ciiu_act_econ_pri",
        "cod_ciiu_act_econ_sec",
        "ciiu3",
        "ciiu4",
      ],
    });
    return relatedCompanies.map((record) => ({
      nit: record.numero_identificacion,
      fullNit: formatNit(record.numero_identificacion),
      name: record.razon_social,
      economicActivities: parseEconomicActivities({
        ciiu1: record.cod_ciiu_act_econ_pri,
        ciiu2: record.cod_ciiu_act_econ_sec,
        ciiu3: record.ciiu3,
        ciiu4: record.ciiu4,
      }),
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
}
