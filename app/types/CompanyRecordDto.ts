export interface CompanyRecordDto {
  name: string;
  nit: number;
  formattedFullNit: string;
  isMain: boolean;
  slug: string;
  bidderId?: string | null;
  category?: string;
  chamber: { name: string; code: string };
  economicActivities: { label: string; code: string; description: string }[];
  isActive: boolean;
  lastRenewalYear: number | null;
  type?: string;
  legalRepresentative: {
    name: string;
    id?: string;
    idType?: string;
  } | null;
  cancellationDate?: string | null;
  registrationDate: string | null;
  renewalDate: string | null;
  updatedDate?: string | null;
  rawRegistrationDate: string | null;
  rawCancellationDate?: string | null;
  isLegalEntity?: boolean;
  legalEntity: string;
  registrationNumber: string;
  shortName?: string;
  status: string;
  verificationDigit: number;
  idType?: string;
}
