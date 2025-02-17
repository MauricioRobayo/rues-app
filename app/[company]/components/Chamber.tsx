import { CompanyDetails } from "@/app/[company]/components/CompanyDetails";
import { getChamber } from "@/app/services/chambers/service";
import { Text, Flex, Skeleton, Link } from "@radix-ui/themes";
import { unstable_cache } from "next/cache";
import { cache } from "react";

export async function Chamber({ code }: { code: number }) {
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
  return <CompanyDetails details={details} />;
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
