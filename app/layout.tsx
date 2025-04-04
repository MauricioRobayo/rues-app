import { Link } from "@/app/components/Link";
import { Logo } from "@/app/components/Logo";
import { Nit } from "@/app/components/Nit";
import { Recaptcha } from "@/app/components/Recaptcha";
import { GoogleTagManager } from "@next/third-parties/google";
import { Box, Container, Flex, Section, Text, Theme } from "@radix-ui/themes";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { Email } from "react-obfuscate-email";
import "./globals.css";

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

export const metadata: Metadata = {
  title: "Registro NIT",
  description: "Consulta de registros empresariales y NIT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CO">
      <Recaptcha siteKey={siteKey} language="es-419" />
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID ?? ""} />
      <body>
        <Theme accentColor="blue">
          <NextTopLoader showSpinner={false} color="var(--blue-9)" />
          <Flex direction="column" style={{ height: "100vh" }}>
            <Box
              style={{ background: "var(--blue-a2)" }}
              px={{ initial: "4", sm: "0" }}
              py="4"
            >
              <Container>
                <Flex dir="row" justify="between">
                  <header>
                    <div>
                      <Link underline="none" href="/">
                        <Logo />
                      </Link>
                    </div>
                  </header>
                  <Text color="blue" weight="bold">
                    <Nit />
                  </Text>
                </Flex>
              </Container>
            </Box>
            <main className="flex-grow">{children}</main>
            <Box
              className="bg-[var(--mauve-12)] text-white [&_a]:text-current"
              asChild
              px={{ initial: "4", sm: "0" }}
            >
              <Section size="2">
                <Container asChild>
                  <footer>
                    <Flex align="center" direction="column" gap="2">
                      <Email email="info@registronit.com" />
                      <Link href="/politica-de-privacidad" prefetch={false}>
                        Política de Privacidad
                      </Link>
                    </Flex>
                  </footer>
                </Container>
              </Section>
            </Box>
          </Flex>
        </Theme>
      </body>
    </html>
  );
}
