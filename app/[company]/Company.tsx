export interface CompanyProps {
  documentType: string;
  nit: string;
  verificationDigit: string;
  registrationId: string;
  businessName: string;
  chamberName: string;
  registrationNumber: string;
  legalOrganization: string;
  registrationStatus: string;
  lastRenewedYear: string;
  category: string;
}

const CompanyInfoMap = {
  documentType: "Tipo de documento",
  registrationId: "Registro Mercantil",
  chamberName: "Ciudad",
  registrationNumber: "Matrícula",
  legalOrganization: "Forma jurídica",
  registrationStatus: "Estado",
  lastRenewedYear: "Último año de renovación",
};

export function Company({
  documentType,
  nit,
  verificationDigit,
  businessName,
}: CompanyProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-center uppercase text-balance">
        {businessName}
      </h1>
      <h2 className="text-2xl font-bold text-center uppercase text-balance">
        NIT de {nit}-{verificationDigit}
      </h2>
      <main>
        <dl className="divide-y divide-gray-200 border-t border-gray-200 border-b">
          {Object.entries(CompanyInfoMap).map(([key, label]) => (
            <Row key={key}>
              <dt>{label}</dt>
              <dd>{documentType}</dd>
            </Row>
          ))}
        </dl>
      </main>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row justify-between py-2">
      {children}
    </div>
  );
}
