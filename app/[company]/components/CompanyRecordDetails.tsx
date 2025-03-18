import { BusinessEstablishments } from "@/app/[company]/components/BusinessEstablishments";
import { CommerceChamber } from "@/app/[company]/components/Chamber";
import { CompanyRecordDescription } from "@/app/[company]/components/CompanyRecordDescription";
import type { CompanyRecordDto } from "@/app/types/CompanyRecordDto";
import { Text, Box, Grid } from "@radix-ui/themes";

export function CompanyRecordDetails({
  company,
}: {
  company: CompanyRecordDto;
}) {
  return (
    <Box>
      <Grid
        columns={{ initial: "1", sm: "2" }}
        gapX="8"
        width="auto"
        flow="row-dense"
      >
        <CompanyRecordDescription company={company} />
        <Box>
          <CommerceChamber code={company.chamber.code} />
          {company.isActive && (
            <BusinessEstablishments establishments={company.establishments} />
          )}
        </Box>
      </Grid>
      {company.updatedDate && (
        <Text size="1" color="gray">
          Actualizado el {company.updatedDate}
        </Text>
      )}
    </Box>
  );
}
