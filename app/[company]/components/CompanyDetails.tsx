import { BusinessEstablishments } from "@/app/[company]/components/BusinessEstablishments";
import { CommerceChamber } from "@/app/[company]/components/Chamber";
import { CompanyDescription } from "@/app/[company]/components/CompanyDescription";
import type { CompanyDto } from "@/app/types/CompanyDto";
import { Text, Box, Grid } from "@radix-ui/themes";

export function CompanyDetails({ company }: { company: CompanyDto }) {
  return (
    <Box>
      <Grid
        columns={{ initial: "1", sm: "2" }}
        gapX="8"
        width="auto"
        flow="row-dense"
      >
        <CompanyDescription company={company} />
        <Box>
          <CommerceChamber code={company.chamber.code} />
          {company.isActive && (
            <BusinessEstablishments establishments={company.establishments} />
          )}
        </Box>
      </Grid>
      {company.updatedDate && (
        <Text size="1" color="gray">
          Información del {company.updatedDate}
        </Text>
      )}
    </Box>
  );
}
