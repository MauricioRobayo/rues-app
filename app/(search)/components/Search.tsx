"use client";

import { SearchName } from "@/app/(search)/components/SearchName";
import { SearchNit } from "@/app/(search)/components/SearchNit";
import { Box, Tabs } from "@radix-ui/themes";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const tabs = {
  companyName: "razon-social",
  nit: "nit",
};

export function Search({ randomCompanyNit }: { randomCompanyNit: string }) {
  const [selectedValues, setSelectedValues] = useState<
    Record<string, string | null>
  >({});
  const searchParams = useSearchParams();
  const companyName = searchParams.get(tabs.companyName);
  const tab = companyName !== null ? tabs.companyName : tabs.nit;
  return (
    <Tabs.Root
      value={tab}
      onValueChange={(tab) => {
        const query = `?${tab}=${selectedValues[tab] ?? ""}`;
        const currentValues = Object.fromEntries(
          Object.values(tabs).map((t) => [
            t,
            (t === tab ? selectedValues[t] : searchParams.get(t)) ?? "",
          ]),
        );
        setSelectedValues(currentValues);
        window.history.pushState(null, "", query);
      }}
    >
      <Tabs.List>
        <Tabs.Trigger value="nit">NIT</Tabs.Trigger>
        <Tabs.Trigger value="razon-social">Razón Social</Tabs.Trigger>
      </Tabs.List>
      <Box pt="3">
        <Tabs.Content value="nit" asChild>
          <Box py={{ initial: "6", sm: "8" }}>
            <SearchNit randomCompanyNit={randomCompanyNit} />
          </Box>
        </Tabs.Content>
        <Tabs.Content value="razon-social" asChild>
          <Box py={{ initial: "6", sm: "8" }}>
            <SearchName />
          </Box>
        </Tabs.Content>
      </Box>
    </Tabs.Root>
  );
}
