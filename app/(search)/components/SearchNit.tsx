"use client";

import { Link } from "@/app/shared/components/Link";
import { BASE_URL } from "@/app/shared/lib/constants";
import { formatNit } from "@/app/shared/lib/formatNit";
import { validateNit } from "@/app/shared/lib/validateNit";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  InfoCircledIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import {
  Box,
  Button,
  Callout,
  Code,
  Flex,
  Heading,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import Form from "next/form";
import { useSearchParams } from "next/navigation";
import { getVerificationDigit } from "nit-verifier";
import { useState, type ChangeEvent } from "react";

export function SearchNit() {
  const searchParams = useSearchParams();
  const nit = searchParams.get("nit") ?? "";
  const [value, setValue] = useState(nit);
  const isValidNit = validateNit(value);
  const fullNit = formatNit(value);
  const { isLoading, data } = useQuery({
    queryKey: [nit],
    queryFn: async ({ queryKey }) => {
      const nit = queryKey.at(0);
      const response = await fetch(`/${nit}`, {
        method: "HEAD",
      });
      return {
        ok: response.ok,
        status: response.status,
        nit,
      };
    },
    enabled: validateNit(nit),
  });
  const onChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedNit = e.target.value.slice(0, 10);
    setValue(selectedNit);
  };
  return (
    <Flex direction="column" gap="4">
      <Flex asChild gap="2">
        <Heading as="h2" size={{ initial: "4", sm: "6" }}>
          <label htmlFor="razon-social">
            Buscar NIT{isValidNit ? ":" : ""}
          </label>
          {isValidNit && (
            <Flex align="center" gap="2">
              {data?.nit === value && data?.ok ? (
                <Link href={`/${value}`}>{fullNit}</Link>
              ) : (
                <Text color="gray" weight="light">
                  {fullNit}
                </Text>
              )}
              {data?.nit === value && data?.status === 404 && (
                <CrossCircledIcon color="red" height="24" width="24" />
              )}
              {data?.nit === value && data?.ok && (
                <CheckCircledIcon color="green" height="24" width="24" />
              )}
            </Flex>
          )}
        </Heading>
      </Flex>
      <Flex
        direction={{ initial: "column", sm: "row" }}
        gapX="2"
        gapY="4"
        asChild
      >
        <Form action="/">
          <Flex gap="1" align="center">
            <Box width={{ initial: "100%", sm: "12rem" }}>
              <TextField.Root
                required
                id="nit"
                size="3"
                name="nit"
                placeholder="NIT"
                onChange={onChangeHandler}
                value={value}
                type="number"
              >
                <TextField.Slot>
                  <MagnifyingGlassIcon height="16" width="16" />
                </TextField.Slot>
                {isValidNit && (
                  <TextField.Slot>
                    <Text>DV {getVerificationDigit(value)}</Text>
                  </TextField.Slot>
                )}
              </TextField.Root>
            </Box>
          </Flex>
          <Button
            type="submit"
            size="3"
            loading={isLoading}
            disabled={!isValidNit}
          >
            Buscar
          </Button>
        </Form>
      </Flex>
      {isValidNit && data?.nit === value ? (
        <>
          {data?.ok && (
            <Flex direction="column" gap="2">
              <Text>
                El NIT{" "}
                <Link href={`/${value}`}>
                  <Text weight="bold">{fullNit}</Text>
                </Link>{" "}
                es válido y la información empresarial puede ser consultada en:
              </Text>
              <Link href={`/${value}`} underline="always">
                <Text>{BASE_URL}/</Text>
                <Text weight="bold">{value}</Text>
              </Link>
            </Flex>
          )}
          {data?.status === 404 && (
            <Text>
              No tenemos información asociada al NIT{" "}
              <Text weight="bold">{fullNit}</Text>.
            </Text>
          )}
        </>
      ) : null}
      <Callout.Root color="green">
        <Callout.Icon>
          <InfoCircledIcon />
        </Callout.Icon>
        <Callout.Text>
          Puede consultar la información empresarial de cualquier NIT
          añadiéndolo al final de la URL. Por ejemplo:{" "}
          <Link href="/899999068" prefetch={false}>
            https://www.registronit.com/
            <Text weight="bold">899999068</Text>
          </Link>
          , en donde{" "}
          <Text weight="bold">
            <Code>899999068</Code>
          </Text>{" "}
          es el NIT que desea consultar.
        </Callout.Text>
      </Callout.Root>
    </Flex>
  );
}
