export interface PenaltyDto {
  stateCode: string;
  chamberCode: string;
  registryBookCode: string;
  nonComplianceCondition: string;
  sanctionDescription: string;
  entityVerificationDigit: string;
  bidderVerificationDigit: string;
  state: string;
  administrativeActDate: string | null;
  confirmationActDate: string | null;
  revocationActDate: string | null;
  suspensionActDate: string | null;
  enforcementDate: string | null;
  chamberRegistrationDate: string | null;
  legalBasis: string;
  entityMunicipality: string;
  entityNit: string;
  bidderNit: string;
  entityName: string;
  bidderName: string;
  administrativeActNumber: string;
  confirmationActNumber: string;
  enforcementActNumber: string;
  revocationActNumber: string;
  suspensionActNumber: string;
  contractNumber: string;
  registrationBookNumber: string;
  remarks: string;
  entitySectional: string;
  reportType: string;
  sanctionValidity: string | null;
}
