import { Container, ContainerProps } from "@radix-ui/themes";

interface PageContainerProps extends ContainerProps {
  variant?: "narrow" | "wide";
}
export function PageContainer({
  variant = "wide",
  ...props
}: PageContainerProps) {
  return <Container px="4" size={variant === "wide" ? "4" : "2"} {...props} />;
}
