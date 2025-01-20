"use client";

import { search } from "@/app/(search)/actions";
import { Recaptcha } from "@/app/(search)/components/Recaptcha";
import { SearchResults } from "@/app/(search)/components/SearchResults";
import type { CompanySummary } from "@/app/shared/component/CompanyCard";
import { PageContainer } from "@/app/shared/component/PageContainer";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  TextField,
} from "@radix-ui/themes";
import Form from "next/form";
import { useState, useTransition } from "react";

export default function Page() {
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState<CompanySummary[] | null>(null);

  async function searchByCompanyName(companyName: string) {
    startTransition(async () => {
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
  return (
    <Box py={{ initial: "6", sm: "8" }}>
      <Flex direction="column" gap="8">
        <PageContainer size="2">
          <Recaptcha />
          <Flex direction="column" gap="4">
            <Heading>Buscar Empresa</Heading>
            <Form
              action="/"
              onSubmit={(e) => {
                const formData = new FormData(e.currentTarget);
                const companyName = formData.get("razon-social")?.toString();
                if (!companyName) {
                  return;
                }
                searchByCompanyName(companyName);
              }}
            >
              <Container size="1">
                <Grid
                  columns={{ initial: "1", sm: "1fr auto" }}
                  gapX="2"
                  gapY="4"
                >
                  <TextField.Root
                    id="razon-social"
                    name="razon-social"
                    placeholder="Razón Social..."
                    size="3"
                  >
                    <TextField.Slot>
                      <MagnifyingGlassIcon height="16" width="16" />
                    </TextField.Slot>
                  </TextField.Root>
                  <Button
                    style={{ backgroundColor: "var(--sky-11)", color: "white" }}
                    type="submit"
                    size="3"
                    loading={isPending}
                  >
                    Buscar
                  </Button>
                </Grid>
              </Container>
            </Form>
          </Flex>
        </PageContainer>
        <PageContainer size="2">
          <SearchResults results={results} />
        </PageContainer>
      </Flex>
    </Box>
  );
}
