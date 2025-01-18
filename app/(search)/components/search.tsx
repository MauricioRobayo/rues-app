"use client";

import { search } from "@/app/(search)/actions";
import { Recaptcha } from "@/app/(search)/components/Recaptcha";
import { SearchResults } from "@/app/(search)/components/SearchResults";
import type { BusinessRecord } from "@mauriciorobayo/rues-api";
import Form from "next/form";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Container } from "@radix-ui/themes";

export default function Page() {
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState<BusinessRecord[] | null>(null);
  const searchParams = useSearchParams();
  const companyName = searchParams.get("razon-social");
  useEffect(() => {
    async function getSearchResults() {
      if (!companyName) {
        return;
      }
      startTransition(async () => {
        if (!("grecaptcha" in window)) {
          return;
        }
        const token = await window.grecaptcha.enterprise.execute(
          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
          { action: "SEARCH" },
        );
        const data = await search({ companyName, token });
        if (data) {
          setResults(data);
        }
      });
    }
    getSearchResults();
  }, [companyName]);
  return (
    <Container>
      <Recaptcha />
      <Form
        className="flex w-full flex-col items-center gap-2 sm:flex-row"
        action="/"
      >
        <label htmlFor="razon-social">Razón Social</label>
        <input
          type="text"
          id="razon-social"
          name="razon-social"
          className="min-w-80 rounded-md border border-brand px-4 py-2"
          defaultValue={companyName ?? undefined}
        />
        <button
          disabled={isPending}
          className="w-full rounded-md border border-brand bg-brand px-4 py-2 text-white hover:bg-sky-800 disabled:bg-gray-200 sm:w-fit"
        >
          {isPending ? "&hellip;" : "Buscar"}
        </button>
      </Form>
      <SearchResults results={results} />
    </Container>
  );
}
