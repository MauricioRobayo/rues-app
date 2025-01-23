export function dedupeResults(
  results: {
    estado: string;
    nit: string;
  }[],
) {
  const sortedResults = results.toSorted((a, b) => {
    if (a.nit !== b.nit) {
      return 0;
    }
    if (a.estado === "ACTIVA") {
      return 1;
    }
    return -1;
  });
  return Array.from(
    new Map(sortedResults.map((result) => [result.nit, result])).values(),
  );
}
