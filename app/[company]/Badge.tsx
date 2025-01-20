import { Badge } from "@radix-ui/themes";

export function CompanyStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge
      color={isActive ? "green" : "red"}
      size="1"
      variant="surface"
      style={{ textTransform: "uppercase" }}
    >
      {isActive ? "Activa" : "Cancelada"}
    </Badge>
  );
}
