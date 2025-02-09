"use client";

import { searchByCompanyName } from "@/app/(search)/actions";
import { SearchResults } from "@/app/(search)/components/SearchResults";
import { useNormalizedCompanyName } from "@/app/(search)/hooks/useNormalizedCompanyName";
import { PageContainer } from "@/app/shared/components/PageContainer";
import { Action, getRecaptchaToken } from "@/app/shared/lib/getRecapchaToken";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import Form from "next/form";

export function Search() {
  const companyName = useNormalizedCompanyName();
  const { isLoading, data, isError } = useQuery({
    queryKey: [companyName],
    queryFn: async ({ queryKey }) => {
      const companyName = queryKey.at(0);
      if (!companyName) {
        return;
      }
      const recaptchaToken = await getRecaptchaToken(Action.SEARCH);
      const company = await searchByCompanyName({
        companyName,
        recaptchaToken,
      });
      if (!company) {
        throw new Error("Search fetch failed");
      }
      return company;
    },
    enabled: !!companyName,
  });
  return (
    <Box py={{ initial: "6", sm: "8" }}>
      <Flex direction="column" gap="8">
        <PageContainer size="2">
          <Flex direction="column" gap="4">
            <Heading>
              Buscar Empresa
              {companyName && (
                <>
                  :{" "}
                  <Text color="gray" weight="light">
                    {companyName}
                  </Text>
                </>
              )}
            </Heading>
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
                    disabled={isLoading}
                  >
                    <TextField.Slot>
                      <MagnifyingGlassIcon height="16" width="16" />
                    </TextField.Slot>
                  </TextField.Root>
                  <Button
                    style={{ backgroundColor: "var(--blue-9)", color: "white" }}
                    type="submit"
                    size="3"
                    loading={isLoading}
                  >
                    Buscar
                  </Button>
                </Grid>
              </Container>
            </Form>
          </Flex>
        </PageContainer>
        <PageContainer size="2">
          {isError && (
            <Text color="red">
              Algo ha salido mal. Por favor, vuelva a intentarlo en unos
              minutos.
            </Text>
          )}
          {data && <SearchResults results={data} />}
        </PageContainer>
      </Flex>
    </Box>
  );
}
