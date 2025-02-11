import { VALID_RUES_CATEGORIES } from "@/app/shared/lib/constants";
import { validateNit } from "@/app/shared/lib/validateNit";
import type { BusinessRecord } from "@mauriciorobayo/rues-api";

export function dedupeResults<
  T extends Pick<
    BusinessRecord,
    "nit" | "estado_matricula" | "ultimo_ano_renovado"
  >,
>(results: T[]) {
  return [...Map.groupBy(results, ({ nit }) => nit).values()].map(
    (groupResults) => {
      const activeResult = groupResults.find(
        ({ estado_matricula }) => estado_matricula === "ACTIVA",
      );
      return activeResult
        ? activeResult
        : groupResults.toSorted(
            (a, b) =>
              Number(b.ultimo_ano_renovado) - Number(a.ultimo_ano_renovado),
          )[0];
    },
  );
}

export function processAdvancedSearchResults(results: BusinessRecord[]) {
  return dedupeResults(
    (results ?? []).filter(
      (record) =>
        validateNit(Number(record.nit)) &&
        VALID_RUES_CATEGORIES.includes(record.categoria),
    ),
  );
}
