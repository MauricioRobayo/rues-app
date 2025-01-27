import { VALID_RUES_CATEGORIES } from "@/app/shared/lib/constants";
import { isValidNit } from "@/app/shared/lib/isValidNit";
import type { BusinessRecord } from "@mauriciorobayo/rues-api";

export function dedupeResults<
  T extends Pick<BusinessRecord, "nit" | "estado_matricula">,
>(results: T[]) {
  return [...Map.groupBy(results, ({ nit }) => nit).values()]
    .map((groupResults) =>
      groupResults.toSorted((a, b) => {
        if (a.nit !== b.nit) {
          return 0;
        }
        if (a.estado_matricula === "ACTIVA") {
          return 1;
        }
        return -1;
      }),
    )
    .flatMap((groupResults) =>
      Array.from(
        new Map(groupResults.map((result) => [result.nit, result])).values(),
      ),
    );
}

export function processAdvancedSearchResults(results: BusinessRecord[]) {
  return dedupeResults(
    (results ?? []).filter(
      (record) =>
        isValidNit(Number(record.nit)) &&
        VALID_RUES_CATEGORIES.includes(record.categoria),
    ),
  );
}
