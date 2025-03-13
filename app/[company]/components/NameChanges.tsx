import { CopyButton } from "@/app/[company]/components/CopyButton";
import { DataList } from "@/app/[company]/components/DataList";
import { ExpandableList } from "@/app/[company]/components/ExpandableList";
import { getChamber } from "@/app/lib/chambers";
import type { CompanyNameChangeDto } from "@/app/types/CompanyNameChangeDto";
import { Box, Code, Flex, Heading, Section, Text } from "@radix-ui/themes";

export function NameChanges({ changes }: { changes?: CompanyNameChangeDto[] }) {
  const nameChanges = (changes ?? []).map((nameChange) => {
    const chamber = getChamber(nameChange.chamberCode);
    console.log(chamber?.name);
    return {
      name: nameChange.previousName,
      registrationNumber: nameChange.registrationNumber,
      date: nameChange.date,
      details: [
        { label: "Razón Social", value: nameChange.previousName },
        { label: "Fecha del cambio", value: nameChange.date },
        {
          label: "Matrícula",
          value: nameChange.registrationNumber ? (
            <Flex align="center" gap="2">
              <Code variant="ghost">{nameChange.registrationNumber}</Code>
              <CopyButton value={nameChange.registrationNumber} />
            </Flex>
          ) : null,
        },
        {
          label: "Cámara de Comercio",
          value: chamber?.name.replace(
            /Cámara de comercio (de la|del|de) /i,
            "",
          ),
        },
      ],
    };
  });

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
          <ExpandableList
            items={nameChanges.map((nameChange) => (
              <li key={`${nameChange.name}-${nameChange.date}`}>
                <details>
                  <Text truncate asChild>
                    <summary>
                      {nameChange.name || nameChange.registrationNumber}
                    </summary>
                  </Text>
                  <Box my="4" pl="4">
                    <DataList items={nameChange.details} />
                  </Box>
                </details>
              </li>
            ))}
          />
        </ul>
      </Flex>
    </Section>
  );
}
