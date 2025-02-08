import type { BusinessEstablishmentDto } from "@/app/[company]/types/BusinessEstablishmentDto";

export interface CompanyDto {
  address: string | null;
  area?: string;
  broadIndustry?: string;
  cancellationDate: string | null;
  category?: string;
  chamber: { name: string; code: number };
  city?: string;
  economicActivities: { label: string; code: string; description: string }[];
  establishments: BusinessEstablishmentDto[];
  fullNit: string;
  highestRevenueEconomicActivityCode?: string | null;
  industry?: string;
  isActive: boolean;
  lastRenewalYear: number | null;
  legalEntityType: string;
  name: string;
  nit: number;
  phoneNumbers?: string[];
  registrationDate: string | null;
  registrationNumber: string;
  renewalDate: string | null;
  retrievedOn: number;
  scope?: string | null;
  shortName?: string;
  size: string | null;
  slug: string;
  state?: string;
  status: string;
  totalBusinessEstablishments?: number | null;
  totalEmployees?: number | null;
  type?: string;
  updatedDate?: string | null;
  verificationDigit: number;
  yearsDoingBusinesses: string | null;
}
