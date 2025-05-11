"use client";

import { Link } from "@/app/components/Link";
import { formatNit } from "@/app/lib/formatNit";
import { validateNit } from "@/app/lib/validateNit";
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
  Strong,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import Form from "next/form";
import { useSearchParams } from "next/navigation";
import { getVerificationDigit } from "nit-verifier";
import { useState, type ChangeEvent } from "react";
import { twMerge } from "tailwind-merge";

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
            <Box width={{ initial: "100%", sm: "14rem" }}>
              <TextField.Root
                autoFocus
                id="nit"
                name="nit"
                onChange={onChangeHandler}
                placeholder="NIT"
                required
                size="3"
                type="number"
                value={value}
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
            <Box>
              <Text>
                El NIT{" "}
                <Link href={`/${value}`}>
                  <Strong>{fullNit}</Strong>
                </Link>{" "}
                es válido y la información empresarial correspondiente puede ser
                consultada en:{" "}
              </Text>
              <NitInformationalLink
                nit={isValidNit ? value : "899999068"}
                highlightNit={isValidNit}
              />
            </Box>
          )}
          {data?.status === 404 && (
            <Text>
              No tenemos información asociada al NIT <Strong>{fullNit}</Strong>.
            </Text>
          )}
        </>
      ) : null}
      <Callout.Root color="green" variant="soft">
        <Callout.Icon>
          <InfoCircledIcon />
        </Callout.Icon>
        <Callout.Text>
          Consulte cualquier NIT agregándolo directamente al enlace, sin signos
          de puntuación ni dígito de verificación:{" "}
          <NitInformationalLink
            nit={isValidNit ? value : "899999068"}
            highlightNit={isValidNit}
          />
        </Callout.Text>
      </Callout.Root>
    </Flex>
  );
}

function NitInformationalLink({
  nit,
  highlightNit = false,
}: {
  nit: string;
  highlightNit: boolean;
}) {
  return (
    <Link href={nit} prefetch={false} underline="hover">
      <Text asChild className="tracking-wide">
        <Code variant="ghost">
          registronit.com/
          <Text
            className={twMerge(
              "underline decoration-wavy",
              highlightNit ? "decoration-2" : "decoration-1",
            )}
            weight={highlightNit ? "bold" : "regular"}
            color={highlightNit ? "blue" : undefined}
            as="span"
          >
            {nit}
          </Text>
        </Code>
      </Text>
    </Link>
  );
}
