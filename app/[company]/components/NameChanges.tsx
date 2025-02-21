import { CopyButton } from "@/app/[company]/components/CopyButton";
import { DataList } from "@/app/[company]/components/DataList";
import type { CompanyNameChangeDto } from "@/app/types/CompanyNameChangeDto";
import { Text, Box, Code, Flex, Heading, Section } from "@radix-ui/themes";

export function NameChanges({ changes }: { changes?: CompanyNameChangeDto[] }) {
  const nameChanges = (changes ?? []).map((nameChange) => ({
    registrationNumber: nameChange.registrationNumber,
    name: nameChange.previousName,
    details: [
      { label: "Razón Social", value: nameChange.previousName },
      { label: "Fecha del cambio", value: nameChange.date },
      {
        label: "Matrícula",
        value: (
          <Flex align="center" gap="2">
            <Code variant="ghost">{nameChange.registrationNumber}</Code>
            <CopyButton value={nameChange.registrationNumber} />
          </Flex>
        ),
      },
    ],
  }));

  if (nameChanges.length === 0) {
    return null;
  }

  return (
    <Section size="2" id="establecimientos-comerciales">
      <Heading as="h3" size="4" mb="4">
        Cambios de Razón Social
      </Heading>
      <Flex asChild direction="column" gap="2">
        <ul>
          {nameChanges.map((nameChange) => (
            <li key={`${nameChange.name}-${nameChange.registrationNumber}`}>
              <details>
                <Text truncate asChild>
                  <summary>{nameChange.name}</summary>
                </Text>
                <Box my="4" pl="4">
                  <DataList items={nameChange.details} />
                </Box>
              </details>
            </li>
          ))}
        </ul>
      </Flex>
    </Section>
  );
}
