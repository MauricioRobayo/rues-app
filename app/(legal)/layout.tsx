import { PageContainer } from "@/app/components/PageContainer";
import type { ReactNode } from "react";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <PageContainer wide my="8" className="prose mx-auto">
      {children}
    </PageContainer>
  );
}
