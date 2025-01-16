"use client";

import { Badge } from "@/app/[company]/components/Badge";
import { formatNit } from "@/app/format-nit";
import { slugifyCompanyName } from "@/app/utils/slugify-company-name";
import type { BusinessRecord } from "@mauriciorobayo/rues-api";
import Link from "next/link";

export function SearchResults({
  results,
}: {
  results: BusinessRecord[] | null;
}) {
  if (!results) {
    return null;
  }

  if (results.length === 0) {
    return <div>No se encontraron resultados.</div>;
  }
  console.log("results", results);

  return (
    <ul className="flex flex-col gap-4">
      {results.map((result) => {
        const companyUrl = `/${slugifyCompanyName(result.razon_social)}-${result.nit}`;
        const isActive = result.estado_matricula === "ACTIVA";
        return (
          <li
            key={result.id_rm}
            className="rounded-sm border bg-slate-50 px-4 py-2 shadow-sm"
          >
            <Link href={companyUrl}>
              <h2 className="text-balance">{result.razon_social}</h2>
              <div className="flex gap-2">
                <h3 className="text-slate-600">
                  NIT: {formatNit(Number(result.nit))}
                </h3>
                <Badge variant={isActive ? "success" : "error"}>
                  {result.estado_matricula}
                </Badge>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
