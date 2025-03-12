import { BusinessEstablishments } from "@/app/[company]/components/BusinessEstablishments";
// import { CapitalDetails } from "@/app/[company]/components/CapitalDetails";
import { CommerceChamber } from "@/app/[company]/components/Chamber";
import { CompanyDescription } from "@/app/[company]/components/CompanyDescription";
// import { FinancialDetails } from "@/app/[company]/components/FinancialDetails";
import { NameChanges } from "@/app/[company]/components/NameChanges";
import { Penalties } from "@/app/[company]/components/Penalties";
import type { CompanyDto } from "@/app/types/CompanyDto";
import { Box, Grid } from "@radix-ui/themes";

export function CompanyDetails({ company }: { company: CompanyDto }) {
  return (
    <Grid
      columns={{ initial: "1", sm: "2" }}
      gapX="8"
      width="auto"
      flow="row-dense"
    >
      <CompanyDescription company={company} />
      <Box>
        <CommerceChamber code={company.chamber.code} />
        {/* <FinancialDetails financialDetails={company.financialInformation} /> */}
        {/* <CapitalDetails capitalDetails={company.capitalInformation} /> */}
        <BusinessEstablishments establishments={company.establishments} />
        <NameChanges changes={company.nameChanges} />
        <Penalties penalties={company.penalties} />
      </Box>
    </Grid>
  );
}
