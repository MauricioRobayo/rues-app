import type { BusinessRecord } from "@mauriciorobayo/rues-api";

export function dedupeResults<
  T extends Pick<BusinessRecord, "nit" | "estado_matricula">,
>(results: T[]) {
  const sortedResults = results.toSorted((a, b) => {
    if (a.nit !== b.nit) {
      return 0;
    }
    if (a.estado_matricula === "ACTIVA") {
      return 1;
    }
    return -1;
  });
  return Array.from(
    new Map(sortedResults.map((result) => [result.nit, result])).values(),
  );
}
