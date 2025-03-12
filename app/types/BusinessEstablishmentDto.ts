import type { TourismRegistryDto } from "@/app/types/TourismRegistryDto";

export interface BusinessEstablishmentDto {
  name?: string;
  shortName?: string;
  type?: string;
  legalEntity?: string;
  category?: string;
  registrationNumber?: string;
  registrationDate: string | null;
  cancellationDate?: string | null;
  lastRenewalYear: number;
  status?: string;
  renewalDate: string | null;
  phoneNumbers?: string[];
  address?: string;
  economicActivityDescription?: string;
  economicActivities?: { label: string; code: string; description: string }[];
  tourismRegistries?: TourismRegistryDto[];
}
