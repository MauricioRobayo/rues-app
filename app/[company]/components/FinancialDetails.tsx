import { Details } from "@/app/[company]/components/Details";
import { currencyFormatter } from "@/app/lib/formatters";
import type { FinancialInformationDto } from "@/app/types/FinancialInformationDto";
import { Section, Heading } from "@radix-ui/themes";
import { DataList } from "@/app/[company]/components/DataList";

export function FinancialDetails({
  financialDetails,
}: {
  financialDetails?: FinancialInformationDto[];
}) {
  const financialInformation = financialDetails
    ?.toSorted((a, b) => b.financialYear - a.financialYear)
    .map((info) => ({
      year: info.financialYear,
      details: [
        { label: "Activo corriente", value: info.currentAssets },
        { label: "Activo no corriente", value: info.nonCurrentAssets },
        { label: "Activo total", value: info.totalAssets },
        { label: "Pasivo corriente", value: info.currentLiabilities },
        { label: "Pasivo no corriente", value: info.nonCurrentLiabilities },
        { label: "Pasivo total", value: info.totalLiabilities },
        { label: "Patrimonio neto", value: info.netEquity },
        {
          label: "Ingresos de actividad ordinaria",
          value: info.ordinaryActivityIncome,
        },
        { label: "Otros ingresos", value: info.otherIncome },
        { label: "Costo de ventas", value: info.costOfSales },
        { label: "Gastos operacionales", value: info.operatingExpenses },
        { label: "Otros gastos", value: info.otherExpenses },
        { label: "Gastos de impuestos", value: info.taxExpenses },
        {
          label: "Utilidad/Pérdida operacional",
          value: info.operatingProfitOrLoss,
        },
        { label: "Resultado del período", value: info.periodResult },
        {
          label: "Capital social extranjero privado",
          value: info.privateForeignEquity,
        },
        {
          label: "Capital social extranjero público",
          value: info.publicForeignEquity,
        },
        {
          label: "Capital social nacional privado",
          value: info.privateNationalEquity,
        },
        {
          label: "Capital social nacional público",
          value: info.publicNationalEquity,
        },
      ].map(({ label, value }) => ({
        label,
        value: value ? currencyFormatter.format(value) : value,
      })),
    }))
    .at(0);

  if (!financialInformation) {
    return null;
  }

  return (
    <Section size="2" id="informacion-financiera">
      <Heading as="h3" size="4" mb="2">
        Información financiera {financialInformation.year}
      </Heading>
      <Details summary="Ver información financiera">
        <DataList items={financialInformation.details} />
      </Details>
    </Section>
  );
}
