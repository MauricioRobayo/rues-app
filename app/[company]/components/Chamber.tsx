import { chambers } from "@/app/lib/chambers";
import { DataList } from "@/app/[company]/components/DataList";
import { Heading, Link, Section } from "@radix-ui/themes";

export function CommerceChamber({ code }: { code: string }) {
  const chamber = getChamber(code);

  if (!chamber) {
    return null;
  }

  const details = [
    {
      label: "Nombre",
      value: chamber.url ? (
        <Link href={chamber.url} target="_blank">
          {chamber.name}
        </Link>
      ) : (
        chamber.name
      ),
    },
    { label: "Dirección", value: chamber.address },
    { label: "Ciudad", value: chamber.city },
    { label: "Departamento", value: chamber.state },
    { label: "Teléfono", value: chamber.phoneNumber },
    {
      label: "Correo electrónico",
      value: chamber.email ? (
        <Link href={`mailto:${chamber.email}`}>{chamber.email}</Link>
      ) : null,
    },
    {
      label: "Certificado Cámara de Comercio",
      value: chamber.certificateUrl && (
        <Link href={chamber.certificateUrl} target="_blank">
          Solicitar certificado en línea
        </Link>
      ),
    },
  ];

  return (
    <Section size="2" id="camara-de-comercio">
      <Heading as="h3" size="4" mb="2">
        Cámara de Comercio
      </Heading>
      <DataList items={details} />;
    </Section>
  );
}

function isChamberCode(code: string): code is keyof typeof chambers {
  return code in chambers;
}

function getChamber(code: string) {
  if (isChamberCode(code)) {
    return chambers[code];
  }

  return null;
}
