import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Nit } from "@/app/Nit";
import { montserrat, roboto_flex } from "@/app/fonts";
import { Logo } from "@/app/Logo";
import { Email } from "react-obfuscate-email";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export const metadata: Metadata = {
  title: "NIT Empresarial",
  description: "Generated by create next app",
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
        <main className="mx-auto max-w-4xl flex-grow px-4 md:px-0">
          {children}
        </main>
        <footer className="bg-brand text-white">
          <Container className="py-16 text-center">
            <Email email="info@rnit.com" />
          </Container>
        </footer>
      </body>
    </html>
  );
}

function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={twMerge("mx-auto max-w-4xl px-4 sm:px-0", className)}
    />
  );
}
