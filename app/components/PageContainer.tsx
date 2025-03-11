import { Container, ContainerProps } from "@radix-ui/themes";

interface PageContainerProps extends ContainerProps {
  wide?: boolean;
}
export function PageContainer({ wide = false, ...props }: PageContainerProps) {
  return <Container px="4" size={wide ? "4" : "2"} {...props} />;
}
