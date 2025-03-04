"use client";

import { searchByCompanyNameAction } from "@/app/(search)/actions";
import { SearchResults } from "@/app/(search)/components/SearchResults";
import { useNormalizedCompanyName } from "@/app/hooks/useNormalizedCompanyName";
import { Action, getRecaptchaToken } from "@/app/lib/getRecapchaToken";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
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

export function SearchName() {
  const companyName = useNormalizedCompanyName();
  const { isLoading, data, isError } = useQuery({
    queryKey: [companyName],
    queryFn: async ({ queryKey }) => {
      const companyName = queryKey.at(0);
      if (!companyName) {
        return;
      }
      const recaptchaToken = await getRecaptchaToken(Action.SEARCH);
      const company = await searchByCompanyNameAction({
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
    <Flex direction="column" gap="8">
      <Flex direction="column" gap="4">
        <Heading as="h2" size={{ initial: "4", sm: "6" }}>
          <label htmlFor="razon-social">Buscar empresa</label>
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
            <Grid columns={{ initial: "1", sm: "1fr auto" }} gapX="2" gapY="4">
              <TextField.Root
                autoFocus
                defaultValue={companyName ?? undefined}
                disabled={isLoading}
                id="razon-social"
                name="razon-social"
                placeholder="Razón Social..."
                required
                size="3"
              >
                <TextField.Slot>
                  <MagnifyingGlassIcon height="16" width="16" />
                </TextField.Slot>
              </TextField.Root>
              <Button type="submit" size="3" loading={isLoading}>
                Buscar
              </Button>
            </Grid>
          </Container>
        </Form>
      </Flex>
      {isError && (
        <Text color="red">
          Algo ha salido mal. Por favor, vuelva a intentarlo en unos minutos.
        </Text>
      )}
      {data && <SearchResults results={data} />}
    </Flex>
  );
}
