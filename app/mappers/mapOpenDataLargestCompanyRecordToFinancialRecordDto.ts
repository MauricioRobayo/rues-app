import type { OpenDataLargestCompanyRecord } from "@/app/services/openData/types";
import type { FinancialRecordDto } from "@/app/types/FinancialRecordDto";

export function mapOpenDataLargestCompanyRecordToFinancialRecordDto(
  record: OpenDataLargestCompanyRecord,
): FinancialRecordDto {
  return {
    supervisor: record.supervisor,
    region: record.regi_n,
    state: record.departamento_domicilio,
    city: record.ciudad_domicilio,
    macroSector: record.macrosector,
    operatingIncome: record.ingresos_operacionales,
    netProfitOrLoss: record.ganancia_p_rdida,
    totalAssets: record.total_activos,
    totalLiabilities: record.total_pasivos,
    totalEquity: record.total_patrimonio,
    reportingYear: Number(record.a_o_de_corte),
  };
}
