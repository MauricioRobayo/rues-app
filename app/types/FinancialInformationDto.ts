export interface FinancialInformationDto {
  financialYear: number;
  currentAssets: number;
  nonCurrentAssets?: number;
  totalAssets: number;
  currentLiabilities: number;
  nonCurrentLiabilities?: number;
  totalLiabilities: number;
  netEquity: number;
  liabilitiesAndEquity?: number;
  socialBalance?: number;
  ordinaryActivityIncome: number;
  otherIncome: number;
  costOfSales: number;
  operatingExpenses: number;
  otherExpenses: number;
  taxExpenses?: number;
  operatingProfitOrLoss: number;
  periodResult: number;
  privateForeignEquity: number;
  publicForeignEquity: number;
  privateNationalEquity: number;
  publicNationalEquity: number;
}
