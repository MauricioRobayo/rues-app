import { Link } from "@/app/components/Link";
import { PageContainer } from "@/app/components/PageContainer";
import { Flex, Heading, Text } from "@radix-ui/themes";

export default function NotFound() {
  return (
    <PageContainer size="2" my="8">
      <Flex direction="column" gap="4">
        <Heading as="h2">No hay nada acá :(</Heading>
        <Flex direction="column" gap="2">
          <Text>
            Si está buscando una empresa por NIT, recuerde usar sólo números y
            no ingresar el dígito de verificación cuando haga su búsqueda:
          </Text>
          <Link href="/?nit=">&rarr; Buscar NIT</Link>
        </Flex>
        <Flex direction="column" gap="2">
          <Text>
            También puede usar nuestro buscador de empresas por nombre:
          </Text>
          <Link href="/?razon-social=">&rarr; Buscar Razón Social</Link>
        </Flex>
      </Flex>
    </PageContainer>
  );
}
