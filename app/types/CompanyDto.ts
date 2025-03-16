import type { BusinessEstablishmentDto } from "@/app/types/BusinessEstablishmentDto";

export interface CompanyDto {
  address?: string | null;
  area?: string;
  bidderId?: string | null;
  broadIndustry?: string;
  cancellationDate?: string | null;
  category?: string;
  chamber: { name: string; code: string };
  idType?: string;
  city?: string;
  economicActivities: { label: string; code: string; description: string }[];
  email?: string;
  establishments?: BusinessEstablishmentDto[];
  fullNit: string;
  highestRevenueEconomicActivityCode?: string | null;
  industry?: string;
  isActive: boolean;
  lastRenewalYear: number | null;
  legalEntityType?: string;
  legalRepresentatives?: {
    type: "principal" | "suplente";
    name: string;
    id?: string;
    idType?: string;
  }[];
  name: string;
  nit: number;
  phoneNumbers?: string[];
  registrationDate: string | null;
  rawRegistrationDate: string | null;
  rawCancellationDate?: string | null;
  registrationNumber: string;
  renewalDate: string | null;
  scope?: string | null;
  shortName?: string;
  size?: string | null;
  slug: string;
  state?: string;
  status: string;
  type?: string;
  updatedDate?: string | null;
  verificationDigit: number;
  isLegalEntity?: boolean;
}
