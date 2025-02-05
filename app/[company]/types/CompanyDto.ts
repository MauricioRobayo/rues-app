import type { BusinessEstablishmentDto } from "@/app/[company]/types/BusinessEstablishmentDto";

export interface CompanyDto {
  name: string;
  shortName?: string;
  slug: string;
  chamber: { name: string; code: number };
  nit: number;
  fullNit: string;
  verificationDigit: number;
  registrationNumber: string;
  status: string;
  isActive: boolean;
  type?: string;
  legalEntityType: string;
  category?: string;
  registrationDate: string | null;
  updatedDate?: string | null;
  yearsDoingBusinesses: string | null;
  lastRenewalYear: number | null;
  renewalDate: string | null;
  cancellationDate: string | null;
  size: string | null;
  address: string | null;
  phoneNumbers?: string[];
  area?: string;
  state?: string;
  city?: string;
  scope?: string | null;
  economicActivities: { label: string; code: string; description: string }[];
  highestRevenueEconomicActivityCode?: string | null;
  totalBusinessEstablishments?: number | null;
  totalEmployees?: number | null;
  establishments: BusinessEstablishmentDto[];
  broadIndustry?: string;
  industry?: string;
}
