import { CompanyDetails } from "@/app/[company]/components/CompanyDetails";
import { getChamber } from "@/app/[company]/services/chambers";
import { Text, Flex, Skeleton } from "@radix-ui/themes";
import { unstable_cache } from "next/cache";
import { cache } from "react";

export async function Chamber({ code }: { code: number }) {
  const chamber = await getChamberCached(code);
  if (!chamber) {
    return <div>Algo salió mal.</div>;
  }
  return <CompanyDetails details={chamber} />;
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
