import { Container, Section } from "@radix-ui/themes";
import type { ReactNode } from "react";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <Container className="prose mx-auto">
      <Section>{children}</Section>
    </Container>
  );
}
