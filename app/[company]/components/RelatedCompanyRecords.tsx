import { Link } from "@/app/components/Link";
import { openDataService } from "@/app/services/openData/service";
import { Box, Code } from "@radix-ui/themes";

export async function RelatedCompanyRecords({
  chamber,
  economicActivity,
}: {
  chamber: {
    code: string;
    name: string;
  };
  economicActivity: {
    code: string;
    description: string;
  };
}) {
  console.log(chamber);
  const relatedRecords = await openDataService.companyRecords.getRelated({
    chamberCode: chamber.code,
    economicActivity: economicActivity.code,
    limit: 25,
  });
  return (
    <Box>
      <h4>
        Otras empresas con matrícula{" "}
        <Code variant="outline" color="green" size="2">
          ACTIVA
        </Code>{" "}
        registradas en la {chamber.name} dedicadas a{" "}
        {economicActivity.description}
      </h4>
      <ul>
        {relatedRecords.map((record) => (
          <li key={record.registrationNumber}>
            <Link href={`/${record.slug}`}>{record.name}</Link>
          </li>
        ))}
      </ul>
    </Box>
  );
}
