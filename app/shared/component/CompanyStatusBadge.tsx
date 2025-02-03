import { Badge, type BadgeProps } from "@radix-ui/themes";

export function CompanyStatusBadge({
  isActive,
  size = "2",
  variant = "short",
}: {
  isActive: boolean;
  size?: BadgeProps["size"];
  variant?: "long" | "short";
}) {
  return (
    <Badge
      color={isActive ? "green" : "red"}
      size={size}
      variant="surface"
      style={{ textTransform: "uppercase" }}
    >
      {variant === "long" ? "Matrícula " : null}
      {isActive ? "Activa" : "Cancelada"}
    </Badge>
  );
}
