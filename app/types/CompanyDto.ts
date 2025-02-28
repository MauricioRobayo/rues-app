import type { BusinessEstablishmentDto } from "@/app/types/BusinessEstablishmentDto";
import type { CapitalInformationDto } from "@/app/types/CapitalDto";
import type { CompanyNameChangeDto } from "@/app/types/CompanyNameChangeDto";
import type { FinancialInformationDto } from "@/app/types/FinancialInformationDto";
import type { PenaltyDto } from "@/app/types/PenaltyDto";

export interface CompanyDto {
  address: string | null;
  area?: string;
  bidderId?: string | null;
  broadIndustry?: string;
  cancellationDate: string | null;
  category?: string;
  chamber: { name: string; code: string };
  city?: string;
  economicActivities: { label: string; code: string; description: string }[];
  email?: string;
  establishments: BusinessEstablishmentDto[];
  fullNit: string;
  highestRevenueEconomicActivityCode?: string | null;
  industry?: string;
  isActive: boolean;
  lastRenewalYear: number | null;
  legalEntityType: string;
  legalRepresentatives?: { type: "principal" | "suplente"; name: string }[];
  name: string;
  nit: number;
  phoneNumbers?: string[];
  registrationDate: string | null;
  registrationNumber: string;
  renewalDate: string | null;
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
  financialInformation?: FinancialInformationDto[];
  capitalInformation?: CapitalInformationDto[];
  nameChanges?: CompanyNameChangeDto[];
  penalties?: PenaltyDto[];
}
