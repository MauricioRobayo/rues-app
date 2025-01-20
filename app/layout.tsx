import "@radix-ui/themes/styles.css";

import { Logo } from "@/app/(search)/components/Logo";
import { Nit } from "@/app/(search)/components/Nit";
import { GoogleTagManager } from "@next/third-parties/google";
import { Box, Flex, Text, Theme } from "@radix-ui/themes";
import type { Metadata } from "next";
import { Email } from "react-obfuscate-email";
import "./globals.css";
import { PageContainer } from "@/app/shared/component/PageContainer";
import { Link } from "@/app/shared/component/Link";
import NextTopLoader from "nextjs-toploader";

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
    <html lang="es-CO" style={{ overflowX: "hidden" }}>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID ?? ""} />
      <body>
        <Theme accentColor="sky">
          <NextTopLoader />
          <Flex direction="column" style={{ height: "100vh" }}>
            <Box style={{ background: "var(--sky-a2)" }}>
              <PageContainer py="4">
                <Flex dir="row" justify="between">
                  <header>
                    <div>
                      <Link underline="none" href="/">
                        <Logo />
                      </Link>
                    </div>
                  </header>
                  <Text color="sky" weight="bold">
                    <Nit />
                  </Text>
                </Flex>
              </PageContainer>
            </Box>
            <main style={{ flexGrow: 1 }}>{children}</main>
            <Box
              style={{ background: "var(--sky-11)", color: "white" }}
              asChild
              py="8"
            >
              <footer>
                <PageContainer>
                  <Flex align="center" direction="column">
                    <Email email="info@registronit.com" />
                  </Flex>
                </PageContainer>
              </footer>
            </Box>
          </Flex>
        </Theme>
      </body>
    </html>
  );
}
