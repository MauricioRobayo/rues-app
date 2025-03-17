export interface CompanyDto {
  name: string;
  nit: number;
  fullNit: string;
  slug: string;
  bidderId?: string | null;
  category?: string;
  chamber: { name: string; code: string };
  economicActivities: { label: string; code: string; description: string }[];
  isActive: boolean;
  lastRenewalYear: number | null;
  type?: string;
  legalRepresentatives?: {
    type: "principal" | "suplente";
    name: string;
    id?: string;
    idType?: string;
  }[];
  cancellationDate?: string | null;
  registrationDate: string | null;
  renewalDate: string | null;
  updatedDate?: string | null;
  rawRegistrationDate: string | null;
  rawCancellationDate?: string | null;
  isLegalEntity?: boolean;
  registrationNumber: string;
  shortName?: string;
  status: string;
  verificationDigit: number;
  idType?: string;
}
