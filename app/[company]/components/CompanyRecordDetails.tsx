import { AdditionalRecordInformation } from "@/app/[company]/components/AdditionalRecordInformation";
import { BusinessEstablishments } from "@/app/[company]/components/BusinessEstablishments";
import { CommerceChamber } from "@/app/[company]/components/Chamber";
import { CompanyRecordDescription } from "@/app/[company]/components/CompanyRecordDescription";
import { FinancialInformation } from "@/app/[company]/components/FinancialInformation";
import type { CompanyRecordDto } from "@/app/types/CompanyRecordDto";
import { Box, Grid } from "@radix-ui/themes";

export const revalidate = false;

export function CompanyRecordDetails({ record }: { record: CompanyRecordDto }) {
  return (
    <Box>
      <Grid
        columns={{ initial: "1", sm: "2" }}
        gapX="8"
        gapY="6"
        width="auto"
        flow="row-dense"
      >
        <Box>
          <CompanyRecordDescription company={record} />
          {record.isActive && (
            <BusinessEstablishments
              chamberCode={record.chamber.code}
              registrationNumber={record.registrationNumber}
              mt={{ initial: "6", sm: "8" }}
            />
          )}
        </Box>
        <Box>
          {record.isMain && (
            <AdditionalRecordInformation
              company={record}
              mb={{ initial: "6", sm: "8" }}
            />
          )}
          <FinancialInformation
            nit={record.nit}
            mb={{ initial: "6", sm: "8" }}
          />
          <CommerceChamber code={record.chamber.code} />
        </Box>
      </Grid>
    </Box>
  );
}
