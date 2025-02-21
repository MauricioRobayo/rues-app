import { DataList } from "@/app/[company]/components/DataList";
import { getChamber } from "@/app/services/chambers/service";
import { Text, Flex, Skeleton, Link, Heading, Section } from "@radix-ui/themes";
import { unstable_cache } from "next/cache";
import { cache, Suspense } from "react";

export function CommerceChamber({ code }: { code: string }) {
  return (
    <Section size="2" id="camara-de-comercio">
      <Heading as="h3" size="4" mb="2">
        Cámara de Comercio
      </Heading>
      <Suspense fallback={<ChamberSkeleton />}>
        <CommerceChamberDetails code={code} />
      </Suspense>
    </Section>
  );
}

async function CommerceChamberDetails({ code }: { code: string }) {
  const chamber = await getChamberCached(code);

  if (!chamber?.name) {
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

  if (!chamber) {
    return <div>Algo salió mal.</div>;
  }
  return <DataList items={details} />;
}

export function ChamberSkeleton() {
  const placeholders = [
    ["Nombre", "Cámara de comercio de algún lado"],
    ["Dirección", "Algún lugar en algún lado"],
    ["Ciudad", "Alguna lugar"],
    ["Departamento", "Algún lado"],
  ];

  return (
    <Flex direction="column" gap="4">
      {placeholders.map((placeholder) => (
        <Flex key={placeholder.join()} direction="column" gap="2">
          {placeholder.map((item) => (
            <Text key={item}>
              <Skeleton>{item}</Skeleton>
            </Text>
          ))}
        </Flex>
      ))}
    </Flex>
  );
}

const getChamberCached = unstable_cache(cache(getChamber), undefined, {
  revalidate: false, // cache indefinitely or until matching
});
