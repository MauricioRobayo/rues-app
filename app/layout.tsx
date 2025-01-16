import { Container } from "@/app/(search)/components/Container";
import { Logo } from "@/app/(search)/components/Logo";
import { Nit } from "@/app/(search)/components/Nit";
import { montserrat, roboto_flex } from "@/app/fonts";
import type { Metadata } from "next";
import Link from "next/link";
import { Email } from "react-obfuscate-email";
import "./globals.css";

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
    <html
      lang="es-CO"
      className={`${roboto_flex.variable} ${montserrat.variable}`}
    >
      <body className="space-between flex h-svh flex-col">
        <header className="bg-brand/5 text-brand">
          <Container className="flex items-center justify-between py-2">
            <div>
              <Link href="/">
                <Logo />
              </Link>
            </div>
            <Nit className="font-bold tracking-wide" />
          </Container>
        </header>
        <main className="flex-grow">{children}</main>
        <footer className="bg-brand text-white">
          <Container className="py-8 text-center">
            <Email email="info@rnit.com" />
          </Container>
        </footer>
      </body>
    </html>
  );
}
