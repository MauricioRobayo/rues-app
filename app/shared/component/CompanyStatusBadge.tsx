import { Badge, type BadgeProps } from "@radix-ui/themes";

export function CompanyStatusBadge({
  isActive,
  size = "1",
}: {
  isActive: boolean;
  size?: BadgeProps["size"];
}) {
  return (
    <Badge
      color={isActive ? "green" : "red"}
      size={size}
      variant="surface"
      style={{ textTransform: "uppercase" }}
    >
      {isActive ? "Activa" : "Cancelada"}
    </Badge>
  );
}
