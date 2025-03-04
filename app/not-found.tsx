import { Link } from "@/app/components/Link";
import { PageContainer } from "@/app/components/PageContainer";
import { Flex, Heading, Text } from "@radix-ui/themes";

export default function NotFound() {
  return (
    <PageContainer variant="narrow" my="8">
      <Flex direction="column" gap="4">
        <Heading as="h2">No hay nada acá :(</Heading>
        <Flex direction="column" gap="2">
          <Text>
            Si está buscando una empresa por NIT, recuerde usar sólo números y
            no ingresar el dígito de verificación cuando haga su búsqueda:
          </Text>
          <Text>
            &rarr; <Link href="/?nit=">Buscar NIT</Link>
          </Text>
        </Flex>
        <Flex direction="column" gap="2">
          <Text>
            También puede usar nuestro buscador de empresas por nombre:
          </Text>
          <Text>
            &rarr; <Link href="/?razon-social=">Buscar Razón Social</Link>
          </Text>
        </Flex>
      </Flex>
    </PageContainer>
  );
}
