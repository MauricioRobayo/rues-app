export interface BusinessEstablishmentDto {
  name?: string;
  shortName?: string;
  type?: string;
  legalEntity?: string;
  category?: string;
  registrationNumber?: string;
  registrationDate?: string | null;
  rawRegistrationDate?: string | null;
  cancellationDate?: string | null;
  rawCancellationDate?: string | null;
  lastRenewalYear: number;
  status?: string;
  renewalDate: string | null;
  phoneNumbers?: string[];
  address?: string;
  economicActivityDescription?: string;
  economicActivities?: { label: string; code: string; description: string }[];
}
