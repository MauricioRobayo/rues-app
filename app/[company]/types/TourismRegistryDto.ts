export interface TourismRegistryDto {
  id: string;
  name?: string;
  status: string;
  lastUpdatedYear: string;
  category?: string;
  subCategory?: string;
  municipality?: string;
  department?: string;
  commercialAddress?: string;
  landlinePhone?: string;
  mobilePhone?: string;
  notificationMunicipality?: string;
  notificationDepartment?: string;
  notificationAddress?: string;
  notificationPhone?: string;
  email?: string;
  employees?: string;
  providerCompanyName?: string;
  providerNIT: string;
  providerDV?: string;
  legalRepresentative?: string;
  legalRepresentativeId?: string;
  providerPhone?: string;
  providerEmail?: string;
}
