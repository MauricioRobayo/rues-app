import { Details } from "@/app/[company]/components/Details";
import { currencyFormatter } from "@/app/lib/formatters";
import type { CapitalInformationDto } from "@/app/types/CapitalDto";
import { Section, Heading } from "@radix-ui/themes";
import { DataList } from "@/app/[company]/components/DataList";

export function CapitalDetails({
  capitalDetails,
}: {
  capitalDetails?: CapitalInformationDto[];
}) {
  const capitalInformation = capitalDetails
    ?.toSorted((a, b) => b.capitalModificationDate - a.capitalModificationDate)
    .map((info) => [
      {
        label: "Fecha de modificación del capital",
        value: info.capitalModificationDate,
      },
      {
        label: "Capital social",
        value: info.shareCapital
          ? currencyFormatter.format(info.shareCapital)
          : info.shareCapital,
      },
      {
        label: "Capital autorizado",
        value: info.authorizedCapital
          ? currencyFormatter.format(info.authorizedCapital)
          : info.authorizedCapital,
      },
      {
        label: "Capital suscrito",
        value: info.subscribedCapital
          ? currencyFormatter.format(info.subscribedCapital)
          : info.subscribedCapital,
      },
      {
        label: "Capital pagado",
        value: info.paidCapital
          ? currencyFormatter.format(info.paidCapital)
          : info.paidCapital,
      },
    ])
    .at(0);

  if (!capitalInformation) {
    return null;
  }

  return (
    <Section size="2" id="informacion-de-capitales">
      <Heading as="h3" size="4" mb="2">
        Información de Capitales
      </Heading>
      <Details summary="Ver información de capitales">
        <DataList items={capitalInformation} />
      </Details>
    </Section>
  );
}
