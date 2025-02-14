export function parseCompanyPathSegment(pathSegment: string) {
  return {
    nit: Number(pathSegment.replace(/.*-/g, "")),
    slug: pathSegment.slice(0, pathSegment.lastIndexOf("-")),
  } as const;
}
