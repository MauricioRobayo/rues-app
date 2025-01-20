"use client";

import { search } from "@/app/(search)/actions";
import { Recaptcha } from "@/app/(search)/components/Recaptcha";
import { SearchResults } from "@/app/(search)/components/SearchResults";
import { useNormalizedCompanyName } from "@/app/(search)/hooks/useNormalizedCompanyName";
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
import { useQuery } from "@tanstack/react-query";
import Form from "next/form";

export function Search() {
  const companyName = useNormalizedCompanyName();
  const { isPending, data } = useQuery({
    queryKey: [companyName],
    queryFn: async function searchByCompanyName({ queryKey }) {
      const companyName = queryKey.at(0);
      if (!companyName) {
        return;
      }
      const token = await window.grecaptcha.enterprise.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        { action: "SEARCH" },
      );
      return search({ companyName, token });
    },
    enabled: !!companyName,
  });
  return (
    <Box py={{ initial: "6", sm: "8" }}>
      <Flex direction="column" gap="8">
        <PageContainer size="2">
          <Recaptcha />
          <Flex direction="column" gap="4">
            <Heading>Buscar Empresa</Heading>
            <Form action="/">
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
                    defaultValue={companyName ?? undefined}
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
        {data && (
          <PageContainer size="2">
            <SearchResults results={data} />
          </PageContainer>
        )}
      </Flex>
    </Box>
  );
}
